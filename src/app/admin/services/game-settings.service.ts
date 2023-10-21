import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IndexedDatabaseService } from '../games/services/indexed-database.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { DataService } from '../games/services/data.service';
import { SharedSettingsService } from './shared-settings.service';

@Injectable({
	providedIn: 'root'
})
export class GameSettingsService {
	dbName: 'ibe_game_data';
	initialSettingsData: any = {};

	constructor(
		private IDBservice: IndexedDatabaseService,
		private IDBStatusService: IndexedDatabaseStatusService,
		private dataService: DataService,
		private sharedSettingsService: SharedSettingsService
	) {}

	async fetchAllSettings(): Promise<any> {
		console.log('fetch all settings invoked');
		const serviceError = new Error();

		try {
			const storeName = 'xml_settings';

			const gameSettings = await this.IDBservice.getAllDataFromStore(storeName);
			if (!gameSettings) {
				serviceError.message = 'No settings retrieved from database';
				throw serviceError;
			}

			this.initialSettingsData = gameSettings;

			console.log('gameSettings retrieved successfully from store: ', gameSettings);

			if (gameSettings) {
				console.log('invoking split settings');

				await this.splitSettings(gameSettings);
			}

			this.sharedSettingsService.populateGameSettings(gameSettings);
		} catch (error) {
			throw error;
		}
	}

	async splitSettings(initialData) {
		try {
			const setUpConfig: any = {
				newEventUses: '',
				twoPageStartup: '',
				tdEntersNames: '',
				requireAllNames: '',
				teamSignIn: '',
				onGameCreation: '',
				usePin: '',
				pinLength: '',
				pinType: '',
				pinCase: '',
				spectateApp: '',
				spectateWebsite: ''
			};
			// const usesets = initalData.find(item => item.key === 'usesets');

			const usesets = this.findItemInArray(initialData, 'usesets');
			const initsets = this.findItemInArray(initialData, 'initsets');
			const secsets = this.findItemInArray(initialData, 'secsets');
			const pluisets = this.findItemInArray(initialData, 'pluisets');
			const scosets = this.findItemInArray(initialData, 'scosets');
			const namsets = this.findItemInArray(initialData, 'namsets');

			setUpConfig.newEventUses = this.getUseSets(usesets);

			const initConfig = this.getInitSets(initsets);
			console.log(initConfig);

			console.log('setup config newEvent: ', setUpConfig.newEventUses);
		} catch (error) {
			throw error;
		}
	}
	findItemInArray(array, key) {
		return array.find(item => item.key === key);
	}

	private setupSettingsMap = {};

	async manipulateSetupSettings(setupSetttings) {
		const setUpConfig: any = {
			newEventUses: '',
			twoPageStartup: '',
			tdEntersNames: '',
			requireAllNames: '',
			teamSignIn: '',
			onGameCreation: '',
			usePin: '',
			pinLength: '',
			pinType: '',
			pinCase: '',
			spectateApp: '',
			spectateWebsite: ''
		};

		const { usesets, initsets, secsets } = setupSetttings;
		console.log(usesets);

		setUpConfig.newEventUses = await this.getUseSets(usesets);
		console.log('setupconfig new event: ', setUpConfig.newEventUses);
		return setUpConfig;
	}

	getUseSets(usesets) {
		const { value } = usesets;
		return value[0].ubs === 'b' ? 'current' : 'previous';
	}

	destructureSettings(settings) {
		const { value } = settings;
		return value[0];
	}

	getInitSets(initsets) {
		const initsetsObject = this.destructureSettings(initsets)
		const initConfig:any ={}
		initsetsObject.popup[0]['$'].val === 'y' ? initConfig.twoPageVal = true : false
		initsetsObject.prenam[0]['$'].val === 'y'
		return initConfig
	}


}
