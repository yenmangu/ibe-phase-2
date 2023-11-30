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
export class RevisedProcessCurrentDataService {
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
			const movementValue = this.destructureValue(movement, 'current_game_data');
			const peopleValue = this.destructureValue(people, 'current_game_data');
			const teamsValue = this.destructureAndSplitTeams(teams);
			const sidesValue = this.destructureAndSplitTeams(sides);

			console.log('\n\n\n teamsValue: ', teamsValue);

			const currentGameConfig = await this.generateConfig(
				movementValue,
				peopleValue,
				settingsText,
				teamsValue
			);
			return currentGameConfig;
		} catch (error) {}
	}

	// START NEW CODE

	async generateConfig(movementtxt, namestxt, settingstxt, teamsValue) {
		try {
			const { matchType, sidesOf } = this.getMatchType(settingstxt);
			const sidesOfInt = Number(sidesOf);

			console.log('\n\n\n match type: \n\n\n', matchType);

			const movementAndPairs = await this.determinePairNumberStyle(movementtxt);

			const cleanedMovement = this.processMovementText(movementtxt);
			const numOfTables = cleanedMovement[1][1];
			let notUsebio = false;
			let usebio = false;
			let teamsOrPairs;

			if (cleanedMovement[0][0] !== 'USEBIO2BRIAN') {
				notUsebio = true;
				usebio = false;
			} else {
				notUsebio = false;
				usebio = true;
			}

			console.log(
				'movement and pairs after determine pair number style: ',
				movementAndPairs
			);

			const {
				totalTables,
				totalPairs,
				northSouth,
				eastWest,
				eastWestSorted,
				pairNumbers,
				movementOnly,
				pairNumberingStyle
			} = movementAndPairs;

			let finalConfig: any = {};

			const pairsObject = await this.retrievePairList(namestxt, totalPairs);

			let tableConfig: any = {};

			if (pairNumberingStyle === 'standardPairing') {
				tableConfig = await this.assignStartingPositions(
					pairsObject,
					movementOnly,
					undefined,
					undefined
				);
			} else if (pairNumberingStyle === 'victorPairing') {
				console.log('victorPairing detected... \n');

				tableConfig = await this.assignStartingPositions(
					pairsObject,
					movementOnly,
					true,
					totalTables
				);
			}

			console.log('tableConfig: ', tableConfig);
			const { teamConfig, teamsInPlay } = await this.generateTeamConfig(
				tableConfig,
				teamsValue,
				totalTables
			);

			console.log('TEAMS: ', teamConfig);
			const cardinals = await this.assignCardinalColumns(tableConfig);
			const tables = await this.generateTables(tableConfig);

			const sideTeamMap = this.generateSideTeamMap(sidesOfInt, teamsInPlay);

			finalConfig.teamConfig = teamConfig;
			finalConfig.teams = teamsInPlay;
			finalConfig.cardinals = cardinals;
			finalConfig.tableConfig = tableConfig;
			finalConfig.matchType = matchType;
			finalConfig.tables = tables;
			finalConfig.pairNumbers = pairNumbers;
			finalConfig.sidesOf = sidesOf;
			finalConfig.sideTeamMap = sideTeamMap;

			console.log('final tableConfig: ', tableConfig);

			console.log('Final movement and pairs config: ', movementAndPairs);

			return finalConfig;
		} catch (error) {
			console.error('error assigning pair numbers: ', error);
		}
	}

	generateTeamConfig(tableConfig, teamsValue, totalTables: number) {
		const teamsInPlay = teamsValue.slice(0, totalTables);
		console.log('table config to work from: ', tableConfig);

		let teamConfig: any = {};

		teamsInPlay.forEach((team, index) => {
			const table = tableConfig[index + 1];
			console.log('table in question: ', table);

			teamConfig[team] = {
				index: index,
				tables: [
					table[0][0].trim(),
					table[0][1].trim(),
					table[1][0].trim(),
					table[1][1].trim()
				]
			};
		});

		return { teamConfig, teamsInPlay };
	}

	generateSideTeamMap(sidesOfInt: number, teamsInPlay: string[]) {
		let sideTeamMap: any = {};

		if (sidesOfInt === 0) {
			sideTeamMap = { [0]: teamsInPlay };
		} else {
			const teamsPerSide: number = Number(sidesOfInt) / 4;

			console.log('teamsPerSide: ', teamsPerSide);
			const numOfSides: number = Number(teamsInPlay.length) / teamsPerSide;

			console.log('Number of sides: ', numOfSides);
			for (let i = 0; i < numOfSides; i++) {
				const teamArray = teamsInPlay.splice(0, teamsPerSide);
				sideTeamMap[i] = teamArray;
			}
		}

		return sideTeamMap;
	}

	generateTables(tableConfig) {
		let tables: any = {};
		for (const tableKey in tableConfig) {
			if (Object.prototype.hasOwnProperty.call(tableConfig, tableKey)) {
				const table: any = tableConfig[tableKey];

				tables[tableKey] = [
					table[0][0].trim(),
					table[0][1].trim(),
					table[1][0].trim(),
					table[1][1].trim()
				];
			}
		}
		return tables;
	}

	assignCardinalColumns(tableConfig) {
		let north: any[] = [];
		let south: any[] = [];
		let east: any[] = [];
		let west: any[] = [];

		for (const tableKey in tableConfig) {
			if (Object.prototype.hasOwnProperty.call(tableConfig, tableKey)) {
				const table: any = tableConfig[tableKey];
				north.push(table[0][0].trim());
				south.push(table[0][1].trim());
				east.push(table[1][0].trim());
				west.push(table[1][1].trim());
			}
		}

		const cardinals = { north, south, east, west };
		return cardinals;
	}

	// The following works for both Victor and Standard pair numbering

	assignStartingPositions(
		pairsObject,
		movementOnly,
		victorPairing?: boolean,
		totalTables?: number
	) {
		let tableConfig: any = {};

		console.log(
			'total tables: ',
			totalTables ? totalTables : 'not needed due to standardPairing'
		);

		movementOnly.forEach((movement, index) => {
			const ns = pairsObject[movement.split(',')[0].trim()];
			let ew: any;
			let pairNumString;
			if (victorPairing) {
				pairNumString = movement.split(',')[1];
				const pairAsNum = Number(pairNumString);
				const pairToFind = pairAsNum + Number(totalTables);
				ew = pairsObject[pairToFind.toString().trim()];
			} else {
				ew = pairsObject[movement.split(',')[1].trim()];
			}

			tableConfig[`${index + 1}`] = [ns, ew];
		});

		return tableConfig;
	}
	retrievePairList(namestxt: string[], totalPairs): any {
		const pairsArray: any[] = namestxt[0].trim().split('\n').splice(0, totalPairs);
		// console.log('pairsArray: ', pairsArray);
		let pairsObject: any = {};
		pairsArray.forEach((pairElement, index) => {
			let tempPairs = pairElement.split('&');
			pairsObject[index + 1] = tempPairs;
		});
		console.log('pairObject: ', pairsObject);

		return pairsObject;
	}

	determinePairNumberStyle(movementtxt) {
		const movementLines: any[] = movementtxt[0].trim().split('\n');
		console.log('movemenet lines: ', movementLines);

		let movementAndPairs: any = {};
		movementAndPairs.totalTables = movementLines[1].trim().split(',')[1].trim();
		const movementOnly = movementLines.slice(2, movementLines.length);

		let nsPairs: any[] = [];
		let ewPairs: any[] = [];

		movementOnly.forEach((movement, index) => {
			nsPairs.push(Number(movement.split(',')[0].trim()));
			ewPairs.push(Number(movement.split(',')[1].trim()));
		});
		const ewSorted = ewPairs.slice().sort((a, b) => b - a);
		const largestPairNumber = ewSorted[0];

		let pairNumberingStyle: string = '';

		movementAndPairs.northSouth = nsPairs;
		movementAndPairs.eastWest = ewPairs;
		movementAndPairs.eastWestSorted = ewSorted;
		movementAndPairs.largestPairNumber = largestPairNumber;
		movementAndPairs.movementOnly = movementOnly;
		const { northSouth, eastWest } = movementAndPairs;
		movementAndPairs.pairNumbers = { northSouth, eastWest };

		let totalPairs: number;
		pairNumberingStyle =
			largestPairNumber === movementAndPairs.totalTables
				? 'victorPairing'
				: 'standardPairing';

		if (pairNumberingStyle === 'victorPairing') {
			totalPairs = largestPairNumber * 2;
		} else {
			totalPairs = largestPairNumber;
		}

		movementAndPairs.pairNumberingStyle = pairNumberingStyle;
		movementAndPairs.totalPairs = totalPairs;

		console.log(
			'movementAndPairs Object: ',
			JSON.stringify(movementAndPairs, null, 2)
		);

		return movementAndPairs;
	}

	// END NEW CODE

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
	private processMovementText(data) {
		const movementText = data[0];
		const splitLines = movementText
			.split(/\r?\n/)
			.filter(line => line.trim() !== '')
			.map(line => line.trim())
			.map(line => line.split(','));

		console.log('splitLines: ', splitLines);
		return splitLines;
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
