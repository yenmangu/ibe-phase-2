import { Injectable } from '@angular/core';
import { IndexedDatabaseService } from '../indexed-database.service';

@Injectable({
	providedIn: 'root'
})
export class ApiDataProcessingService {
	constructor(private indexedDatabaseService: IndexedDatabaseService) {}

	async processData(selectedMatchType): Promise<any> {
		try {
			if (!selectedMatchType) {
				throw new Error('No store name provided to "processData" ');
			}
			console.log(
				'selected match type in api data processing: ',
				selectedMatchType
			);
			// const playerData = await this.retrieveDataByStore(selectedMatchType);
			const allPlayerDb = await this.retrieveAllPlayerDb(selectedMatchType);

			if (!allPlayerDb) {
				throw new Error('No data retrieved by helper function in "processData"');
			}

			console.log('dataToSend: ', allPlayerDb);
			// return;
			return allPlayerDb;
		} catch (err) {
			throw err;
		}
	}

	private async retrieveDataByStore(storeName: string): Promise<any> {
		try {
			if (!storeName) {
				throw new Error('No store name provided');
			}
			console.log('store name in retrieveDataByStore: ', storeName);
			const result = await this.indexedDatabaseService.getAllDataFromStore(
				storeName
			);
			if (!result) {
				throw new Error(`No data found in specified store: ${storeName}`);
			}
			console.log('result from retrieving data: ', result);
			return result;
		} catch (err) {
			throw err;
		}
	}

	private async retrieveAllPlayerDb(selectedMatchType): Promise<any> {
		try {
			const playerStore = `${selectedMatchType}-player`;
			const teamStore = `${selectedMatchType}-team`;
			const venueStore = `${selectedMatchType}-loc`;
			const eventStore = `${selectedMatchType}-event`;

			const playerData = await this.indexedDatabaseService.getAllDataFromStore(
				playerStore
			);
			const teamData = await this.indexedDatabaseService.getAllDataFromStore(
				teamStore
			);
			const venueData = await this.indexedDatabaseService.getAllDataFromStore(
				venueStore
			);
			const eventData = await this.indexedDatabaseService.getAllDataFromStore(
				eventStore
			);

			const playerValues = playerData.map(item => item.value);
			const teamValues = teamData.map(item => item.value);
			const venueValues = venueData.map(item => item.value);
			const eventValues = eventData.map(item => item.value);

			const allPlayersArray = playerValues.concat(
				teamValues,
				venueValues,
				eventValues
			);

			console.log('entire player array: ', allPlayersArray);
			// return;
			return allPlayersArray;
			// console.log('player values: ', playerValues);
		} catch (err) {
			throw err;
		}
	}
}
