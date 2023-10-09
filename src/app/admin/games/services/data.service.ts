import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { IndexedDatabaseService } from './indexed-database.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Subject, Subscription, firstValueFrom, takeUntil } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataService implements OnInit, OnDestroy {
	private dbName = 'ibe_game_data';
	matchType: string = '';
	private storeMapping = {};
	private playerDbStoreMapping = {};
	private subscription: Subscription;
	public destroy$ = new Subject<void>();
	playersArray = [];
	teamsArray = [];
	venuesArray = [];
	eventArray = [];
	constructor(
		private indexedDB: IndexedDatabaseService,
		private sharedDataService: SharedDataService
	) {
		// console.log('Data Service initialised');
		this.subscription = this.sharedDataService.selectedMatchType$.subscribe(
			matchType => {
				this.matchType = matchType;
				// console.log('data-service subscription: ', this.matchType);
			}
		);
	}

	async ngOnInit() {
		console.log('data service ngOnInit called');
	}

	public initialiseDB = async data => {
		// console.log('accessing playerdb array test: ', data.playerdb.root[0].item);
		// console.log('matchType :', this.matchType);
		const storeMapping = this.mapData(data);
		const playerDbStoreMapping = this.getPlayerDbStoreMapping(data);
		this.storeMapping = storeMapping;
		this.playerDbStoreMapping = playerDbStoreMapping;
		// console.log('initialiseDB storeMapping: ', storeMapping);
		await this.indexedDB.initDatabase(
			storeMapping,
			playerDbStoreMapping,
			`${this.matchType}-${this.dbName}`
		);
		console.log(
			`database with name of ${this.matchType}-${this.dbName} initialised`
		);
	};

	async doesDbExist() {
		try {
			const exists = await this.indexedDB.doesDatabaseExist(
				`${this.matchType}-${this.dbName}`
			);
			return exists;
		} catch (err) {
			console.error('Error checking db', err);
			return false;
		}
	}

	async storeData(data: any): Promise<boolean> {
		try {
			const playerDbStoreMapping = this.getPlayerDbStoreMapping(data);
			const storeMapping = this.mapData(data); // Map the data
			// console.log('storeData storeMapping ', storeMapping);

			const result = await this.indexedDB.initialiseWithGameData(
				storeMapping,
				playerDbStoreMapping,
				this.dbName
			);
			return result;
		} catch (err) {
			console.error('Error in NewEntryPoint', err);
			throw err;
		}
	}

	private getPlayerDbStoreMapping(data: any): any {
		if (data && data.playerdb.root[0].item) {
			console.log('process player db data being called');
			const dataArray: any[] = data.playerdb.root[0].item;
			const temp_playersArray = [];
			const temp_teamsArray = [];
			const temp_venuesArray = [];
			const temp_eventArray = [];

			dataArray.forEach((item: any) => {
				if (item.$.type) {
					switch (item.$.type) {
						case 'player':
							temp_playersArray.push(item);
							break;
						case 'team':
							temp_teamsArray.push(item);
							break;
						case 'loc':
							temp_venuesArray.push(item);
							break;
						case 'event':
							temp_eventArray.push(item);
							break;
					}
				}
			});
			const playerDbMapping = {
				[`${this.matchType}-player`]: temp_playersArray,
				[`${this.matchType}-team`]: temp_teamsArray,
				[`${this.matchType}-event`]: temp_eventArray,
				[`${this.matchType}-loc`]: temp_venuesArray
			};

			return playerDbMapping;
		}
	}

	private mapData(data) {
		// const playerdbObject = this.processData(data);
		// console.log('initial player object: ', playerdbObject);
		const {
			currentgamedata,
			hist,
			hands,
			handanxs,
			playerdb,
			params,
			xmlsettings,
			slotname,
			hrevtxt,
			lock
		} = data;

		const storeMapping = {
			[`${this.matchType}-current_game_data`]: currentgamedata,
			[`${this.matchType}-historic_game_data`]: hist,
			[`${this.matchType}-hand_data`]: hands,
			[`${this.matchType}-handanxs_data`]: handanxs,
			[`${this.matchType}-player_db`]: playerdb,
			[`${this.matchType}-params`]: params,
			[`${this.matchType}-xml_settings`]: xmlsettings,
			[`${this.matchType}slot_name`]: slotname,
			[`${this.matchType}-hrev_txt`]: hrevtxt,
			[`${this.matchType}-lock`]: lock
		};

		return storeMapping;
	}

	getData(key) {}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
