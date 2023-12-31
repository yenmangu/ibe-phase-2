import { Injectable } from '@angular/core';

import {
	Subject,
	Subscription,
	takeUntil,
	take,
	firstValueFrom,
	filter,
	first,
	tap,
	from,
	Observable,
	switchMap,
	catchError,
	throwError
} from 'rxjs';
import { tag } from 'rxjs-spy/cjs/operators';

import { IndexedDatabaseService } from './indexed-database.service';
import { IndexedDatabaseStatusService } from '../../../shared/services/indexed-database-status.service';
import { SharedDataService } from '../../../shared/services/shared-data.service';
import { ApiDataProcessingService } from './api/api-data-processing.service';
@Injectable({
	providedIn: 'root'
})
export class ProcessCurrentDataService {
	matchTypeSubscription: Subscription;
	currentMatchType: string = '';
	isDBinitialised: boolean = false;
	private destroy$ = new Subject<void>();

	constructor(
		private indexedDB: IndexedDatabaseService,
		private sharedDataService: SharedDataService,
		private indexedDatabaseStatus: IndexedDatabaseStatusService,
		private apiProcessing: ApiDataProcessingService
	) {}

	async getData(storeName, key) {
		try {
			// console.log(` ${storeName}`)
			await firstValueFrom(
				this.indexedDatabaseStatus.isInitialised$.pipe(
					tag('process-match-data is init sub'),
					filter(isInitialised => isInitialised),
					first(),
					take(1)
				)
			);

			const data = await this.indexedDB.readFromDB([`${storeName}`], key);
			return data;
		} catch (err) {
			console.error('Error getting data: ', err);
			throw err;
		}
	}

	getInitialTableData(): Observable<any> {
		return from(
			this.indexedDatabaseStatus.isInitialised$.pipe(
				filter(isInitialised => isInitialised),
				first(),
				take(1)
			)
		).pipe(
			switchMap(() => this.fetchAndProcessCurrentGameData()),
			catchError(err => {
				console.error('Error getting current movement data', err);
				return throwError(() => err);
			})
		);
	}

	private async fetchAndProcessCurrentGameData() {
		try {
			const store = 'current_game_data';
			const movement = await this.indexedDB.readFromDB([store], 'movementtxt');
			const people = await this.indexedDB.readFromDB([store], 'namestxt');
			const teams = await this.indexedDB.readFromDB([store], 'teamnamestxt');

			const sides = await this.indexedDB.readFromDB([store], 'sidenamestxt');
			const settingsText = await this.indexedDB.readFromDB([store], 'settingstxt');
			// console.log(settingsText);
			console.log('people initial: ', people);
			const movementValue = this.destructureValue(movement, 'current_game_data');
			const peopleValue = this.destructureValue(people, 'current_game_data');
			const teamsValue = this.destructureAndSplitTeams(teams);
			const sidesValue = this.destructureAndSplitTeams(sides);
			const matchTypeObject = this.getMatchType(settingsText);
			console.log('movement value: ', movementValue);
			console.log('people value: ', peopleValue);

			const currentGameConfig = this.buildCurrentGameObject(
				movementValue,
				peopleValue,
				teamsValue,
				sidesValue,
				matchTypeObject
			);
			return currentGameConfig;
		} catch (err) {
			console.error('Error getting current movement data', err);
			throw err;
		}
	}

	private splitUnevenArray(array) {
		const half = Math.floor(array.length / 2);

		if (array.length % 2 === 0) {
			// If the length is even, split it into two equal parts
			const part1 = array.slice(0, half);
			const part2 = array.slice(half);
			return [part1, part2];
		} else {
			// If the length is odd, split it into two parts and include the remainder as the third part
			const part1 = array.slice(0, half);
			const part2 = array.slice(half, half * 2);
			const remainder = array.slice(half * 2);
			return [part1, part2, remainder];
		}
	}

	private splitArray(array) {
		const half = Math.floor(array.length / 2);
		if (array.length % 2 === 0) {
			return [[array.slice(0, half)], [array.slice(half)]];
		} else {
			return [[array.slice(0, half)], [array.slice(half)]];
		}
	}

	private buildCurrentGameObject(movement, people, teams, sides, matchTypeObject) {
		const cleanedMovement = this.processMovementText(movement);
		console.log('cleaned movement: ', cleanedMovement);
		const numOfTables = cleanedMovement[1][1];
		console.log('num of tables: ', numOfTables);

		const teamsOrPairs = this.processNamesText(people, numOfTables);
		let dataObj: any = {};
		dataObj.rounds = cleanedMovement[1][4];
		dataObj.players = this.splitUnevenArray(teamsOrPairs);
		const tableNumbers = teamsOrPairs.length / 2;
		dataObj.tableNumbers = tableNumbers;
		const tableArray = [];
		for (let i = 0; i < dataObj.players[0].length; i++) {
			const team = [dataObj.players[0][i], dataObj.players[1][i]];
			tableArray.push(team);
		}
		dataObj.tables = tableArray;
		dataObj.playerConfig = this.extractPairs(dataObj.players);

		const { north, south, east, west } = dataObj.playerConfig;
		const currentGame: any = {
			playerConfig: {
				north: north,
				south: south,
				east: east,
				west: west
			}
		};
		currentGame.tables = this.createTablesOject(north, south, east, west);
		const index = currentGame.playerConfig.north.length;
		teams.splice(index);

		currentGame.teamConfig = {};

		teams.forEach((team, index) => {
			currentGame.teamConfig[index] = {};
			currentGame.teamConfig[index].teamName = team;
			// currentGame.teamConfig[team].tables
			const tableArray = currentGame.tables[index + 1];
			currentGame.teamConfig[index].tables = tableArray;
		});

		currentGame.teams = teams;
		currentGame.isTeams = true;

		const { matchType, sidesOf } = matchTypeObject;
		currentGame.matchType = matchType;
		currentGame.sidesOf = sidesOf;

		const extractedSides = this.extractSides(sides, teams, sidesOf);

		const sideTeamMap = this.assignSideIndices(
			currentGame.sidesOf,
			currentGame.teams,
			extractedSides,
			tableNumbers
		);
		currentGame.sideTeamMap = sideTeamMap;
		const { totalSides } = sideTeamMap;
		if (extractedSides.length !== 0) {
			currentGame.sides = extractedSides;
			currentGame.isSides = true;
		}
		return currentGame;
	}

	private extractSides(sides, teams, sidesOf) {
		const playersPerSide = sidesOf / 4;
		const totalSides = Math.floor(teams.length / playersPerSide);
		return sides.slice(0, totalSides);
	}

	private assignSideIndices(sidesOf, teams, extractedSides, tableNumbers) {
		const playersPerSide = sidesOf / 4;
		const sideTeamMap: any = {
			totalSides: extractedSides.length
		};
		extractedSides.forEach((sideName, sideIndex) => {
			sideTeamMap[sideIndex + 1] = {
				name: sideName,
				teams: []
			};
		});

		console.log('teams: ', teams);
		for (let i = 0; i < tableNumbers.length; i++) {
			const sideIndex = Math.floor(i / playersPerSide);

			sideTeamMap[sideIndex + 1].teams.push(teams[i]);
		}
		return sideTeamMap;
	}

	private extractPairs(players) {
		const north = [];
		const south = [];
		const east = [];
		const west = [];
		const playerArrayOne = players[0];
		const playerArrayTwo = players[1];
		for (const pair of playerArrayOne) {
			north.push(pair[0]);
			south.push(pair[1]);
		}
		for (const pair of playerArrayTwo) {
			east.push(pair[0]);
			west.push(pair[1]);
		}
		players.north = north;
		players.south = south;
		players.east = east;
		players.west = west;
		return players;
	}

	private createTablesOject(north, east, south, west) {
		const tables = {};
		const numPlayers = Math.min(
			north.length,
			south.length,
			east.length,
			west.length
		);
		for (let i = 0; i < numPlayers; i++) {
			tables[i + 1] = [north[i], south[i], east[i], west[i]];
		}

		return tables;
	}

	// async getNames() {
	// 	try {
	// 		const storeName = 'current_game_data';
	// 		const namestext = await this.getData(storeName, 'namestxt');
	// 		// console.log('namestxt: ', namestext);
	// 		const nameArray = this.processNamesText(namestext);
	// 		// console.log('NameArray from getNames(): ', nameArray);
	// 		return nameArray;
	// 	} catch (err) {
	// 		throw err;
	// 	}
	// }

	private destructureValue(object, string) {
		console.log('attempting to destructure: ', object);
		if (object && object[`${string}`] && object[`${string}`].value) {
			// Destructure the 'value' property
			const { value } = object[`${string}`];
			return value;
		} else {
			// Handle the case where the data is missing or doesn't have the expected structure
			console.error('Invalid data structure:', object);
			return null;
		}
	}

	private destructureAndSplitTeams(data) {
		const {
			current_game_data: { value }
		} = data;
		const split = value[0].split('\n');
		let trimmed = [];
		split.forEach(e => {
			const trimmedValue = e.trim();
			trimmed.push(trimmedValue);
		});
		return trimmed;
	}
	private processMovementText(data) {
		const movementText = data[0];
		const splitLines = movementText
			.split(/\r?\n/)
			.filter(line => line.trim() !== '')
			.map(line => line.trim())
			.map(line => line.split(','));

		console.log('splitLines: ', splitLines);
		return splitLines;
		// return splitLines
	}

	private processNamesText(value,numOfTables) {
		let namesArray = [];
		const namesInPlay = numOfTables * 2

		const lines = value[0]
			.split('\n')
			.filter(line => line.trim() !== '')
			.map(line => line.trim());
		const cleanedLines = lines.slice(1).map(line => line.trim());
		console.log('cleaned lines: ', cleanedLines);

		const tapHereIndex = lines.findIndex(line => line.includes('Tap here'));
		namesArray = namesInPlay !== -1 ? lines.slice(0, namesInPlay) : lines;
		// console.log('After tapHereIndex: ', namesArray);
		// namesArray = value[0].split('\n').filter(name => name.trim()!== '').map(line=> line.trim(''))
		namesArray = namesArray.map(item => item.split(' & '));

		// console.log('procesNamesText namesArray: ', namesArray);
		return namesArray;
	}

	private extractOTH(string) {
		return string.split(' ')[1].split('.');
	}

	getMatchType(settingsTxt: any): any {
		const data: any = {};
		if (!settingsTxt) {
			return undefined;
		} else {
			const {
				current_game_data: { value }
			} = settingsTxt;
			const settingsArray = value[0].split('\n');
			// console.log('settings array: ', settingsArray);
			const settingsDigits = this.extractOTH(settingsArray[6]);
			// console.log('settings digits: ', settingsDigits);
			const sidesOf = settingsDigits[34];
			// console.log('settings txt: ', value);
			const matchType: { pairs?: boolean; teams?: boolean; individual?: boolean } =
				{};
			for (const text of value) {
				if (text.startsWith('MV I')) {
					console.log('individual');
					matchType.individual = true;
				} else if (text.startsWith('MV T')) {
					console.log('team');
					matchType.teams = true;
				} else if (text.startsWith('MV P')) {
					console.log('pairs');
					matchType.pairs = true;
				} else {
					matchType.pairs = true;
				}
			}
			data.matchType = matchType;
			data.sidesOf = sidesOf;
			return data;
		}
	}
}
