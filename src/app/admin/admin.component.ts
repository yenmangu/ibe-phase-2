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
	filter,
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
import { NavigationEnd, Router } from '@angular/router';
import { AdminToolsService } from '../shared/services/admin-tools.service';
import { NavigationService } from './navigation/navigation.service';

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
	loadingStatus: number = 0;

	superAdmin: boolean;
	currentLabel: string;
	private destroy$ = new Subject<void>();
	constructor(
		private sharedDataService: SharedDataService,
		public authService: AuthService,
		private userDetailsService: UserDetailsService,
		private IDBStatus: IndexedDatabaseStatusService,
		private dataService: DataService,
		private currentEventService: CurrentEventService,
		private sharedGameData: SharedGameDataService,
		private router: Router,
		private adminToolsService: AdminToolsService,
		private navigationService: NavigationService
	) {
		// console.log('admin loaded');
	}
	ngOnInit(): void {
		this.userDetailsService.gameCode$.subscribe(gc => {
			this.gameCode = gc;
		});
		this.userDetailsService.directorKey$.subscribe(dk => {
			this.dirKey = dk;
		});
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirKey = localStorage.getItem('DIR_KEY');

		this.navigationService.setLoaded(true);
		this.setMenuLabel();
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => {
				this.setMenuLabel();
			});
		if (this.router.url === '/admin/games') {
			this.setMenuLabel();
		}

		this.adminToolsService.verifyAdmin(this.gameCode).subscribe(response => {
			if (response.authStatus === true) {
				this.superAdmin = true;
			} else if (response.authStatus === false) {
				this.superAdmin = false;
			} else {
				console.error('Error in verifying admin, ', response);
			}
		});

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
				console.log('Database doesnt exist, creating database...');

				const dbData = await this.dataService.initialiseDB(data);
				const returnValue = { ...dbData, data: data };

				await this.storeInitialData(returnValue);
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

	setMenuLabel() {
		let route = this.router.routerState.root;
		while (route.firstChild) {
			route = route.firstChild;
		}
		const currentLabel = route.snapshot.data?.menuLabel || '';
		this.currentLabel = currentLabel;
		this.navigationService.setSelected(currentLabel);
	}

	ngOnDestroy(): void {
		this.gameCodeSubscription.unsubscribe();
		this.dirKeySubscription.unsubscribe();
	}
}
