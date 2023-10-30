import { Injectable, OnDestroy } from '@angular/core';
import { IndexedDatabaseService } from './indexed-database.service';
import { DataService } from './data.service';
import { SharedDataService } from '../../../shared/services/shared-data.service';
import {
	Subject,
	Subscription,
	takeUntil,
	take,
	firstValueFrom,
	lastValueFrom,
	filter,
	first,
	tap,
	from,
	Observable,
	switchMap,
	catchError,
	throwError
} from 'rxjs';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';

@Injectable({
	providedIn: 'root'
})
export class FetchCurrentDataService implements OnDestroy {
	matchTypeSubscription: Subscription;
	currentMatchType: string = '';
	isDBInitialised = false;
	private destroy$ = new Subject<void>();

	constructor(
		private indexedDB: IndexedDatabaseService,
		private sharedDataService: SharedDataService,
		private indexedDatabaseStatus: IndexedDatabaseStatusService,
		private apiProcessing: ApiDataProcessingService
	) {
		this.matchTypeSubscription = this.sharedDataService.selectedMatchType$
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: matchTypeValue => {
					this.currentMatchType = matchTypeValue;
				}
			});

		this.indexedDatabaseStatus.isInitialised().pipe(

		).subscribe(intialised => {
			this.isDBInitialised = intialised;
		});
	}

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

			console.log('people initial: ', people);
			const movementValue = this.destructureValue(movement, 'current_game_data');
			const peopleValue = this.destructureValue(people, 'current_game_data');
			const teamsValue = this.destructureAndSplitTeams(teams);
			const sidesValue = this.destructureAndSplitTeams(sides);
			console.log('movement value: ', movementValue);
			console.log('people value: ', peopleValue);

			const currentGameConfig = this.buildCurrentGameObject(
				movementValue,
				peopleValue,
				teamsValue,
				sidesValue
			);
			return currentGameConfig
			// console.log('Current Game Config: ', currentGameConfig);
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

	private buildCurrentGameObject(movement, people, teams, sides) {
		console.log('teans: ', teams);
		const cleanedMovement = this.processMovementText(movement);
		const teamsOrPairs = this.processNamesText(people);
		let dataObj: any = {};
		console.log('cleaned movement: ', cleanedMovement);
		console.log('teams or pairs: ', teamsOrPairs);
		// if(cleanedMovement.length < 1 || teamsOrPairs.length<1){}

		// console.log(cleanedMovement[1][4]);
		dataObj.rounds = cleanedMovement[1][4];
		dataObj.players = this.splitUnevenArray(teamsOrPairs);
		// console.log('players List: ', dataObj.players);
		const tableNumbers = teamsOrPairs.length / 2;
		dataObj.tableNumbers = tableNumbers;
		const tableArray = [];
		for (let i = 0; i < dataObj.players[0].length; i++) {
			const team = [dataObj.players[0][i], dataObj.players[1][i]];
			tableArray.push(team);
		}
		dataObj.tables = tableArray;
		dataObj.playerConfig = this.extractPairs(dataObj.players);
		// console.log(dataObj.playerConfig);

		const { north, south, east, west } = dataObj.playerConfig;
		// this.extractPairs(dataObj)
		const currentGame: any = {
			playerConfig: {
				north: north,
				south: south,
				east: east,
				west: west
			}
		};

		currentGame.tables = this.createTablesOject(north,south,east,west)
		// console.log('currentGame: ', currentGame);
		// console.log('tableArray: ', tableArray);
		const index = currentGame.playerConfig.north.length;
		teams.splice(index);

		currentGame.teams = teams;
		currentGame.isTeams = true;

		const extractedSides = this.extractSides(sides);
		if (extractedSides.length !== 0) {
			currentGame.sides = extractedSides;
			currentGame.isSides = true;
		}

		return currentGame;
	}

	private extractSides(sides) {
		return sides.filter(item => !item.match(/^Side \d+$/));
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

	private createTablesOject(north,east,south,west){
		const tables ={}
		const numPlayers = Math.min(north.length, south.length, east.length, west.length)
		for (let i =0; i<numPlayers; i++){
			tables[i+1] = [north[i],south[i],east[i],west[i]]
		}

		return tables
	}

	async getNames() {
		try {
			const storeName = 'current_game_data';
			const namestext = await this.getData(storeName, 'namestxt');
			// console.log('namestxt: ', namestext);
			const nameArray = this.processNamesText(namestext);
			// console.log('NameArray from getNames(): ', nameArray);
			return nameArray;
		} catch (err) {
			throw err;
		}
	}

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
		return split;
	}
	private processMovementText(data) {
		const movementText = data[0];
		const splitLines = movementText
			.split(/\r?\n/)
			.filter(line => line.trim() !== '')
			.map(line => line.trim())
			.map(line => line.split(','));

		// console.log('splitLines: ', splitLines);
		return splitLines;
		// return splitLines
	}

	private processNamesText(value) {
		let namesArray = [];

		const lines = value[0]
			.split('\n')
			.filter(line => line.trim() !== '')
			.map(line => line.trim());
		// const cleanedLines = lines.slice(1).map(line => line.trim());
		const tapHereIndex = lines.findIndex(line => line.includes('Tap here'));
		namesArray = tapHereIndex !== -1 ? lines.slice(0, tapHereIndex) : lines;
		// console.log('After tapHereIndex: ', namesArray);
		// namesArray = value[0].split('\n').filter(name => name.trim()!== '').map(line=> line.trim(''))
		namesArray = namesArray.map(item => item.split(' & '));

		// console.log('procesNamesText namesArray: ', namesArray);
		return namesArray;
	}

	ngOnDestroy(): void {
		if (this.matchTypeSubscription) {
			this.matchTypeSubscription.unsubscribe();
		}
	}
}
