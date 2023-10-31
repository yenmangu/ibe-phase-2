import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedDataService } from '../shared/services/shared-data.service';
import { UserDetailsService } from '../shared/services/user-details.service';
import { AuthService } from '../auth/services/auth.service';
import {
	Observable,
	Subject,
	Subscription,
	catchError,
	combineLatest,
	of,
	switchMap,
	take,
	takeUntil
} from 'rxjs';
import { tag } from 'rxjs-spy/cjs/operators';
import { IndexedDatabaseStatusService } from '../shared/services/indexed-database-status.service';
import { DataService } from './games/services/data.service';
import { CurrentEventService } from './games/services/current-event.service';
import { SharedGameDataService } from './games/services/shared-game-data.service';
import { Store } from '@ngrx/store';
import { loadAdminData } from '../admin-state/admin.actions';
@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
	gameCode: string = '';
	dirKey: string = '';
	dirKeySubscription = new Subscription();
	gameCodeSubscription = new Subscription();
	gameCode$: Observable<string>;
	directorKey$: Observable<string>;
	private destroy$ = new Subject<void>();
	loadingStatus: number = 0;

	constructor(
		private store: Store,
		private sharedDataService: SharedDataService,
		public authService: AuthService,
		private userDetailsService: UserDetailsService,
		private IDBStatus: IndexedDatabaseStatusService,
		private dataService: DataService,
		private currentEventService: CurrentEventService,
		private sharedGameData: SharedGameDataService
	) {
		// console.log('admin loaded');
	}
	ngOnInit(): void {
		console.log('admin init');
		this.gameCode$ = this.userDetailsService.gameCode$;
		this.directorKey$ = this.userDetailsService.directorKey$;
		this.gameCodeSubscription = this.gameCode$.pipe(take(1)).subscribe(gameCode => {
			console.log('Game Code: ', gameCode);
		});

		this.dirKeySubscription = this.directorKey$.pipe(take(1)).subscribe(dirKey => {
			console.log('Dir Key: ', dirKey);
		});

		this.subscribeToUserDetails();

		this.IDBStatus.resetProgress();

		this.IDBStatus.dataProgress$.subscribe(status => {
			this.loadingStatus = 5 + status * 0.95;
		});

		this.sharedGameData.triggerRefreshObservable
			.pipe(
				tag('refresh_db'),
				switchMap(data => {
					this.IDBStatus.resetProgress();

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

	private subscribeToUserDetails(): void {
		combineLatest([
			this.userDetailsService.gameCode$,
			this.userDetailsService.directorKey$
		])
			.pipe(
				takeUntil(this.destroy$),
				switchMap(([gamecode, dirkey]) => {
					if (gamecode && dirkey) {
						this.gameCode = gamecode;
						this.dirKey = dirkey;
						// const exists = this.checkDBExists

						return this.fetchData(this.gameCode, this.dirKey);
					} else {
						console.error('no gamecode or dirkey');
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
			.subscribe();
	}

	async checkDBExists(data) {
		try {
			const exists = await this.dataService.checkDatabase(data);
			const dev_exists = await this.dataService.dev_checkDatabase();
			if (dev_exists) {
				return exists;
			}
		} catch (error) {
			console.error('error checking database');
		}
	}

	fetchData(gameCode: string, dirKey: string): Observable<any> {
		return this.currentEventService.getLiveData(gameCode, dirKey).pipe(
			catchError(error => {
				console.error('error calling current event service', error);
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
				await this.storeInitialData(data);
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

	ngOnDestroy(): void {
		this.gameCodeSubscription.unsubscribe();
		this.dirKeySubscription.unsubscribe();
	}
}
