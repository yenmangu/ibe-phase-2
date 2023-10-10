import { Injectable } from '@angular/core';
import { IndexedDatabaseService } from './indexed-database.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
@Injectable({
	providedIn: 'root'
})
export class ProcessHandsService {
	constructor(
		private indexedDatabaseService: IndexedDatabaseService,
		private indexedDatabaseStatus: IndexedDatabaseStatusService
	) {}

	getMatchType(settingsTxt: any): string {
		if (!settingsTxt) {
			return undefined;
		} else {
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
	}

	async getSettingsTxt(): Promise<any> {
		try {
			const settingsTxt = await this.indexedDatabaseService.getByKey(
				'current_game_data',
				'settingstxt'
			);
			console.log(settingsTxt);
		} catch (err) {
			throw err;
		}
	}

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
}
