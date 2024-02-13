import { Injectable } from '@angular/core';

import {
	Subject,
	Subscription,
	take,
	firstValueFrom,
	filter,
	first,
	from,
	Observable,
	switchMap,
	catchError,
	throwError
} from 'rxjs';
import { tag } from 'rxjs-spy/cjs/operators';

import { IndexedDatabaseService } from './indexed-database.service';
import { IndexedDatabaseStatusService } from '../../../shared/services/indexed-database-status.service';

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
		private indexedDatabaseStatus: IndexedDatabaseStatusService
	) {}

	async getData(storeName, key) {
		try {
			await firstValueFrom(
				this.indexedDatabaseStatus.isInitialised$.pipe(
					// tag('process-match-data is init sub'),
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
			const sitText = await this.indexedDB.readFromDB([store], 'sittext');

			console.log('Sitters Text: ', sitText);

			// console.log(settingsText);
			// console.log('people initial: ', people);
			const movementValue = this.destructureValue(movement, 'current_game_data');
			console.log('movementValue: ', movementValue);
			// workign out pair numbers
			const pairNumbers = this.getPairNumbers(movementValue);
			// console.log('pairNumbers: ', pairNumbers);

			const peopleValue = this.destructureValue(people, 'current_game_data');
			const teamsValue = this.destructureAndSplitTeams(teams);
			const sidesValue = this.destructureAndSplitTeams(sides);
			const matchTypeObject = this.getMatchType(settingsText);
			console.log('current match type: ', matchTypeObject);

			// console.log('movement value: ', movementValue);
			console.log('people value: ', peopleValue);

			const currentGameConfig = this.buildCurrentGameObject(
				movementValue,
				peopleValue,
				teamsValue,
				sidesValue,
				matchTypeObject
			);
			console.log('currentGameConfig: ', currentGameConfig);
			const { tables } = currentGameConfig;

			currentGameConfig.pairNumbers = pairNumbers;

			return currentGameConfig;
		} catch (err) {
			console.error('Error getting current movement data', err);
			throw err;
		}
	}

	private getPairNumbers(movementValue) {
		const split = movementValue[0].split('\n');
		// remove first two elements
		const pairsArray = split.slice(2);
		pairsArray.pop();
		let northSouthPairs = [];
		let eastWestPairs = [];

		pairsArray.forEach(element => {
			if (element.length > 0) {
				let pairs = element.split(',').map(Number);
				northSouthPairs.push(pairs[0]);
				eastWestPairs.push(pairs[1]);
			}
		});
		const data = {
			northSouth: northSouthPairs,
			eastWest: eastWestPairs
		};
		return data;
	}

	private assignPairNumbers(pairNumbers, tableConfig) {
		let pairedTables = {};
		const { northSouth, eastWest } = pairNumbers;
		Object.keys(tableConfig).forEach((table, index) => {
			const tablePlayers = tableConfig[table];
			const pairs = {};
			// console.log('tablePlayers in loop: ', index, tableConfig[table]);

			for (let i = 0; i < tablePlayers.length; i += 4) {
				const firstPairLabel = `${northSouth[index]}`;
				const secondPairLabel = `${eastWest[index]}`;
				// console.log('in nested loop iteration: ', i);

				console.log(tablePlayers[i], tablePlayers[i + 1]);
				if (i + 3 < tablePlayers.length) {
					// Ensure that indexing doesn't exceed array bounds
					pairs[firstPairLabel] = [tablePlayers[i], tablePlayers[i + 1]];
					pairs[secondPairLabel] = [tablePlayers[i + 2], tablePlayers[i + 3]];
				}
			}
			pairedTables[table] = pairs;
		});
		return pairedTables;
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

	// private splitArray(array) {
	// 	const half = Math.floor(array.length / 2);
	// 	if (array.length % 2 === 0) {
	// 		return [[array.slice(0, half)], [array.slice(half)]];
	// 	} else {
	// 		return [[array.slice(0, half)], [array.slice(half)]];
	// 	}
	// }

	private buildCurrentGameObject(movement, people, teams, sides, matchTypeObject) {
		let notUsebio = false;
		let teamsOrPairs;
		const cleanedMovement = this.processMovementText(movement);
		const numOfTables = cleanedMovement[1][1];
		console.log('number of tables: ', numOfTables);

		if (cleanedMovement[0][0] !== 'USEBIO2BRIAN') {
			// work out usebio values
			console.log('Normal detected, building tables appropriately ');
			notUsebio = true;
			teamsOrPairs = this.processNormalNames(people, numOfTables);
		} else {
			teamsOrPairs = this.processNamesText(people, numOfTables);
		}

		console.log('teams or pairs: ', teamsOrPairs);
		if (notUsebio) {
		}

		let dataObj: any = {};
		dataObj.rounds = cleanedMovement[1][4];
		dataObj.players = this.splitUnevenArray(teamsOrPairs);
		dataObj.rawPlayers = teamsOrPairs;
		const tableNumbers = teamsOrPairs.length / 2;
		dataObj.tableNumbers = tableNumbers;
		console.log('data object before tables: ', dataObj);
		const tableArray = [];
		for (let i = 0; i < dataObj.players[0].length; i++) {
			const team = [dataObj.players[0][i], dataObj.players[0][i + 1]];
			tableArray.push(team);
		}
		const cardinalArrays = this.createCardinalArrays(dataObj.rawPlayers);
		const pairNumbers: any = {};
		for (let i = 0; i < dataObj.rawPlayers.length; i++) {
			pairNumbers[i + 1] = dataObj.rawPlayers[i];
		}

		// console.log('tableArray: ', tableArray);
		// console.log('data object after tables: ', dataObj);

		dataObj.tables = tableArray;
		dataObj.playerConfig = this.extractPairs(dataObj.players);

		// console.log('data object after extractPairs: ', dataObj);

		const { north, south, east, west } = dataObj.playerConfig;
		const currentGame: any = {
			playerConfig: {
				north: north,
				south: south,
				east: east,
				west: west
			}
		};
		currentGame.cardinalArrays = cardinalArrays;
		currentGame.newPairNumbers = pairNumbers;
		console.log('current game pairNumbers: ', currentGame.pairNumbers);

		const pairAndTablesObject = this.createNewPairAndTableConfig(
			dataObj.rawPlayers
		);
		console.log('new pair and table object: ', pairAndTablesObject);

		currentGame.tables = pairAndTablesObject.tables;
		currentGame.newPairConfig = pairAndTablesObject.pairConfig;
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

	private createCardinalArrays(rawPlayerData) {
		let cardinalArays = {};
		let northSide = [];
		let eastSide = [];
		let southSide = [];
		let westSide = [];
		// console.log('Raw player data: ', rawPlayerData);

		for (let i = 0; i < rawPlayerData.length; i++) {
			console.log('i: ', i);
			const pair = rawPlayerData[i];
			const playerOne = pair[0];
			const playerTwo = pair[1];

			if (i % 2 === 0) {
				northSide.push(playerOne);
				southSide.push(playerTwo);
			} else {
				eastSide.push(playerOne);
				westSide.push(playerTwo);
			}
		}

		cardinalArays = { northSide, southSide, eastSide, westSide };
		return cardinalArays;
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
			// console.log('building pairs: arrayOne pair: ', pair);

			north.push(pair[0]);
			south.push(pair[1]);
			// console.log('north: ', north);
			// console.log('south: ', south);
		}
		for (const pair of playerArrayTwo) {
			// console.log('building pairs: arrayTwo pair: ', pair);
			east.push(pair[0]);
			west.push(pair[1]);
			// console.log('east: ', east);
			// console.log('west: ', west);
		}
		players.north = north;
		players.south = south;
		players.east = east;
		players.west = west;
		return players;
	}

	private createNewPairAndTableConfig(pairObject) {
		let finalObject: any = {};
		let tables = {};
		let pairConfig: any = {};
		for (let i = 0; i < Object.keys(pairObject).length; i += 2) {
			const pairOne = pairObject[i];
			const pairTwo = pairObject[i + 1];
			const tableNumber = Math.ceil((i + 1) / 2);
			pairConfig[tableNumber] = {
				[i]: pairOne,
				[i + 1]: pairTwo
			};
			tables[tableNumber] = [pairOne[0], pairOne[1], pairTwo[0], pairTwo[1]];
		}
		finalObject.pairConfig = pairConfig;
		finalObject.tables = tables;
		return finalObject;
	}

	private destructureValue(object, string) {
		// console.log('attempting to destructure: ', object);
		if (object && object[`${string}`] && object[`${string}`].value) {
			// Destructure the 'value' property
			const { value } = object[`${string}`];
			return value;
		} else {
			// Handle the case where the data is missing or doesn't have the expected structure
			// console.error('Invalid data structure:', object);
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

	private processNormalNames(names, numOfTables) {
		const namesInPlay = numOfTables * 2;

		let namesArray = [];
		console.log('names in process normal names: ', names);

		const lines = names[0].split('\n').filter(line => line.trim() !== '');
		// console.log('lines: ', lines);

		const splitIndex = Math.ceil(numOfTables);
		namesArray = namesInPlay !== -1 ? lines.slice(0, namesInPlay) : lines;
		// console.log('namesArray: ', namesArray);

		namesArray = namesArray.map(item => item.split(' & '));

		// console.log('namesArray after split at "&": ', namesArray);

		// console.log('split index: ', splitIndex);
		const firstHalf = namesArray.slice(0, splitIndex);
		const secondHalf = namesArray.slice(splitIndex);

		console.log(firstHalf);
		console.log(secondHalf);
		let newArray = [];
		for (let i = 0; i < firstHalf.length; i++) {
			newArray.push(firstHalf[i]);
			newArray.push(secondHalf[i]);
		}
		// console.log('new array: ', newArray);
		return newArray;
	}

	// private processNonUsebioNames(value, numOfTables) {
	// 	let ns: any[] = [];
	// 	let ew: any[] = [];
	// 	let namesArray: any[] = [];
	// 	const namesInPlay = numOfTables * 2;
	// 	const lines = value[0]
	// 		.split('\n')
	// 		.filter(line => line.trim() !== '')
	// 		.map(line => line.trim());

	// 	namesArray = namesInPlay !== -1 ? lines.slice(0, namesInPlay) : lines;
	// 	namesArray = namesArray.map(item => item.split(' & '));
	// 	for (let i = 0; i < namesArray.length; i++) {
	// 		console.log('pair in array: ', namesArray[i]);
	// 		if (i % 2 === 0) {
	// 			ns.push(namesArray[i]);
	// 		} else {
	// 			ew.push(namesArray[i]);
	// 		}
	// 	}
	// 	const finalArray = ns.concat(ew);
	// 	console.log('final array: ', finalArray);

	// 	return namesArray;
	// }

	private processNamesText(value, numOfTables) {
		let namesArray = [];
		const namesInPlay = numOfTables * 2;

		const lines = value[0]
			.split('\n')
			.filter(line => line.trim() !== '')
			.map(line => line.trim());
		const cleanedLines = lines.slice(1).map(line => line.trim());
		// console.log('cleaned lines: ', cleanedLines);

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
				} else if (text.startsWith('MV P') || text.startsWith('MV CPM')) {
					console.log('pairs');
					if (text.startsWith('MV CPM')) {
						console.log('USEBIO Import');
					}
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

	public processLock(lockData): any {
		const value = lockData[0];
		const { key, value: lock } = value;
		// console.log('before processing: ', lock);
		// console.log(lock['$'].tf);
		const lockValue = lock['$'].tf === 'f' ? false : true;
		console.log('lockValue in processing: ', lockValue);

		return lockValue;
	}
}
