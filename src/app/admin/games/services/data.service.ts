import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { IndexedDatabaseService } from './indexed-database.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Observable, Subject, Subscription, firstValueFrom, takeUntil } from 'rxjs';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { SharedGameDataService } from './shared-game-data.service';
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
		private sharedDataService: SharedDataService,
		private IDBStatusService: IndexedDatabaseStatusService,
		private sharedGameData: SharedGameDataService
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

	public async dev_checkDatabase(): Promise<any> {
		try {
			const newExpected = [
				'current_game_data',
				'event',
				'hand_data',
				'handanxs_data',
				'historic_game_data',
				'hrev_text',
				'loc',
				'lock',
				'meta',
				'params',
				'player',
				'team',
				'xml_settings'
			];

			const exists = await this.indexedDB.doesDatabaseExist(
				this.dbName,
				newExpected
			);

			if (exists) {
				// console.log('database exists in dev mode... no need to refresh');

				this.IDBStatusService.bypassProgress();

				return true;
			}
			return false;
		} catch (error) {
			throw new Error('error checking db');
		}
	}
	public async checkDatabase(data): Promise<any> {
		try {
			const storeMapping = this.mapData(data);
			const playerDbStoreMapping = this.getPlayerDbStoreMapping(data);

			const expectedNames = [
				...Object.keys(storeMapping),
				...Object.keys(playerDbStoreMapping)
			];

			const newExpected = [
				'current_game_data',
				'event',
				'hand_data',
				'handanxs_data',
				'historic_game_data',
				'hrev_text',
				'loc',
				'lock',
				'meta',
				'params',
				'player',
				'team',
				'xml_settings'
			];

			const exists = await this.indexedDB.doesDatabaseExist(
				this.dbName,
				expectedNames
			);

			if (exists) {
				console.log('database exists in dev mode... no need to refresh');

				this.IDBStatusService.bypassProgress();

				return true;
			}
			return false;
		} catch (error) {
			throw new Error('error checking db');
		}
	}

	public initialiseDB = async data => {
		return new Promise<void>(async (resolve, reject) => {
			try {
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
					`${this.dbName}`
				);
				// console.log(`database with name of ${this.dbName} initialised`);

				resolve();
			} catch (err) {
				reject(err);
			}
		});
	};

	private calculateTotalStores(data: any): number {
		const playerDbStoreMapping = this.getPlayerDbStoreMapping(data);
		const storeMapping = this.mapData(data);
		const playerDBStoreCount = Object.keys(playerDbStoreMapping).length;
		const storeCount = Object.keys(storeMapping).length;
		return playerDBStoreCount + storeCount;
	}

	async storeData(data: any): Promise<boolean> {
		try {
			const totalStores = this.calculateTotalStores(data);
			const playerDbStoreMapping = this.getPlayerDbStoreMapping(data);
			const storeMapping = this.mapData(data);

			this.IDBStatusService.setProgress(totalStores, 0);
			// console.log('total stores to process: ', totalStores);

			const result = await this.indexedDB.initialiseWithGameData(
				storeMapping,
				playerDbStoreMapping,
				this.dbName,
				totalStores
			);
			this.IDBStatusService.dataFinishedLoadingSubject.next(true);
			this.saveStoreNames(storeMapping, playerDbStoreMapping);

			return result;
		} catch (err) {
			// console.error('Error in NewEntryPoint', err);
			throw err;
		}
	}

	private getPlayerDbStoreMapping(data: any): any {
		if (data && data.playerdb.root[0].item) {
			// console.log('storing player db data');
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
				[`player`]: temp_playersArray,
				[`team`]: temp_teamsArray,
				[`event`]: temp_eventArray,
				[`loc`]: temp_venuesArray
			};
			console.log('playerDB Store mapping complete');

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
			// playerdb,
			params,
			xmlsettings,
			hrevtxt,
			lock
		} = data;

		const storeMapping = {
			[`current_game_data`]: currentgamedata,
			[`historic_game_data`]: hist,
			[`hand_data`]: hands,
			[`handanxs_data`]: handanxs,
			// [`player_db`]: playerdb,
			[`params`]: params,
			[`xml_settings`]: xmlsettings,
			[`hrev_txt`]: hrevtxt,
			[`lock`]: lock
		};

		// console.log('logging hand and hrev');
		// console.log('hand: ', storeMapping.hand_data);
		// console.log('hrev: ', storeMapping.hrev_txt);
		// console.log('lock: ', storeMapping.lock);
		// console.log('store mapping complete');

		return storeMapping;
	}

	public async getSingleStore(storeName): Promise<any> {
		try {
			if (!storeName) {
				throw new Error('No Store Name');
			}
			const data = await this.indexedDB.getAllDataFromStore(storeName);
			if (!data) {
				throw new Error('No data in store');
			}
			console.log('data from store: ', data);
			return data;
		} catch (error) {
			console.error('error fetching single store');
		}
	}

	saveStoreNames(
		storeMapping: Record<string, any>,
		playerDbStoreMapping: Record<string, any>
	): void {
		const stores = Object.keys(storeMapping);
		const playerStores = Object.keys(playerDbStoreMapping);
		const combined = stores.concat(playerStores);
		localStorage.setItem('STORE_NAMES', JSON.stringify(combined));
	}

	updateSingle(updateData, storeName, key) {
		return new Promise((resolve, reject) => {
			this.indexedDB
				.update(storeName, key, updateData)
				.then(() => {
					resolve(true);
				})
				.catch(error => {
					console.error('error updating database: ', error);
					reject(error);
				});
		});
	}

	requestDeleteDB(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.indexedDB
				.deleteIndexedDBDatabase(this.dbName)
				.then(() => {
					console.log('database deleted, updating observable');
					this.sharedGameData.databaseDeleted$.next(true);
					resolve();
				})
				.catch(error => {
					console.error('Error deleting database: ', error);
					reject(error);
				});
		});
	}

	deleteIndexedDBDatabase(): Promise<void> {
		console.log('delete indexed db called');

		return new Promise<void>((resolve, reject) => {
			console.log('delete indexed db promise created');

			const deleteRequest = indexedDB.deleteDatabase(`${this.dbName}`);
			if (deleteRequest) {
				console.log('delete request: ');

				deleteRequest.onsuccess = () => {
					console.log(`IndexedDB database '${this.dbName}' deleted successfully`);
					resolve();
				};

				deleteRequest.onerror = () => {
					console.error(`Error deleting IndexedDB database '${this.dbName}'`);
					reject(new Error(`Failed to delete IndexedDB database '${this.dbName}'`));
				};
			}
		});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
