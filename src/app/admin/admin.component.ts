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
	from,
	of,
	switchMap,
	take,
	takeUntil,
	tap
} from 'rxjs';
import { tag } from 'rxjs-spy/cjs/operators';
import { IndexedDatabaseStatusService } from '../shared/services/indexed-database-status.service';
import { DataService } from './games/services/data.service';
import { CurrentEventService } from './games/services/current-event.service';
import { SharedGameDataService } from './games/services/shared-game-data.service';
import { Router } from '@angular/router';

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
		private sharedDataService: SharedDataService,
		public authService: AuthService,
		private userDetailsService: UserDetailsService,
		private IDBStatus: IndexedDatabaseStatusService,
		private dataService: DataService,
		private currentEventService: CurrentEventService,
		private sharedGameData: SharedGameDataService,
		private router: Router
	) {
		// console.log('admin loaded');
	}
	ngOnInit(): void {
		this.gameCode$ = this.userDetailsService.gameCode$;
		this.directorKey$ = this.userDetailsService.directorKey$;
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirKey = localStorage.getItem('DIR_KEY');

		// this.gameCodeSubscription = this.gameCode$.pipe(take(1)).subscribe(gameCode => {
		// 	// console.log('Game Code: ', gameCode);
		// });

		// this.dirKeySubscription = this.directorKey$.pipe(take(1)).subscribe(dirKey => {
		// 	// console.log('Dir Key: ', dirKey);
		// });

		this.subscribeToUserDetails();

		this.IDBStatus.resetProgress();

		this.IDBStatus.dataProgress$.subscribe(status => {
			this.loadingStatus = status;
		});

		this.sharedGameData.triggerRefreshObservable
			.pipe(
				// tag('triggerRefreshObservable'),
				tap(() => {
					console.log('before deleting database');
					this.dataService.requestDeleteDB();
				}),
				tap(() => {
					location.reload();
				}),
				switchMap(() => {
					// this.IDBStatus.resetProgress();

					console.log('after deleting database');
					console.log('credentials: ', this.gameCode, this.dirKey);
					const gameCode = localStorage.getItem('GAME_CODE');
					const dirKey = localStorage.getItem('DIR_KEY');

					return from(this.fetchData(gameCode, dirKey));
				}),
				switchMap(data => {
					return from(this.processData(data));
				}),
				tap(() => {
					this.refreshComponent();
				})
			)
			.subscribe();
		// .subscribe(data => {
		// 	from(this.dataService.initialiseDB(data))
		// 		.pipe(switchMap(() => from(this.storeInitialData(data))))
		// 		.subscribe({
		// 			next: () => {},
		// 			error: error => {
		// 				console.error('error in observable pipeline: ', error);
		// 			}
		// 		});
		// });
	}

	private refreshComponent(): void {
		const currentUrl = this.router.url;
		this.router.navigate([currentUrl]);
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
						// console.log(
						// 	'checking game code and dirkey: ',
						// 	this.gameCode,
						// 	this.dirKey
						// );

						return this.fetchData(this.gameCode, this.dirKey);
					} else {
						console.error('no gamecode or dirkey');
						return of('EMPTY');
					}
				}),
				switchMap(data => {
					if (data !== 'EMPTY') {
						// console.log('\ninitial fetched data: ', data);
						const remoteServerDbRevision = data.currentDBRevision.toString();
						this.sharedGameData.databaseRevisionSubject.next(
							remoteServerDbRevision
						);

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
		// console.log('fetch data called with: ', gameCode, dirKey);

		return this.currentEventService.getLiveData(gameCode, dirKey).pipe(
			catchError(error => {
				console.error('error calling current event service', error);
				return of(null);
			})
		);
	}
	private async processData(data): Promise<void> {
		// console.log('processData() called with data: ', data);
		try {
			const dbExists = await this.dataService.checkDatabase(data);
			if (dbExists) {
				// console.log('db exists');
				return;
			} else {
				await this.dataService.initialiseDB(data);
				await this.storeInitialData(data);
			}
			// console.log('Store initial data complete');
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
