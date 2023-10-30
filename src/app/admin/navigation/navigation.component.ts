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
// Dev
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { CurrentEventService } from '../games/services/current-event.service';
import { FormBuilder, FormControl } from '@angular/forms';
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
