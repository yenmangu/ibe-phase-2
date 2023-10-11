import { Injectable, OnDestroy } from '@angular/core';
import {
	BehaviorSubject,
	Subject,
	Subscription,
	takeUntil,
	Observable
} from 'rxjs';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { ProcessMatchDataService } from './process-match-data.service';
import { IndexedDatabaseService } from './indexed-database.service';
import { ApiDataCoordinationService } from './api/api-data-coordination.service';

@Injectable({
	providedIn: 'root'
})
export class HistoricGamesDatabaseService implements OnDestroy {
	matchTypeSubscription: Subscription;
	selectedMatchType: string = '';
	isDBInitialised = false;
	public dataLoadingSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	dataLoading$ = this.dataLoadingSubject.asObservable();
	private dataUpdated$ = new BehaviorSubject<any>(null);
	private dataSubject$ = new Subject<any>();
	fetchedData$: Observable<any> = this.dataSubject$.asObservable();
	public destroy$: Subject<void> = new Subject<void>();

	constructor(
		private sharedDataService: SharedDataService,
		private indexedDatabaseStatus: IndexedDatabaseStatusService,
		private processMatchDataService: ProcessMatchDataService,
		private apiData: ApiDataCoordinationService
	) {
		console.log('historic games & database service init');
		this.matchTypeSubscription = this.sharedDataService.selectedMatchType$
			.pipe(takeUntil(this.destroy$))
			.subscribe(data => {
				this.selectedMatchType = data;
			});
		this.indexedDatabaseStatus.isInitialised().subscribe(initialised => {
			this.isDBInitialised = initialised;
		});
	}

	async fetchHistoricData(objectStore: string): Promise<any> {
		try {
			const data = await this.processMatchDataService.getAllStoreData(objectStore);
			this.dataLoadingSubject.next(data);
			this.dataSubject$.next(data);
			return data;
		} catch (err) {
			this.dataLoadingSubject.next(err);
		}
	}

	async fetchMainData(objectStore, key): Promise<any> {
		try {
			const data = await this.processMatchDataService.getData(objectStore, key);
			if (data) {
				console.log(data, this.selectedMatchType, key, objectStore)
				const accessedProperty = data[`${objectStore}`];
				this.dataLoadingSubject.next(accessedProperty);

				// this.dataLoadingSubject.complete();
				console.log('accessed prop: ', accessedProperty);
				return accessedProperty;
			}
		} catch (err) {
			this.dataLoadingSubject.next(err);
		}
	}

	async updateByType(type: string, newData: any): Promise<any> {
		try {
			console.log('historic games db service data and type: ', newData, type);
			const success = await this.processMatchDataService.updateValue(newData);
			// console.log('new data from updateByType: ', JSON.stringify(newData, null, 2));
			this.apiData.invokeAPICoordination(undefined, newData.data);
			this.dataUpdated$.next(newData.data);
			if (success) {
				return success;
			}
		} catch (err) {
			throw err;
		}
	}

	async deleteRow(data: any): Promise<any> {
		try {
			console.log(
				'historic games db service - row: ',
				JSON.stringify(data, null, 2)
			);
			const result = await this.processMatchDataService.deleteByKey(data);
			if (result) {
				this.dataUpdated$.next(data);
			}
		} catch (err) {
			throw err;
		}
	}

	getDataUpdated$() {
		return this.dataUpdated$.asObservable();
	}

	finishLoadingStatus() {}

	async fetchPlayerDatabase(): Promise<any> {}

	ngOnDestroy(): void {
		if (this.matchTypeSubscription) {
			this.destroy$.next();
		}
	}
}
