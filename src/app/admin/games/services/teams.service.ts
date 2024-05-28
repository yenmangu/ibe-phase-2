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
	throwError,
	pairs
} from 'rxjs';

import { IndexedDatabaseService } from './indexed-database.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';

@Injectable({
	providedIn: 'root'
})
export class TeamsService {
	nsStartOrder: number[] = [];
	ewStartOrder: number[] = [];
	teamType: number;
	pairConfig: { key: string[] };
	totalTeams: number;
	constructor() {}

	buildTeamConfig(
		movementTxt,
		namesValue,
		settingsTxt,
		teamsValue,
		sittersValue,
		labelsValue,
		stratValue,
		handicapValue,
		abbrevValue,
		colsValue
	) {
		const { matchType, matchString, sidesOf, eventName } =
			this.getMatchType(settingsTxt);
		const sidesOfInt = Number(sidesOf);
		const { movementArray, originalMovement, totalTables, totalTeams } =
			this.processMovement(movementTxt);
		const teamNameArray = this.getActiveTeams(teamsValue, totalTeams);
		console.log('active teams: ', teamNameArray);
		const teamGameType: { type: number } = this.determineTeamGameType(
			movementArray,
			totalTeams
		);
		this.teamType = teamGameType.type;
		this.totalTeams = totalTeams;
		console.log('team type: ', this.teamType);

		const teamObject = this.buildTeams(movementArray, totalTeams, teamGameType);
		console.log('Original team object: ', teamObject);

		const totalPairs = this.getTotalPairs(teamObject);
		const nameObject = this.processNames(namesValue, totalPairs);
		const pairConfig = this.buildPairConfig(nameObject);

		if (teamObject) {
			this.expandTeamObject(teamObject, nameObject, teamNameArray);
		}

		const teamNumbers = this.getTeamNumbers(teamObject);

		// const cardinals = this.buildCardinals(teamObject, nameObject);
		// console.log('Cardinals: ', cardinals);
		const sideTeamMap = this.generateSideTeamMap(sidesOfInt, teamNameArray);
		// console.log('Side team map: ', sideTeamMap);
		// const tables = this.generateTables(teamObject,teamNumbers);

		const teamArray = this.buildTeamArray(teamObject);

		// Additional Values:

		console.log('Sitters Values in Teams Service: ', sittersValue);
		console.log('Labels Values in Teams Service: ', labelsValue);
		console.log('StratValue: ', stratValue);

		const sittersData = this.splitArrayString(sittersValue);
		const labelData = this.splitArrayString(labelsValue);
		const stratData = this.splitArrayString(stratValue);
		const handicapData = this.splitArrayString(handicapValue);
		const abbrevData = this.splitArrayString(abbrevValue);
		const colsData = this.splitArrayString(colsValue);

		console.log('sitters data: ', sittersData);
		console.log('label data: ', labelData);

		const sittersArray = this.generateSittersArray(sittersData);
		// const labelArray = this.generateAdditionalArray(labelData)
		console.log('Sitters array: ', sittersArray);
		console.log('Label array: ', labelData);
		console.log('Strat array: ', stratData);
		console.log('Handicap array: ', handicapData);

		const sitters = { ewSitters: sittersArray };
		const labels = { ewLabels: labelData };
		const stratification = { ewStratification: stratData };
		const handicaps = { ewHandicap: handicapData };
		const abbreviations = { ewAbbreviations: abbrevData };
		const boardCols = colsValue;
		const tables = this.buildTables(teamNumbers);

		const currentGameConfig = {
			// cardinals,
			totalPairs,
			nameObject,
			teams: teamObject,
			matchType,
			eventName,
			sideTeamMap,
			sitters,
			labels,
			// tables,
			nsStartOrder: this.nsStartOrder,
			ewStartOrder: this.ewStartOrder,
			teamArray,
			totalTeams,
			teamNumbers,
			totalTables,
			pairConfig,
			stratification,
			handicaps,
			abbreviations,
			boardCols,
			tables
		};
		return currentGameConfig;
	}

	buildTables(teamNumbers: number[]) {
		const tables: any = {};
		teamNumbers.forEach(team => {
			if (!tables[team]) {
				tables[team] = team;
			}
		});
		return tables;
	}

	splitArrayString(array) {
		const totalTeams = this.totalTeams;
		return array[0].split('\n').slice(0, totalTeams);
	}

	generateSittersArray(stringArray: String[]): boolean[] {
		const boolArray = [];
		stringArray.forEach(string => {
			string !== '' ? boolArray.push(true) : boolArray.push(false);
		});
		return boolArray;
	}

	public switchOrder(order: 'team' | 'start') {}

	private startOrderSort(data: any[], order: number[]) {
		return data
			.slice()
			.sort((a, b) => order.indexOf(a.teamNumber) - order.indexOf(b.teamNumber));
	}

	public orderTeamArray(teamArray, currentOrder) {
		return this.startOrderSort(teamArray, currentOrder);
	}

	private buildTeamArray(teamObject) {
		const teamKeys = Object.keys(teamObject);
		const teamArray: any[] = [];

		teamKeys.forEach((key, index) => {
			if (teamObject.hasOwnProperty(key)) {
				teamArray.push(teamObject[key]);
			}
		});
		return teamArray;
	}

	private getTeamNumbers(teamObject: any): number[] {
		const teamNumbersArr: number[] = [];
		const teamStringArr = Object.keys(teamObject);
		teamStringArr.forEach((string, index) => {
			teamNumbersArr.push(parseInt(string, 10));
		});
		return teamNumbersArr;
	}

	// public generateTables(teamObject, orderArr) {
	// 	const tables: any = {};
	// 	const keys = Object.keys(teamObject);
	// 	keys.forEach((key, index) => {
	// 		const teamNumber = orderArr[index];
	// 		const team = teamObject[teamNumber];
	// 		if (team) {
	// 			const teamArray = team.nsPair.concat(team.ewPair);
	// 			tables[index + 1] = teamArray;
	// 		}
	// 	});
	// 	return tables;
	// }

	public generateTables(teamObject, orderArr: number[]) {
		const tables: {
			north: string[];
			south: string[];
			east: string[];
			west: string[];
		} = { north: [], south: [], east: [], west: [] };
		const { north, south, east, west } = tables;
		Object.keys(teamObject).forEach((key, index) => {
			const teamNumber = orderArr[index];
			// console.log('Current teamn number in generateTables: ', teamNumber);
			north.push(teamObject[teamNumber].north);
			south.push(teamObject[teamNumber].south);
			east.push(teamObject[teamNumber].east);
			west.push(teamObject[teamNumber].west);
		});

		return tables;
	}

	public generateTableConfig(
		teamObject: any,
		nsOrder: number[],
		ewOrder: number[],
		totalTables: number
	) {
		const tableConfig: any = {};

		const teamKeys = Object.keys(teamObject);
		const totalTeams = teamKeys.length;
		for (let i = 0; i < totalTables; i++) {
			// const teamNumber = teamKeys[i];
			const nsLookup = nsOrder[i];
			// const ewLookup = ewOrder[i];
			let ewLookup: number;
			this.teamType === 2
				? (ewLookup = ewOrder[i])
				: (ewLookup = ewOrder[i] + totalTeams);

			const tableNumber = i + 1;

			console.log('nsLookup: ', nsLookup);
			console.log('ewLookup: ', ewLookup);

			if (!tableConfig[tableNumber]) {
				tableConfig[tableNumber] = {};
			}
			if (!tableConfig[tableNumber].ns) {
				tableConfig[tableNumber].ns = {};
			}
			if (!tableConfig[tableNumber].ew) {
				tableConfig[tableNumber].ew = {};
			}
			console.log('TableConfig so far: ', tableConfig);
			const nsTeam = this.findCorrectTeam(teamObject, nsLookup, 'ns');
			const ewTeam = this.findCorrectTeam(teamObject, ewLookup, 'ew');

			console.log('nsTeam: ', nsTeam);
			console.log('ewTeam: ', ewTeam);

			const ns = {
				teamNumber: nsTeam.teamNumber,
				pairNumber: nsLookup,
				pairNames: nsTeam.pairArray
			};
			const ew = {
				teamNumber: ewTeam.teamNumber,
				pairNumber: ewLookup,
				pairNames: ewTeam.pairArray
			};

			tableConfig[tableNumber].ns = ns;
			tableConfig[tableNumber].ew = ew;
		}
		console.log('tableConfig complete maybe??: ', tableConfig);

		return tableConfig;
	}

	private findCorrectTeam(teamObject: any, lookupProp: number, cardinal: string) {
		const pairData: { pairArray: string[]; teamNumber: string | number } = {
			pairArray: [],
			teamNumber: ''
		};
		for (const team in teamObject) {
			const foundTeam = teamObject[team];
			const lookupKey = `${cardinal}PairNo`;
			if (foundTeam[lookupKey] === lookupProp) {
				console.log('foundTeam: ', foundTeam);

				const pairArray = foundTeam[`${cardinal}Pair`];
				const teamNumber = foundTeam.teamNumber;

				pairData.pairArray = pairArray;
				pairData.teamNumber = teamNumber;

				console.log(cardinal, 'found in findCorrectTeam: ', pairData);
			}
		}
		return pairData;
	}

	private finadPairNumber(teamObject: any, lookupProp: number) {}

	creatPairConfigArray(teamObject: any) {
		const pairConfigArray: any[] = [];
		for (const key in teamObject) {
			if (teamObject.hasOwnProperty(key)) {
				const team = teamObject[key];
				const teamPairConfigArray = Object.keys(team.pairConfig).map(pairKey => ({
					[pairKey]: team.pairConfig[pairKey]
				}));
				pairConfigArray.push(...teamPairConfigArray);
			}
		}
		return pairConfigArray;
	}

	public generateArrays(
		teamObject,
		startOrder: boolean,
		totalTeams: number,
		pairConfig: any,
		nsOrderArr: number[],
		ewOrderArr?: number[]
	) {
		const arraysObject: any = {};
		if (!startOrder) {
			const keys = Object.keys(teamObject);
			keys.forEach((key, index) => {
				const teamNumber = nsOrderArr[index];
				const team = teamObject[teamNumber];
				const array = [team.north, team.south, team.east, team.west];
				const newKey = index + 1;

				if (!arraysObject.hasOwnProperty(newKey)) {
					arraysObject[newKey] = array;
				}
			});
		} else {
			const keys = Object.keys(teamObject);

			keys.forEach((key, index) => {
				const nsPairLookup = nsOrderArr[index];
				const ewPairLookup = ewOrderArr[index];
				const nsLookup = this.getTeamNumber(nsOrderArr[index], totalTeams);
				const ewLookup = this.getTeamNumber(ewOrderArr[index], totalTeams);

				let nsTeam;
				let ewTeam;
				let array: any[] = [];
				if (this.teamType === 1) {
					nsTeam = teamObject[nsLookup];
					ewTeam = teamObject[ewLookup];
					array = [nsTeam.north, nsTeam.south, ewTeam.east, ewTeam.west];
				} else {
					nsTeam = pairConfig[nsPairLookup];
					ewTeam = pairConfig[ewPairLookup];
					array = [nsTeam[0], nsTeam[1], ewTeam[0], ewTeam[1]];
				}
				const newKey = index + 1;
				if (!arraysObject.hasOwnProperty[newKey]) {
					arraysObject[newKey] = array;
				}
			});
		}
		return arraysObject;
	}

	// findTeamPairByNumber(pairConfigArray: any[], nsLookup: string, ewLookup: string) {
	// 	console.log('pairConfig in findTeamPair: ', pairConfigArray);
	// 	console.log('nsLookup string in findTeamPair: ', nsLookup);
	// 	console.log('ewLookup string in findTeamPair: ', ewLookup);
	// 	for (const pairs of pairConfigArray) {
	// 		console.log('Pairs of pairConfigArray: ', pairs);

	// 		const foundNsPair = pairs.find(pair => pair.includes(nsLookup));
	// 		const foundEwPair = pairs.find(pair => pair.includes(ewLookup));

	// 		if (foundNsPair && foundEwPair) {
	// 			return { foundNsPair, foundEwPair };
	// 		}
	// 	}
	// 	return {};
	// }

	getTeamNumber(lookup: number, totalTeams: number) {
		if (lookup - totalTeams <= 0) {
			return lookup;
		} else {
			const newLookup = lookup - totalTeams;
			return newLookup;
		}
	}

	generateSideTeamMap(sidesOfInt: number, teamsInPlay: string[]) {
		let sideTeamMap: any = {};

		if (sidesOfInt === 0) {
			sideTeamMap = { [0]: teamsInPlay };
		} else {
			const teamsPerSide: number = Number(sidesOfInt) / 4;

			// console.log('teamsPerSide: ', teamsPerSide);
			const numOfSides: number = Number(teamsInPlay.length) / teamsPerSide;

			// console.log('Number of sides: ', numOfSides);
			for (let i = 0; i < numOfSides; i++) {
				const teamArray = teamsInPlay.splice(0, teamsPerSide);
				sideTeamMap[i] = teamArray;
			}
		}

		return sideTeamMap;
	}

	private getActiveTeams(teamsValue, totalTeams: number): string[] {
		console.log(teamsValue);
		console.log('Total teams: ', totalTeams);
		return teamsValue.slice(0, totalTeams);
	}

	private getStartOrder() {}

	private processMovement(movementTxt) {
		// should return an object with:
		// - movement lines minus movement name line
		// - totalTables
		// - totalTeams
		const movementArray: string[] = this.splitMovement(movementTxt);
		const originalMovement: string[] = [...movementArray];

		const totalTables = this.getTotalTables([...originalMovement]);
		const totalTeams = this.getTotalTeams([...originalMovement]);
		// const startOrder = this.getStartOrder();

		return { movementArray, originalMovement, totalTables, totalTeams };
	}

	private splitMovement(movementTxt): string[] {
		let movementArray = movementTxt[0].split('\n');
		movementArray.shift();
		movementArray = this.cleanMovement(movementArray);

		return movementArray;
	}

	private cleanMovement(movementArray) {
		return movementArray.filter(e => e !== '');
	}

	getTotalTables(movementArray: string[]) {
		return movementArray[0].trim().split(',')[1].trim();
	}

	private getTotalTeams(movementArray: string[]) {
		let teamsArr: string[] = [];
		movementArray.shift();
		movementArray.forEach(line => {
			teamsArr.push(line[0]);
		});
		return teamsArr.length;
	}

	private assignTeamNumbers(allPlayers: string[], startingTeams: string[]) {
		const nsPLayers = allPlayers.slice(allPlayers.length / 2);
	}

	private assignPositions(teamObject: any, nsStartOrder: number[]) {
		const teamKeys = Object.keys(teamObject);
		teamKeys.forEach((key, index) => {
			if (teamObject.hasOwnProperty(key)) {
				if (!teamObject[key].startPosition) {
					teamObject[key].startPosition = nsStartOrder[index];
				}
				if (!teamObject[key].teamNumber) {
					teamObject[key].teamNumber = parseInt(key, 10);
				}
			}
		});
	}

	public builCardinals(teamArray: any[]) {
		const cardinals: { north: any[]; south: any[]; east: any[]; west: any[] } = {
			north: [],
			south: [],
			east: [],
			west: []
		};

		teamArray.forEach((team, index) => {
			cardinals.north.push(team.north);
			cardinals.south.push(team.south);
			cardinals.east.push(team.east);
			cardinals.west.push(team.west);
		});
		return cardinals;
	}

	private oldBuildCardinals(
		teamObject: { nsPairNo: number; ewPairNo: number }[],
		nameObject: {
			splitPairs: string[];
			assignedPairNumbers: { string: string[] }[];
		}
	): { north: string[]; south: string[]; east: string[]; west: string[] } {
		const cardinals: {
			north: string[];
			south: string[];
			east: string[];
			west: string[];
		} = { north: [], south: [], east: [], west: [] };

		const { splitPairs, assignedPairNumbers } = nameObject;
		for (const team in teamObject) {
			if (teamObject.hasOwnProperty(team)) {
				const value = teamObject[team];
				const nsPairNumber = value.nsPairNo;
				const ewPairNumber = value.ewPairNo;

				const nsNamesPair = assignedPairNumbers.find(pairObj =>
					this.findPairNumber(pairObj, nsPairNumber)
				);
				if (nsNamesPair) {
					const pairOfNames = nsNamesPair[nsPairNumber.toString()];
					cardinals.north.push(pairOfNames[0]);
					cardinals.south.push(pairOfNames[1]);
				}
				const ewNamesPair = assignedPairNumbers.find(pairObj =>
					this.findPairNumber(pairObj, ewPairNumber)
				);
				if (ewNamesPair) {
					const pairOfNames = ewNamesPair[ewPairNumber.toString()];
					cardinals.east.push(pairOfNames[0]);
					cardinals.west.push(pairOfNames[1]);
				}
			}
		}
		return cardinals;
	}

	private determineTeamGameType(movementArray, totalTeams) {
		movementArray.shift();
		let columnOne = [];
		let columnTwo = [];
		movementArray.forEach(line => {
			const lineArr = line.split(',');
			columnOne.push(lineArr[0]);
			columnTwo.push(lineArr[1]);
		});

		const concat = columnOne.concat(columnTwo);
		concat.sort((a, b) => b - a);
		const highest = Number(concat[0]);
		if (highest === totalTeams * 2) {
			return { type: 2 };
		} else if (highest === totalTeams) {
			return { type: 1 };
		} else {
			return { type: undefined };
		}
	}

	private buildTeams(
		movementArray,
		totalTeams: number,
		teamGameType: { type: number }
	) {
		let teamObject: any = {};
		// Build team based on game type
		if (teamGameType.type === 1) {
			teamObject = this.buildTypeOneTeams(movementArray, totalTeams);
		} else {
			console.log('Building type 2 team');

			teamObject = this.buildTypeTwoTeams(movementArray, totalTeams);
		}

		// const teamNames = teams
		return teamObject;
	}

	private expandTeamObject(teamObject, nameObject, teamNameArray) {
		this.assignPlayerNamesToTeams(teamObject, nameObject);
		// console.log('Team Object after assign player names: ', teamObject);
		this.assignTeamNames(teamObject, teamNameArray);
		// console.log('Team Object after assign team names: ', teamObject);
		this.assignPositions(teamObject, this.nsStartOrder);
	}

	private assignTeamNames(teamObject: any, teamNameArray) {
		const teams: any[] = Object.keys(teamObject);
		// console.log('teams array from teamObject: ', teams);

		teams.forEach((key, index) => {
			const team = teamObject[key];
			if (team) {
				team.teamName = teamNameArray[index];
			}
		});
	}

	private findPairNumber(pairObj: any, cardinalPairNumber: number) {
		const pairNumber: number = parseInt(Object.keys(pairObj)[0]);
		return pairNumber === cardinalPairNumber;
	}

	private assignPlayerNamesToTeams(
		teamObject: {
			nsPair: string[];
			ewPair: string[];
			nsPairNo: number;
			ewPairNo: number;
			north: string;
			south: string;
			east: string;
			west: string;
			pairConfig: { [key: string]: {} };
		}[],
		nameObject: {
			splitPairs: string[];
			assignedPairNumbers: { string: string[] }[];
		}
	) {
		const { assignedPairNumbers } = nameObject;
		for (const team in teamObject) {
			const teamEntry = teamObject[team];
			const foundNs = assignedPairNumbers.find(pairObj =>
				this.findPairNumber(pairObj, teamEntry.nsPairNo)
			);
			const foundEw = assignedPairNumbers.find(pairObj =>
				this.findPairNumber(pairObj, teamEntry.ewPairNo)
			);

			const nsValues = Object.values(foundNs)[0];
			const ewValues = Object.values(foundEw)[0];

			// console.log('Team Object[team]: ', teamObject[team]);

			teamObject[team].nsPair = nsValues;
			teamObject[team].ewPair = ewValues;
			teamObject[team].north = nsValues[0];
			teamObject[team].south = nsValues[1];
			teamObject[team].east = ewValues[0];
			teamObject[team].west = ewValues[1];

			if (!teamObject[team].pairConfig) {
				teamObject[team].pairConfig = {};
			}

			teamObject[team].pairConfig[teamEntry.nsPairNo.toString()] = [
				nsValues[0],
				nsValues[1]
			];
			teamObject[team].pairConfig[teamEntry.ewPairNo.toString()] = [
				ewValues[0],
				ewValues[1]
			];
		}
		return teamObject;
	}

	buildTypeOneTeams(movementOnly: string[], totalTeams: number) {
		const teamObject: any = {};
		const nsStartOrder: number[] = [];
		const ewStartOrder: number[] = [];

		movementOnly.forEach(line => {
			const teamNumber = Number(line.split(',')[0]);
			nsStartOrder.push(teamNumber);
			const nsPairNumber = teamNumber;
			if (!teamObject[`${teamNumber}`]) {
				teamObject[`${teamNumber}`] = {};
			}
			teamObject[`${teamNumber}`].nsPairNo = nsPairNumber;
			teamObject[teamNumber].nsPairConfig = {};
			teamObject[teamNumber].nsPairConfig.pairNumber = nsPairNumber;
		});

		movementOnly.forEach(line => {
			const teamNumber = Number(line.split(',')[1]);
			ewStartOrder.push(teamNumber);
			const ewPairNumber = teamNumber + totalTeams;

			teamObject[`${teamNumber}`].ewPairNo = ewPairNumber;

			teamObject[teamNumber].ewPairConfig = {};
			teamObject[teamNumber].ewPairConfig.pairNumber = ewPairNumber;
		});
		this.nsStartOrder = nsStartOrder;
		this.ewStartOrder = ewStartOrder;
		// teamObject.nsStartOrder = nsStartOrder;
		// teamObject.ewStartOrder = ewStartOrder;
		return teamObject;
	}

	buildTypeTwoTeams(movementOnly: string[], totalTeams: number) {
		const teamNumbersArr: number[] = [];
		for (let i = 0; i < totalTeams; i++) {
			teamNumbersArr.push(i + 1);
		}

		const typeTwoTeam: any = {};
		const nsPairs: number[] = [];
		const ewPairs: number[] = [];
		movementOnly.forEach((line, index) => {
			const nsPairNo = Number(line.split(',')[0]);
			const ewPairNo = Number(line.split(',')[1]);
			nsPairs.push(nsPairNo);
			ewPairs.push(ewPairNo);
		});

		nsPairs.forEach(pair => {
			this.nsStartOrder.push(pair);
		});
		ewPairs.forEach(pair => {
			this.ewStartOrder.push(pair);
		});

		const sortedNsPairs = nsPairs.sort();
		const sortedEwPairs = ewPairs.sort();

		const sortedArr = nsPairs.concat(ewPairs).sort();
		const highest = sortedArr[sortedArr.length - 1];

		if (highest / totalTeams === 2) {
			teamNumbersArr.forEach((teamNumber, index) => {
				const nsPair = teamNumber;
				const ewPair = this.getEwPairNo(teamNumber, totalTeams);

				if (!typeTwoTeam[teamNumber]) {
					typeTwoTeam[teamNumber] = {};
				}
				typeTwoTeam[teamNumber].nsPairNo = nsPair;
				typeTwoTeam[teamNumber].ewPairNo = ewPair;
				if (!typeTwoTeam[teamNumber].pairConfig) {
					typeTwoTeam[teamNumber].pairConfig = {};
				}
				const pairConfig = { [nsPair.toString()]: {}, [ewPair.toString()]: {} };

				typeTwoTeam[teamNumber].pairConfig = pairConfig;
				// console.log('Type two team: ', typeTwoTeam[teamNumber]);

				// typeTwoTeam[teamNumber].ewPairConfig = { pairNumber: ewPair };
			});
			return typeTwoTeam;
		}
	}

	getEwPairNo(teamNumber: number, totalTeams: number) {
		return totalTeams + teamNumber;
	}

	private processNames(namesValue: string[], totalPairs: number): any {
		const nameObject = this.extractNamesInPlay(namesValue, totalPairs);

		return nameObject;
	}

	private buildPairConfig(nameObject: { assignedPairNumbers: [] }) {
		const pairConfig: any = {};
		const { assignedPairNumbers } = nameObject;
		assignedPairNumbers.forEach((pairNumber: { key: string[] }, index) => {
			if (!pairConfig[index + 1]) {
				pairConfig[index + 1] = {};
			}
			// console.log('Pair Number parameter in loop: ', pairNumber);
			const pairArray = pairNumber[index + 1];
			// console.log('Determined Pair array: ', pairArray);
			pairConfig[index + 1] = pairArray;
		});
		// console.log('Built pair config: ', pairConfig);

		return pairConfig;
	}

	private getTotalPairs(teamObject: any) {
		const teams = Object.keys(teamObject);
		// console.log('Teams in getTotalPairs: ', teams);

		const pairsArray: any[] = [];
		teams.forEach((team, index) => {
			const array = Object.values(teamObject[team]);
			// console.log('Array in getTotalPairs loop: ', array);
			pairsArray.push(array[0], array[1]);
		});
		// console.log('Pairs array: ', pairsArray);
		return pairsArray.length;
	}

	private extractNamesInPlay(
		namesValue: string[],
		totalPairs: number
	): { splitPairs: any[]; assignedPairNumbers: any } {
		// console.log('Total pairs in extractNames: ', totalPairs);

		const namePairs = namesValue[0].split('\n').slice(0, totalPairs);
		const splitPairs = this.splitPairs(namePairs);
		const assignedPairNumbers = this.assignPairsNumbers(namePairs);

		return { splitPairs, assignedPairNumbers };
	}

	assignPairsNumbers(namePairs: string[]): any[] {
		const pairsAndNumbers: any[] = [];
		namePairs.forEach((pair, index) => {
			const pairObject: any = {};
			const tempPair = pair.split('&');
			const pairOfNames = [tempPair[0].trim(), tempPair[1].trim()];
			pairObject[`${index + 1}`] = pairOfNames;
			pairsAndNumbers.push(pairObject);
		});
		return pairsAndNumbers;
	}

	private splitPairs(namePairs: string[]): string[] {
		const splitPairs: string[] = [];
		namePairs.forEach(pair => {
			const set = pair.split('&');
			splitPairs.push(set[0].trim());
			splitPairs.push(set[1].trim());
		});
		return splitPairs;
	}

	private splitNamesText(namesValue: string[], totalTeams: number): string[] {
		const peopleArr: string[] = namesValue[0].split('\n');
		if (peopleArr.length / 2 !== totalTeams) {
			if (!peopleArr[peopleArr.length - 1].length) {
				peopleArr.pop();
			}
		}
		return peopleArr;
	}

	// private splitMovement(movementText) {
	// 	const movementLines: string[] = movementText[0].split('\n');
	// 	const totalTables = this.getTotalTables(movementLines);
	// 	const movementOnly = movementLines.slice(2, movementLines.length);
	// 	// const teamsInPlay

	// 	return { totalTables, movementOnly, movementLines };
	// }

	getHighestTeamNumber(movementText) {}

	determineTypeOneTeams(movementOnly: string[], totalTables: number) {
		// console.log('MovementOnly parameter in determineTeamsInPlay: ', movementOnly);

		const allTeams: string[] = [];
		const vsTeams: string[] = [];

		movementOnly.forEach((line, index) => {
			allTeams.push(line.split(',')[0]);
			vsTeams.push(line.split(',')[1]);
		});

		// console.log(allTeams.length);
		// console.log(vsTeams.length);
		// console.log();

		if ((allTeams.length + vsTeams.length) / 2 === totalTables) {
			console.log('no extras');

			return { allTeams, startingTeams: allTeams };
		} else {
			// const startingTeams =
			// SITTING OUT TEAMS????
			const sorted = [...allTeams].sort((a, b) => Number(a) - Number(b));
			const teamsInPlay = sorted.slice(0, totalTables);
			const extras = sorted.slice(totalTables, allTeams.length);

			return { allTeams, startingTeams: teamsInPlay, vsTeams, extraTeams: extras };
		}
	}

	determineTeamNumber(pairNumber: number, totalTeams: number) {
		let teamNumber: number;
		if (pairNumber - totalTeams <= 0) {
			teamNumber = pairNumber;
		} else {
			teamNumber = pairNumber - totalTeams;
		}

		return teamNumber;
	}
	private getEventName(settingsText: string[]) {
		// console.log('settingsText in getEventName: ', settingsText);

		const eventString = settingsText[0].split('\n')[4];
		return this.stripOptionKey(eventString, 'EN ');
	}

	private stripOptionKey(wholeString: string, unwantedString: string) {
		const sliceIndex = unwantedString.length;
		return wholeString.slice(sliceIndex, wholeString.trim().length);
	}

	getMatchType(settingsTxt): {
		matchType: any;
		matchString: string;
		sidesOf: any;
		eventName: string;
	} {
		if (!settingsTxt) {
			return undefined;
		}
		const {
			current_game_data: { value }
		} = settingsTxt;
		const eventName = this.getEventName(value);
		const settingsDigits = this.extractOTH(value[0].split('\n')[6]);
		const sidesOf = settingsDigits[34];
		const matchType: { pairs?: boolean; teams?: boolean; individual?: boolean } =
			{};

		let matchString: 'pairs' | 'teams' | 'individual';

		for (const text of value) {
			if (text.startsWith('MV I')) {
				matchType.individual = true;
				matchString = 'individual';
			} else if (text.startsWith('MV T')) {
				matchType.teams = true;
				matchString = 'teams';
			} else if (text.startsWith('MV P') || text.startsWith('MV CPM')) {
				matchString = 'pairs';
				if (text.startsWith('MV CPM')) {
					console.log('USEBIO Import');
				}
				matchType.pairs = true;
			} else {
				matchType.pairs = true;
				matchString = 'pairs';
			}
		}

		return { matchType, matchString, sidesOf, eventName };
	}

	private extractOTH(string) {
		return string.split(' ')[1].split('.');
	}
}

/*

 * */
