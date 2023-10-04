import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { ProcessMatchDataService } from './process-match-data.service';

@Injectable({
	providedIn: 'root'
})
export class HistoricGamesDatabaseService implements OnDestroy {
	
	matchTypeSubscription: Subscription;
	selectedMatchType: string = '';
	isDBInitialised = false;
	public dataLoadingSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	dataLoading$ = this.dataLoadingSubject.asObservable();
	public destroy$: Subject<void> = new Subject<void>();

	constructor(
		private sharedDataService: SharedDataService,
		private indexedDatabaseStatus: IndexedDatabaseStatusService,
		private processMatchDataService: ProcessMatchDataService
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

		console.log('Selected match type: ', this.selectedMatchType);
	}

	async fetchMainData(objectStore, key): Promise<any> {
		try {
			const data = await this.processMatchDataService.getData(objectStore, key);
			if (data) {
				// console.log(data, this.selectedMatchType, key, objectStore)
				const accessedProperty = data[`${this.selectedMatchType}-${objectStore}`];
				this.dataLoadingSubject.next(accessedProperty);
				// this.dataLoadingSubject.complete();
				// console.log(accessedProperty)
				return accessedProperty;
			}
		} catch (err) {
			this.dataLoadingSubject.next(err);
		}
	}

	finishLoadingStatus() {}

	async fetchPlayerDatabase(): Promise<any> {}

	ngOnDestroy(): void {
		if (this.matchTypeSubscription) {
			this.destroy$.next();
		}
	}
}
