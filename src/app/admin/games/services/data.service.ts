import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { IndexedDatabaseService } from './indexed-database.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Subject, Subscription, firstValueFrom, takeUntil } from 'rxjs';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';

@Injectable({
	providedIn: 'root'
})
export class DataService implements OnInit, OnDestroy {
	private dbName = 'ibe_game_data';
	matchType: string = '';
	private storeMapping = {};
	private subscription: Subscription;
	public destroy$ = new Subject<void>();

	constructor(
		private indexedDB: IndexedDatabaseService,
		private sharedDataService: SharedDataService,
		private IDBStatusService: IndexedDatabaseStatusService
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
				console.log('database exists in dev mode... no need to refresh');

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
		// console.log('matchType :', this.matchType);
		const storeMapping = this.mapData(data);
		this.storeMapping = storeMapping;
		// console.log('initialiseDB storeMapping: ', storeMapping);
		await this.indexedDB.initDatabase(
			storeMapping,
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
			const storeMapping = this.mapData(data); // Map the data
			// console.log('storeData storeMapping ', storeMapping);

			const result = await this.indexedDB.initialiseWithGameData(
				storeMapping,
				this.dbName
			);
			this.IDBStatusService.dataFinishedLoadingSubject.next(true);
			this.saveStoreNames(storeMapping, playerDbStoreMapping);

			return result;
		} catch (err) {
			console.error('Error in NewEntryPoint', err);
			throw err;
		}
	}


	private mapData(data) {
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
		console.log('lock: ', storeMapping.lock);
		// console.log('store mapping complete');

		return storeMapping;
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

	deleteIndexedDBDatabase(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const deleteRequest = indexedDB.deleteDatabase(`${this.dbName}`);

			deleteRequest.onsuccess = () => {
				console.log(`IndexedDB database '${this.dbName}' deleted successfully`);
				resolve();
			};

			deleteRequest.onerror = () => {
				console.error(`Error deleting IndexedDB database '${this.dbName}'`);
				reject(new Error(`Failed to delete IndexedDB database '${this.dbName}'`));
			};
		});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
