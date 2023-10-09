import { Injectable } from '@angular/core';
import { IndexedDatabaseService } from './indexed-database.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
@Injectable({
	providedIn: 'root'
})
export class ProcessCurrentMatchService {
	constructor(
		private indexedDatabaseService: IndexedDatabaseService,
		private indexedDatabaseStatus: IndexedDatabaseStatusService
	) {}

	getMatchType(data: any): string {
		const settingsTxt = data.currentgamedata.settingstxt;
		console.log('settings txt: ', settingsTxt);
		for (const text of settingsTxt) {
			if (text.startsWith('MV I')) {
				console.log('individual');
				return 'individual';
			} else if (text.startsWith('MV T')) {
				console.log('team');
				return 'team';
			} else if (text.startsWith('MV P')) {
				console.log('pairs');
				return 'pairs';
			}
		}
		return 'pairs';
	}

	async getCurrentHands(selectedMatchType): Promise<any> {
		try {
			if (!selectedMatchType) {
				throw new Error('No match type detected');
			}
			const storeName = `${selectedMatchType}-handanxs_data`;
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
}
