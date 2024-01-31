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
	Observable,
	Subscription,
	catchError,
	distinctUntilChanged,
	startWith,
	filter,
	map,
	mergeMap
} from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { IconRegistryService } from 'src/app/shared/services/icon-registry.service';
import { UserDetailsComponent } from 'src/app/shared/header/user-details/user-details.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
// Dev
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { CurrentEventService } from '../games/services/current-event.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { NavigationService } from './navigation.service';
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
	private subscription: Subscription = new Subscription();
	contentClass: string = 'shrink';
	isOpen: boolean = false;
	gameCode: string = '';
	email: string = '';
	//
	// Dev - used to update match type across the app
	matchTypeControl: FormControl;
	selectedMatchType$: any = '';
	currentBreakpoint;
	currentLabel: string = '';
	private readonly STORAGE_KEY = 'menuLabel';
	// End dev
	//
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private _sidenavService: SidenavService,
		private _iconRegistry: IconRegistryService,
		private _matIconRegistry: MatIconRegistry,
		private breakpointService: BreakpointService,
		private userDetailsService: UserDetailsService,
		private navigationService: NavigationService,
		private sharedDataService: SharedDataService,

		// dev
		private fb: FormBuilder,
		private currentEventService: CurrentEventService
	) {
		this.matchTypeControl = this.fb.control('pairs'); // default value
		this.selectedMatchType$ = this.matchTypeControl.valueChanges.pipe(
			startWith(this.matchTypeControl.value),
			distinctUntilChanged()
		);
		// subscription
		this.selectedMatchType$.subscribe(value => {
			this.sharedDataService.updateMatchType(value);
		});
	}

	ngOnInit(): void {
		console.log('\n\nNAVIGATION COMPONENT\n\n');
		this.setMenuLabel();
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => {
				this.setMenuLabel();
			});
		if (this.router.url === '/admin/games') {
			this.setMenuLabel();
		}
		this.breakpointService.currentBreakpoint$.subscribe(breakpoint => {
			this.currentBreakpoint = breakpoint;
			if (this.currentBreakpoint === 'handset' && this.isOpen) {
				this._sidenavService.toggle();
			}
		});
		this.userDetailsService.email$.subscribe(email => (this.email = email));
		this.userDetailsService.gameCode$.subscribe(
			gamecode => (this.gameCode = gamecode)
		);
	}

	ngAfterViewInit(): void {
		// console.log('navigation loaded');
		// this.getMatchData(this.matchTypeControl.value);
		if (this.drawer) {
			this.drawer.openedChange.subscribe(state => {
				console.log(`current drawer state: ${state}`);
				this._sidenavService.isOpenSubject.next(state);
			});
			this._sidenavService.isOpen$.subscribe((isOpen: boolean) => {
				if (this.drawer) {
					if (isOpen) {
						this.drawer.open();
					} else {
						this.drawer.close();
					}
				}
			});
		}
	}

	ngAfterContentInit(): void {
		// this.selectedMatchType$.subscribe({
		// })
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

	handleLinkClick(selected: string) {
		this.navigationService.setSelected(selected);
	}

	toggleSidenav(): void {
		this.drawer.toggle();
	}

	handleLogout(): void {
		this.sharedDataService.logoutSubject.next(true);
	}

	private getMatchData(type): Observable<any> {
		return this.currentEventService.getAndDecompressData(type);
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
