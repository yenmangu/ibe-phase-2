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
				const splitResult = await this.splitSettings(gameSettings);
				// console.log('splitResult in the fetchAllSettings: ', splitResult);
				this.sharedSettingsService.populateGameSettings(splitResult);
				return splitResult;
			}
		} catch (error) {
			throw error;
		}
	}

	async splitSettings(initialData) {
		try {
			const settingsObject: any = {};
			const setupConfig: any = {
				newEventUses: ''
			};

			const usesets = this.findItemInArray(initialData, 'usesets');
			const initsets = this.findItemInArray(initialData, 'initsets');
			const secsets = this.findItemInArray(initialData, 'secsets');
			const pluisets = this.findItemInArray(initialData, 'pluisets');
			const scosets = this.findItemInArray(initialData, 'scosets');
			const namsets = this.findItemInArray(initialData, 'namsets');

			setupConfig.newEventUses = this.getUseSets(usesets);
			setupConfig.initConfig = this.getSetUpSets(usesets, initsets, secsets);

			settingsObject.scoringConfig = this.getScoringSets(scosets);
			settingsObject.appInterfaceConfig = this.getAppInterfaceSettings(pluisets);
			settingsObject.namingNumberingConfig =
				this.getNamingNumberingSettings(namsets);

			settingsObject.setupConfig = setupConfig;
			return settingsObject;
		} catch (error) {
			throw error;
		}
	}
	findItemInArray(array, key) {
		return array.find(item => item.key === key);
	}

	private setupSettingsMap = {};

	getUseSets(usesets) {
		const { value } = usesets;
		return value[0].ubs === 'b' ? 'current' : 'previous';
	}

	destructureSettings(settings) {
		const { value } = settings;
		return value[0];
	}

	getSetUpSets(usesets, initsets, secsets) {
		const initsetsObject = this.destructureSettings(initsets);
		const secsetsObject = this.destructureSettings(secsets);
		console.log('secsets object: ', secsetsObject);

		const setupConfig: any = {
			newEventUses: this.getUseSets(usesets),
			twoPageVal: '',
			requireAllNames: '',
			tdEntersNames: '',
			teamSignIn: '',
			onGameCreation: '',
			usePin: '',
			pinLength: '',
			pinType: '',
			pinCase: '',
			spectateApp: '',
			spectateWebsite: ''
		};
		setupConfig.twoPageVal =
			initsetsObject.popup[0]['$'].val === 'y' ? true : false;
		let requireAllNames, tdEntersNames;

		if (initsetsObject.prenam[0]['$'].val === 'f') {
			requireAllNames = true;
			tdEntersNames = true;
		} else if (initsetsObject.prenam[0]['$'].val === 'y') {
			requireAllNames = false;
			tdEntersNames = true;
		} else if (initsetsObject.prenam[0]['$'].val === 'n') {
			requireAllNames = false;
			tdEntersNames = false;
		}
		setupConfig.requireAllNames = requireAllNames;
		setupConfig.tdEntersNames = tdEntersNames;
		console.log('initsets ttid: ', initsetsObject.ttid);
		setupConfig.teamSignIn = initsetsObject.ttid[0]['$'].val === 'y' ? true : false;

		let onGameCreation;
		switch (secsetsObject.mlpc[0]['$'].val) {
			case 'u':
				onGameCreation = 'release-lock';
				break;
			case 'l':
				onGameCreation = 'lock-event';
				break;
			case 'o':
				onGameCreation = 'no-lock-change';
				break;
			default:
				onGameCreation = 'no-lock-change';
		}
		setupConfig.onGameCreation = onGameCreation;

		const {
			pin: [
				{
					['$']: { on: pinOn, len: pinLen, type: pinType, case: pinCase }
				}
			]
		} = secsetsObject;

		setupConfig.usePin = pinOn === 'y' ? true : false;
		let appPinType;
		switch (pinType) {
			case 'an':
				appPinType = 'alphanumeric';
				break;
			case 'a':
				appPinType = 'alphabetic';
				break;
			case 'n':
				appPinType = 'numeric';
				break;
			default:
				appPinType = 'numeric';
		}
		setupConfig.pinType = appPinType;

		setupConfig.pinLength = pinLen;
		setupConfig.pinCase = pinCase;
		const {
			spec: [
				{
					['$']: { web, app }
				}
			]
		} = secsetsObject;

		setupConfig.spectateApp = app === 'y' ? true : false;
		setupConfig.spectateWebsite = web === 'y' ? true : false;

		return setupConfig;
	}

	getScoringSets(scosets) {
		const scoringConfig: any = {
			scoringConfigArray: [],
			neuberg: '',
			tables: ''
		};
		const value = this.destructureSettings(scosets);
		// console.log('scosets value: ', value);

		const scm = value?.scms[0].scm;
		const petVal = value?.pet[0]['$'].val;
		const neubergVal = value?.neu[0]['$'].val;
		const tablesVal = value?.pnt[0]['$'].val;
		scoringConfig.neuberg = neubergVal;
		scoringConfig.tables = tablesVal;

		// console.log('scm array: ', scm);

		const scoringConfigArray = [
			{
				eventType: 'p',
				defaultSelected: false,
				preferredDuration: '',
				scoringMethods: ''
			},

			{
				eventType: 't',
				defaultSelected: false,
				preferredDuration: '',
				scoringMethods: ''
			},
			{
				eventType: '8',
				defaultSelected: false,
				preferredDuration: '',
				scoringMethods: ''
			},
			{
				eventType: '12',
				defaultSelected: false,
				preferredDuration: '',
				scoringMethods: ''
			},
			{
				eventType: '16',
				defaultSelected: false,
				preferredDuration: '',
				scoringMethods: ''
			},
			{
				eventType: 'i',
				defaultSelected: false,
				preferredDuration: '',
				scoringMethods: ''
			},
			{
				eventType: 'sp',
				defaultSelected: false,
				preferredDuration: '',
				scoringMethods: ''
			},
			{
				eventType: 'st',
				defaultSelected: false,
				preferredDuration: '',
				scoringMethods: ''
			}
		];

		scoringConfigArray.forEach(item => {
			const scmItem = scm.find(scm => scm['$'].for === item.eventType);

			if (scmItem) {
				item.preferredDuration = scmItem['$'].bds;
				item.scoringMethods = scmItem['$'].type;
				if (scmItem['$'].for === petVal) {
					item.defaultSelected = true;
				} else {
					item.defaultSelected = false;
				}
			}
		});
		scoringConfig.scoringConfigArray = scoringConfigArray;
		// console.log('scoring config array: ', scoringConfigArray);

		return scoringConfig;
	}

	getAppInterfaceSettings(pluisets) {
		const value = this.destructureSettings(pluisets);
		console.log('value to check initially: ', value);

		const {
			flash,
			pcsee: playersSee,
			pcchg: playersChange,
			pci: playersInput,
			qaba: quickAdjust,
			scov: oppsVerification,
			tos: resultsTimeout,
			warn: warnPlayers
		} = value;

		const appInterfaceConfig: any = {
			playersChange: [
				{ control0: false },
				{ control1: false },
				{ control2: false },
				{ control3: false }
			],
			playersInput: [
				{ control0: false },
				{ control1: false },
				{ control2: false },
				{ control3: false }
			],
			handDiagrams: false,
			ownResults: false,
			othersResults: false,
			rankings: false,
			adjustedScores: false,
			resultsTimeout: null,

			warnPlayers: [
				{ control0: false },
				{ control1: false },
				{ control2: false },
				{ control3: false },
				{ control4: false }
			]
		};

		const [
			{
				['$']: { hands, results, rankings, asd }
			}
		] = playersSee;
		const [
			{
				['$']: { dan, pn, tsn, rcr }
			}
		] = playersChange;
		const [
			{
				['$']: { leads, auctions, deals, notes }
			}
		] = playersInput;
		const [
			{
				['$']: { sw, sh, oo, un, nn }
			}
		] = warnPlayers;

		appInterfaceConfig.handDiagrams = hands === 'y' ? true : false;
		appInterfaceConfig.adjustedScores = asd === 'y' ? true : false;
		appInterfaceConfig.rankings = rankings === 'y' ? true : false;

		if (results === 'y') {
			appInterfaceConfig.ownResults = true;
			appInterfaceConfig.othersResults = true;
		} else if (results === 'o') {
			appInterfaceConfig.ownResults = true;
			appInterfaceConfig.othersResults = false;
		} else {
			appInterfaceConfig.ownResults = false;
			appInterfaceConfig.othersResults = false;
		}
		appInterfaceConfig.flash = flash[0]['$'].val === 'y' ? true : false;
		appInterfaceConfig.qaba = quickAdjust[0]['$'].val === 'y' ? true : false;
		appInterfaceConfig.scov = oppsVerification[0]['$'].val === 'y' ? true : false;

		// no longer needed due to change in struture
		// appInterfaceConfig.additionalConfig[0].control0 =
		// 	flash[0]['$'].val === 'y' ? true : false;
		// appInterfaceConfig.additionalConfig[0].control1 =
		// 	quickAdjust[0]['$'].val === 'y' ? true : false;
		// appInterfaceConfig.additionalConfig[0].control2 =
		// 	oppsVerification[0]['$'].val === 'y' ? true : false;

		appInterfaceConfig.resultsTimeout = resultsTimeout[0]['$'].val;

		appInterfaceConfig.playersChange[0].control0 = dan === 'y' ? true : false;
		appInterfaceConfig.playersChange[0].control1 = pn === 'y' ? true : false;
		appInterfaceConfig.playersChange[0].control2 = tsn === 'y' ? true : false;
		appInterfaceConfig.playersChange[0].control3 = rcr === 'y' ? true : false;

		appInterfaceConfig.playersInput[0].control0 = leads === 'y' ? true : false;
		appInterfaceConfig.playersInput[0].control1 = auctions === 'y' ? true : false;
		appInterfaceConfig.playersInput[0].control2 = deals === 'y' ? true : false;
		appInterfaceConfig.playersInput[0].control3 = notes === 'y' ? true : false;

		appInterfaceConfig.warnPlayers[0].control0 = sw === 'y' ? true : false;
		appInterfaceConfig.warnPlayers[0].control1 = sh === 'y' ? true : false;
		appInterfaceConfig.warnPlayers[0].control2 = oo === 'y' ? true : false;
		appInterfaceConfig.warnPlayers[0].control3 = un === 'y' ? true : false;
		appInterfaceConfig.warnPlayers[0].control4 = nn === 'y' ? true : false;

		// console.log('appInterface config: ', appInterfaceConfig);

		return appInterfaceConfig;
	}

	getNamingNumberingSettings(namsets) {
		const value = this.destructureSettings(namsets);

		// console.log(value);

		const namingNumberingConfig: any = {
			mitchellEWNumbers: '',
			tableNaming: '',
			shortenPlayerNames: '',
			defaultNameStyle: ''
		};

		const {
			mn: mitchellNum,
			stn: tableName,
			sh: shortenName,
			dpn: defaultName
		} = value;

		let mitchellVal;
		switch (mitchellNum[0]['$'].val) {
			case '10':
				mitchellVal = 'add_10';
				break;
			case '20':
				mitchellVal = 'add_20';
				break;
			case 't':
				mitchellVal = 'table_number';
				break;
			case 'n':
				mitchellVal = 'follow_ns';
				break;
			default:
				mitchellVal = 'add_10';
		}
		namingNumberingConfig.mitchellEWNumbers = mitchellVal;

		// stn
		let tableNameVal;
		switch (tableName[0]['$'].val) {
			case 'a':
				tableNameVal = 'a';
				break;
			case '1':
				tableNameVal = 'from_1';
				break;
			case '11':
				tableNameVal = 'from_11';
				break;
			case 's':
				tableNameVal = 'sequential';
				break;
			default:
				tableNameVal = 'a';
		}
		namingNumberingConfig.tableNaming = tableNameVal;

		// sh
		namingNumberingConfig.shortenPlayerNames =
			shortenName[0]['$'].val === 'f' ? 'first_names' : 'last_names';

		// dpn
		let defaultNameVal;
		switch (defaultName[0]['$'].val) {
			case '0':
				defaultNameVal = 'historical_figures';
				break;
			case '1':
				defaultNameVal = 'tap';
				break;
			case '2':
				defaultNameVal = 'presidents_spouses';
				break;
			case '3':
				defaultNameVal = 'greek_goddesses';
				break;
			default:
				defaultNameVal = 'tap';
		}
		namingNumberingConfig.defaultNameStyle = defaultNameVal;

		return namingNumberingConfig;
	}

	// loopInterfaceSettings(pluisets) {
	// 	const value = this.destructureSettings(pluisets);

	// 	const {
	// 		flash,
	// 		pcsee: playersSee,
	// 		pcchg: playersChange,
	// 		pci: playersInput,
	// 		qaba: quickAdjust,
	// 		scov: oppsVerification,
	// 		tos: resultsTimeout,
	// 		warn: warnPlayers
	// 	} = value;

	// 	const appInterfaceConfig: any = {
	// 		playersChange: Array(4).fill({ control0: false }),
	// 		playersInput: Array(4).fill({ control0: false }),
	// 		handDiagrams: false,
	// 		ownResults: false,
	// 		othersResults: false,
	// 		rankings: false,
	// 		adjustedScores: false,
	// 		resultsTimeout: null,
	// 		additionalConfig: [{}],
	// 		warnPlayers: Array(5).fill({ control0: false })
	// 	};

	// 	const controlMappings: any = {
	// 		handDiagrams: 'hands',
	// 		ownResults: 'results',
	// 		othersResults: 'results',
	// 		rankings: 'rankings',
	// 		adjustedScores: 'asd',
	// 		additionalConfig: 'val',
	// 		resultsTimeout: 'val',
	// 		playersChange: ['dan', 'pn', 'tsn', 'rcr'],
	// 		playersInput: ['leads', 'auctions', 'deals', 'notes'],
	// 		warnPlayers: ['sw', 'sh', 'oo', 'un', 'nn']
	// 	};

	// 	for (const formGroup in appInterfaceConfig) {
	// 		if (formGroup === 'playersChange' || formGroup === 'playersInput' || formGroup === 'warnPlayers') {
	// 			controlMappings[formGroup].forEach((control, index) => {
	// 				appInterfaceConfig[formGroup][0][`control${index}`] = playersSee[0]['$'][control] === 'y';
	// 			});
	// 		} else if (formGroup === 'additionalConfig') {
	// 			appInterfaceConfig[formGroup][0].control0 = flash[0]['$'][controlMappings[formGroup]] === 'y';
	// 			appInterfaceConfig[formGroup][0].control1 = quickAdjust[0]['$'][controlMappings[formGroup]] === 'y';
	// 			appInterfaceConfig[formGroup][0].control2 = oppsVerification[0]['$'][controlMappings[formGroup]] === 'y';
	// 		} else {
	// 			appInterfaceConfig[formGroup] = playersSee[0]['$'][controlMappings[formGroup]] === 'y';
	// 		}
	// 	}

	// 	console.log('appInterface config: ', appInterfaceConfig);

	// 	return appInterfaceConfig;
	// }

	private checkValue(sectionName, controls, data) {
		const sectionValues = {};
		controls.forEach(control => {
			const controlName = control.name;
			if (controlName in data) {
				sectionValues[controlName] = data[controlName];
			} else {
				sectionValues[controlName] = null;
			}
		});
		return sectionValues;
	}
}
