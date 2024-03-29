import { Injectable } from '@angular/core';
import { IndexedDatabaseService } from '../../games/services/indexed-database.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';

@Injectable({
	providedIn: 'root'
})
export class ProcessHandsService {
	constructor(
		private indexedDatabaseService: IndexedDatabaseService,
		private indexedDatabaseStatus: IndexedDatabaseStatusService
	) {}

	async getCurrentHands(selectedMatchType): Promise<any> {
		try {
			if (!selectedMatchType) {
				throw new Error('No match type detected');
			}
			const storeName = `handanxs_data`;
			const key = 'handanx';
			const handData = await this.indexedDatabaseService.getByKey(storeName, key);
			if (handData) {
				// console.log(handData)
				return handData;
			} else {
				throw new Error('No hand data in store');
			}
		} catch (err) {
			throw err;
		}
	}
	async getHandConfig(selectedMatchType):Promise <any>{
		try {
			if(!selectedMatchType){
				throw new Error('No Match Type Selected')
			}
			const storeName = 'hand_data'
			const key = 'hands'
			const fullHands = await this.indexedDatabaseService.getByKey(storeName,key);
			if(fullHands){
				return fullHands
			}
		} catch (error) {
			throw error
		}
	}
}
