import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

import {
	Subject,
	Subscription,
	combineLatest,
	takeUntil,
	switchMap,
	pipe,
	tap,
	of,
	Observable,
	catchError
} from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { CurrentEventService } from './services/current-event.service';
import { DataService } from './services/data.service';
import { SharedGameDataService } from './services/shared-game-data.service';
import { FetchCurrentDataService } from './services/fetch-current-data.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { tag } from 'rxjs-spy/cjs/operators';
import { ProcessCurrentDataService } from './services/process-current-data.service';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit, OnDestroy {
	gameCodeSubscription = new Subscription();
	dirKeySubscription = new Subscription();

	gameCode: string;
	dirKey: string;
	dbInit: boolean = false;
	progress = 0;
	private progressSubscription: Subscription;

	private destroy$ = new Subject<void>();

	constructor(
		private sharedDataService: SharedDataService,
		private currentEventService: CurrentEventService,
		private dataService: DataService,
		private processCurrentData: ProcessCurrentDataService,
		private sharedGameData: SharedGameDataService,
		private userDetailsService: UserDetailsService,
		private IDBStatusService: IndexedDatabaseStatusService
	) {}

	ngOnInit(): void {
		console.log('games component init');

		this.subscribeToGameCodeAndDirKey();

		this.IDBStatusService.isInitialised$.pipe(tag('db-init')).subscribe(isInit => {
			this.dbInit = isInit;
		});
		this.progressSubscription = this.IDBStatusService.dataProgress$
			.pipe(tag('db-progress'))
			.subscribe(value => {
				console.log('db progress: ', this.progress);
				this.progress = value;
			});
	}

	private subscribeToGameCodeAndDirKey(): void {
		console.log('subscribe to gamecode and dirkey');

		combineLatest([
			this.userDetailsService.gameCode$,
			this.userDetailsService.directorKey$
		])
			.pipe(
				takeUntil(this.destroy$),
				switchMap(([gameCode, dirKey]) => {
					// Check if both gameCode and dirKey are populated
					if (gameCode && dirKey) {
						console.log('game code and dir key: ', gameCode, dirKey);
						this.gameCode = gameCode;
						this.dirKey = dirKey;
						return this.fetchData(gameCode, dirKey);
					} else {
						console.log('no gamecode or dirkey');

						console.error('no gamecode or dirkey provided');
						return of('EMPTY');
					}
				}),
				switchMap(data => {
					if (data !== 'EMPTY') {
						return this.processData(data);
					} else {
						return of(null);
					}
				})
			)
			.subscribe({
				next: value => {},
				error: err => {}
			});

		this.sharedGameData.triggerRefreshObservable
			.pipe(
				tag('refresh_db'),
				switchMap(data => {
					this.IDBStatusService.resetProgress();

					console.log('database progress: ', this.progress);
					return this.fetchData(this.gameCode, this.dirKey);
				}),
				switchMap(data => {
					console.log('data from refresh: ', data);
					if (data !== 'EMPTY') {
						return this.processData(data);
					} else {
						return of(null);
					}
				})
			)
			.subscribe();
	}
	private callCurrentEventService(gameCode: string, dirKey: string) {
		// Make the data fetch here using gameCode and dirKey
		// Example:
		return this.currentEventService.getLiveData(gameCode, dirKey);
	}

	private fetchData(gameCode: string, dirKey: string): Observable<any> {
		return this.currentEventService.getLiveData(gameCode, dirKey).pipe(
			catchError(error => {
				console.error('error calling current event service: ', error);
				return of(null);
			})
		);
	}

	private async processData(data) {
		console.log('processData() called with data: ', data);
		try {
			const dbExists = await this.dataService.checkDatabase(data);
			if (dbExists) {
				console.log('db exists');
				return;
			} else {
				await this.dataService.initialiseDB(data);
				await this.storeInitialData(data);
			}
			console.log('Store initial data complete');
		} catch (err) {
			console.error('Error during data processing: ', err);
		}
	}

	async storeInitialData(data) {
		return new Promise<void>(async (resolve, reject) => {
			try {
				if (!data) {
					throw new Error('Error calling server');
				}
				const dbResponse = await this.dataService.storeData(data);
				if (!dbResponse) {
					throw new Error('Error calling data service');
				}
				this.sharedGameData.setLoadingStatus(false);
				resolve();
			} catch (err) {
				reject(`Error performing high level requestAndStore(): ${err}`);
			}
		});
	}

	onTabChange(event: MatTabChangeEvent): void {
		const selectedTabIndex = event.index;
		const selectedTabLabel = event.tab.textLabel;
		this.sharedDataService.updateTabChange(selectedTabIndex);

		// Now you have the index and label of the selected tab
		console.log(`Selected Tab Index: ${selectedTabIndex}`);
		console.log(`Selected Tab Label: ${selectedTabLabel}`);

		// You can use these values as needed in your component logic
	}
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		if (this.progressSubscription) {
			this.progressSubscription.unsubscribe();
		}
	}
}
