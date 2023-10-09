import {
	Component,
	ViewChild,
	OnDestroy,
	AfterViewInit,
	OnInit,
	AfterContentInit
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import {
	BehaviorSubject,
	Observable,
	Subscription,
	catchError,
	distinctUntilChanged,
	startWith,
	tap,
	map,
	of,
	switchMap
} from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { IconRegistryService } from 'src/app/shared/services/icon-registry.service';
// Dev
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { CurrentEventService } from '../games/services/current-event.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CheckSessionService } from 'src/app/auth/services/check-session.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { ProcessCurrentMatchService } from '../games/services/process-current-match.service';
import { DataService } from '../games/services/data.service';
import { SharedGameDataService } from '../games/services/shared-game-data.service';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent
	implements OnInit, AfterViewInit, AfterContentInit, OnDestroy
{
	@ViewChild(MatDrawer) drawer: MatDrawer;
	isOpen$ = this._sidenavService.isOpen$;
	private subscription: Subscription;
	contentClass: string = 'shrink';
	private sessionStatusSubject = new BehaviorSubject<boolean>(false);

	sessionStatus$: Observable<boolean> = this.sessionStatusSubject.asObservable();

	//
	// Dev - used to update match type across the app
	matchTypeControl: FormControl;
	selectedMatchType$: any = '';

	// End dev
	//
	constructor(
		private _sidenavService: SidenavService,
		private _iconRegistry: IconRegistryService,
		private _matIconRegistry: MatIconRegistry,

		// dev
		private fb: FormBuilder,
		private sharedDataService: SharedDataService,
		private currentEventService: CurrentEventService,
		private authService: AuthService,
		private checkSessionService: CheckSessionService,
		private httpService: HttpService,
		private processCurrentMatchService: ProcessCurrentMatchService,
		private dataService: DataService,
		private sharedGameDataService: SharedGameDataService
	) {
		this.matchTypeControl = this.fb.control('pairs'); // default value
		// this.selectedMatchType$ = this.matchTypeControl.valueChanges.pipe(
		// 	startWith(this.matchTypeControl.value),
		// 	distinctUntilChanged()
		// );
		// // subscription
		// this.selectedMatchType$.subscribe(value => {
		// 	this.sharedDataService.updateMatchType(value);
		// });
	}

	async ngOnInit(): Promise<void> {
		this.subscription = this.isOpen$.subscribe((isOpen: boolean) => {
			if (this.drawer) {
				if (isOpen) {
					this.drawer.open();
					this.contentClass = 'shrink';
				} else {
					this.drawer.close();
					this.contentClass = 'full';
				}
			}
		});
		// this.checkSessionStatus();
	}

	// this.responseDataSubscription = this.authService.responseJSON$
	// 	.pipe(
	// 		tap(data => {
	// 			console.log('navigation-response: ', data);
	// 		})
	// 	)
	// 	.subscribe();



	// private fetchInitialData() {
	// 	const gamecode = localStorage.getItem('GAMECODE');
	// 	const dir_key = localStorage.getItem('DIR_KEY');

	// 	this.httpService
	// 		.fetchData(gamecode, dir_key)
	// 		.pipe(
	// 			tap(data => {
	// 				if (data) {
	// 					console.log('There is data here: ', data);
	// 					const matchType = this.processCurrentMatchService.getMatchType(data);
	// 					console.log(
	// 						'New current match type as determined from live data: ',
	// 						matchType
	// 					);
	// 					this.sharedDataService.updateMatchType(matchType);
	// 					this.processData(data);
	// 				}
	// 			})
	// 		)
	// 		.subscribe();
	// }

	private async processData(data) {
		console.log('processData() called with data: ', data);
		await this.dataService.initialiseDB(data);
		await this.storeInitialData(data);
	}
	async storeInitialData(data) {
		try {
			if (!data) {
				throw new Error('Error calling server');
			}
			const dbResponse = await this.dataService.storeData(data);
			if (!dbResponse) {
				throw new Error('Error calling data service');
			}
			this.sharedGameDataService.setLoadingStatus(false);
		} catch (err) {
			console.error('Error performing high level requestAndStore(): ', err);
		}
	}
	ngAfterViewInit(): void {
		// console.log('navigation loaded');
		// this.getMatchData(this.matchTypeControl.value);
	}

	ngAfterContentInit(): void {
		// this.selectedMatchType$.subscribe({
		// })
	}

	toggleSidenav(): void {
		this.drawer.toggle();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	private getMatchData(type): Observable<any> {
		return this.currentEventService.getAndDecompressData(type);
	}
}
