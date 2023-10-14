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
import { IndexedDatabaseStatusService } from '../../../shared/services/indexed-database-status.service';
import { Player } from '../../../shared/data/interfaces/player-data';
import { ApiDataProcessingService } from './api/api-data-processing.service';
import { tag } from 'rxjs-spy/cjs/operators';
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

		this.indexedDatabaseStatus
			.isInitialised()
			.pipe(tag(''))
			.subscribe(intialised => {
				this.isDBInitialised = intialised;
			});
	}

	async getHistoricData(storeName: string) {
		try {
			await firstValueFrom(
				this.indexedDatabaseStatus.isInitialised$.pipe(
					filter(isInitialised => isInitialised),
					first(),
					take(1)
				)
			);
			const data = await this.indexedDB.getAllDataFromStore(storeName);
			return data;
		} catch (error) {
			throw error;
		}
	}

	async getAllStoreData(storeName: string) {
		try {
			await firstValueFrom(
				this.indexedDatabaseStatus.isInitialised$.pipe(
					filter(isInitialised => isInitialised),
					first(),
					take(1)
				)
			);
			const data = await this.indexedDB.getAllDataFromStore(`${storeName}`);
			const extracted = data.map(item => item.value);
			return extracted;
		} catch (err) {
			throw err;
		}
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

	async getCurrentGame(): Promise<any> {
		try {
			const storeName = 'current_game_data';
			const movementData = await this.indexedDB.readFromDB(
				[storeName],
				'movementtxt'
			);

			const namesData = await this.indexedDB.readFromDB([storeName], 'namestxt');

			const movementValues = this.destructureValue(movementData, storeName);
			if (movementValues.length < 1) {
				throw new Error('No data in movementtxt');
			}
			const nameValues = this.destructureValue(namesData, storeName);
			if (nameValues.length < 1) {
				throw new Error('No data in namestxt');
			}

			const gameObject = this.buildCurrentGameObject(movementValues, nameValues);
			console.log(gameObject);
			return gameObject;
		} catch (err) {
			console.error('Error getting current game data: ', err);
			return null;
		}
	}

	async getInitialTableData() {
		console.log('initial table data called');
		try {
			const result = await firstValueFrom(
				this.indexedDatabaseStatus.isInitialised$.pipe(
					filter(isInitialised => isInitialised),
					first(),
					take(1)
				)
			);
			// console.log('isInitialised: ', result);
			const movement = await this.indexedDB.readFromDB(
				[`current_game_data`],
				'movementtxt'
			);
			console.log('movement initial: ', movement);
			const people = await this.indexedDB.readFromDB(
				[`current_game_data`],
				'namestxt'
			);
			console.log(movement, people);
			const movementValue = this.destructureValue(movement, 'current_game_data');
			console.log('movementtxt: ', movementValue);
			if (movementValue.length < 1) {
				throw new Error('movementtxt empty');
			}

			const peopleValue = this.destructureValue(people, 'current_game_data');
			if (peopleValue.length < 1) {
				throw new Error('');
			}
			console.log('peopleValue: ', peopleValue);
			const currentGameConfig = this.buildCurrentGameObject(
				movementValue,
				peopleValue,
				teamsValue,
				sidesValue
			);
			return currentGameConfig;
		} catch (err) {
			console.error('Error getting current movememnet data', err);
			return null;
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
		console.log('cleanedMovement: ', cleanedMovement);
		console.log(cleanedMovement[1][4]);
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

		console.log('data obj: ', dataObj);

		currentGame.tables = this.createTablesOject(north, south, east, west);
		console.log('currentGame: ', currentGame);
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

	// Update And Write Operations

	async updateValue(receivedData): Promise<any> {
		try {
			console.log(
				'data received in process match data updateValue(): ',
				receivedData
			);
			const { isNew, data } = receivedData;
			if (!data) {
				throw new Error('no data provided for updateValue()');
			}
			const storeName = `${data.value.$.type}`;
			let key = undefined;
			if (!isNew) {
				console.log('Not new');
				key = data.key;
				console.log('store name: ', storeName, ' key: ', key);

				const existingValue: any = await this.indexedDB.getByKey(storeName, key);
				if (existingValue) {
					console.log('wholeObject from db: ', existingValue);
					const { value } = existingValue;
					let newValue = { ...value };
					newValue = data.value;

					await this.indexedDB.update(storeName, key, newValue);
				} else {
					throw new Error(
						'error updating, could not find data with specified key: ',
						key
					);
				}
			} else {
				console.log('isNew = true, adding new data', 'isNew: ', isNew);
				const existingStoreEntries = await this.indexedDB.getAllDataFromStore(
					storeName
				);
				const items = await this.apiProcessing.retrieveAllPlayerDb();
				const newIndex = (existingStoreEntries.length + 1).toString();

				const newN = (items.length + 1).toString();
				const newKey = `00${newIndex}`;
				console.log('new index (n-value): ', newIndex);
				data.value.$.n = newN;
				const value = data.value;
				// const newKey = newIndex
				console.log('new entry for database: ', value);
				await this.indexedDB.add(storeName, newKey, value);
			}
			return true;
		} catch (err) {
			throw err;
		}
	}

	async deleteByKey(data): Promise<any> {
		try {
			if (!data) {
				throw new Error('No data in process match data deleteByKey()');
			}
			const type = data.value.$.type;
			const storeName = `${type}`;
			const key = data.key;
			console.log(`storenName: ${storeName} and key: ${key}`);
			const success = await this.indexedDB.delete(storeName, key);
			if (success) {
				return true;
			}
			return false;
		} catch (err) {
			throw err;
		}
	}

	private async updateEntry(newData): Promise<any> {}

	private async getPlayerDataFromDB(): Promise<any> {
		try {
			const storeName = `player_db`;
			const existingData = await this.indexedDB.readFromDB([storeName], 'root');
			return existingData;
		} catch (err) {
			throw err;
		}
		// Implement logic to retrieve data of a specific type from the database
	}

	private async buildUpdateObject(dataArray: any[]) {
		// console.log('DataArray in update Object: ', JSON.stringify(dataArray, null, 2));
		const updateObject = {
			storeName: `${this.currentMatchType}-player_db`,
			key: 'root',
			value: dataArray
		};
		await this.indexedDB.writeToDB([updateObject]);
	}

	ngOnDestroy(): void {
		if (this.matchTypeSubscription) {
			this.matchTypeSubscription.unsubscribe();
		}
	}
}