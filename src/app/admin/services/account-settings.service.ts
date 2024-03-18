import { Injectable } from '@angular/core';
import { IndexedDatabaseService } from '../games/services/indexed-database.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { Observable, Subject, startWith } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class AccountSettingsService {
	databaseName: string = 'ibe_game_data';
	initialAccountData: any = {};

	accountValueKeys: string[] = [
		'$',
		'name',
		'pname',
		'email',
		'ctry',
		'showipt',
		'startdt',
		'paidtilldt',
		'acttype',
		'payextbutlbl',
		'actgrp',
		'uptodtcol',
		'boolexpi',
		'creds',
		'cmult',
		'ids',
		'strat',
		'ebupass',
		'county',
		'town',
		'phone',
		'fax',
		'bwacct',
		'bwpass',
		'scorer',
		'maspyn',
		'director',
		'diremail',
		'ebuccode',
		'ebumptype',
		'ebumpsc'
	];

	private accountDataSubject = new Subject<any>();
	accountData$ = this.accountDataSubject.asObservable();

	constructor(private IDBService: IndexedDatabaseService) {}

	async fetchAccountSettings() {
		try {
			const serviceError = new Error();
			const storeName = 'xml_settings';
			const accountSettings = await this.IDBService.getAllDataFromStore(storeName);
			const settingsText = await this.IDBService.getByKey(
				'current_game_data',
				'settingstxt'
			);
			console.log('Settings text: ', settingsText);

			const eventName = this.getEventName(settingsText);
			console.log('Event Name: ', eventName);

			if (!accountSettings) {
				serviceError.message = `No data found in ${storeName}`;
				throw serviceError;
			}
			// this.initialAccountData = accountSettings

			const { value } = accountSettings[0];
			console.log('acctsets value: ', value);
			const accountConfig = this.buildAccountConfig(value[0]);

			const finalConfig: any = {};
			const ids = this.getIds(accountConfig.ids.id);
			finalConfig.ids = ids;
			console.log('ids: ', finalConfig.ids);
			finalConfig.eventName = eventName;
			finalConfig.ebu = ids.EBU.length ? true : false;
			finalConfig.england =
				accountConfig.ctry.toLowerCase() === 'england' ? true : false;
			const accountDetails = {
				email: accountConfig.email,
				dirEmail: accountConfig.diremail,
				phone: accountConfig.phone ? accountConfig.phone : '',
				name: accountConfig.name ? accountConfig.name : '',
				pName: accountConfig.pname ? accountConfig.pname : '',
				director: accountConfig.director ? accountConfig.director : ''
			};
			const bwDetails = {
				bwAccount: accountConfig.bwacct ? accountConfig.bwacct : '',
				bwPass: accountConfig.bwpass ? accountConfig.bwPass : ''
			};
			const ebuDetails = {
				chargeCode: accountConfig.ebuccode['$'].val
					? accountConfig.ebuccode['$'].val
					: '',
				mpScale: accountConfig.ebumpsc['$'].val
					? accountConfig.ebumpsc['$'].val
					: '',
				mpType: accountConfig.ebumptype['$'].val
					? accountConfig.ebumptype['$'].val
					: '',
				ebuPass: accountConfig.ebupass ? accountConfig.ebupass : ''
			};

			(finalConfig.accountGroup = accountConfig.actgroup
				? accountConfig.actgroup
				: ''),
				(finalConfig.bwDetails = bwDetails);
			finalConfig.ebuDetails = ebuDetails;
			finalConfig.accountDetails = accountDetails;

			console.log('Final Config: ', finalConfig);

			// console.log('Account config: ', accountConfig);
			this.setAccountData(finalConfig);
		} catch (error) {
			console.error('Error fetching account settings: ', error);
		}
	}

	private buildAccountConfig(accountValue) {
		const accountConfig: any = {};

		// console.log(Object.keys(accountValue));

		Object.keys(accountValue).forEach(key => {
			if (accountValue.hasOwnProperty(key)) {
				const value = accountValue[key];
				const element = value[0];
				accountConfig[key] = element;
			}
		});
		return accountConfig;
	}

	getEventName(settingsTxt: any): string {
		const settingsArray: string[] = settingsTxt.value[0].split('\n');
		console.log('Settings Array: ', settingsArray);
		const indexOfEn: number = settingsArray.indexOf(
			settingsArray.find(el => el.startsWith('EN'))
		);
		if (indexOfEn !== -1) {
			return settingsArray[indexOfEn].trim().split(' ').slice(1).join(' ').trim();
		} else {
			return '';
		}
	}

	getIds(idArray: any[]) {
		let idObject: any = {};
		idArray.forEach(id => {
			const {
				$: { type, val }
			} = id;
			idObject[type] = val;
		});
		return idObject;
	}

	private setAccountData(accountConfig) {
		this.accountDataSubject.next(accountConfig);
	}
}
