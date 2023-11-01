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
	startWith
} from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { IconRegistryService } from 'src/app/shared/services/icon-registry.service';
import { UserDetailsComponent } from 'src/app/shared/header/user-details/user-details.component';
// Dev
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { CurrentEventService } from '../games/services/current-event.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
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
	isOpen: boolean = false
	gameCode: string = ''
	email: string = ''
	//
	// Dev - used to update match type across the app
	matchTypeControl: FormControl;
	selectedMatchType$: any = '';
	currentBreakpoint;
	// End dev
	//
	constructor(
		private _sidenavService: SidenavService,
		private _iconRegistry: IconRegistryService,
		private _matIconRegistry: MatIconRegistry,
		private breakpointService: BreakpointService,
		private userDetailsService: UserDetailsService,

		// dev
		private fb: FormBuilder,
		private sharedDataService: SharedDataService,
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
		this.subscription = this.isOpen$.subscribe((isOpen: boolean) => {
			this.isOpen = isOpen
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
		this.breakpointService.currentBreakpoint$.subscribe(breakpoint => {
			this.currentBreakpoint = breakpoint;
			if (this.currentBreakpoint === 'handset' && this.isOpen) {
				this._sidenavService.toggle()
			}
		});
		this.userDetailsService.email$.subscribe(email=> this.email = email)
		this.userDetailsService.gameCode$.subscribe(gamecode => this.gameCode = gamecode)

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
