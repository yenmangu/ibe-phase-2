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
	private StoreMapping = {};
	private subscription: Subscription;
	public destroy$ = new Subject<void>();

	constructor(
		private indexedDB: IndexedDatabaseService,
		private sharedDataService: SharedDataService
	) {
		console.log('Data Service initialised');
		this.subscription = this.sharedDataService.selectedMatchType$
			.pipe(takeUntil(this.destroy$))
			.subscribe(async matchType => {
				this.matchType = matchType;
				console.log('data-service subscription: ', this.matchType);
				try {
					await this.initialiseDB();
				} catch (err) {
					console.error('Error', err);
				}
			});
	}

	async ngOnInit() {
		console.log('data service ngOnInit called');
	}

	public initialiseDB = async () => {
		console.log('matchType :', this.matchType);
		await this.indexedDB.initDatabase(`${this.matchType}-${this.dbName}`);
		console.log(
			`database with name of ${this.matchType}-${this.dbName} initialised`
		);
	};

	async newEntryPoint(data: any): Promise<boolean> {
		try {
			const storeMapping = this.mapData(data); // Map the data
			console.log('store mapping at entry point: ', storeMapping);

			return new Promise<boolean>(async (resolve, reject) => {
				try {
					const result = await this.indexedDB.initialiseWithGameData(
						storeMapping,
						this.dbName
					);
					resolve(result); // Resolve the outer Promise with the result
				} catch (error) {
					reject(error); // Reject the outer Promise if an error occurs
				}
			});
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
			playerdb,
			params,
			xmlsettings,
			slotname,
			hrevtxt,
			lock
		} = data;

		const storeMapping = {
			current_game_data: currentgamedata,
			historic_game_data: hist,
			hand_data: hands,
			handanxs_data: handanxs,
			player_db: playerdb,
			params: params,
			xml_settings: xmlsettings,
			slot_name: slotname,
			hrev_txt: hrevtxt,
			lock: lock
		};

		return storeMapping;
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
