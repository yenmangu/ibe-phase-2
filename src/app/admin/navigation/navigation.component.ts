import { Component, ViewChild, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { Subscription } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { IconRegistryService } from 'src/app/shared/services/icon-registry.service';
@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(MatDrawer) drawer: MatDrawer;
	isOpen$ = this._sidenavService.isOpen$;
	private subscription: Subscription;
	contentClass: string = 'shrink' 

	constructor(
		private _sidenavService: SidenavService,
		private _iconRegistry: IconRegistryService,
		private _matIconRegistry: MatIconRegistry
	) {}

	ngOnInit(): void {

		this.subscription = this.isOpen$.subscribe((isOpen: boolean) => {
			if (this.drawer) {
				if (isOpen) {
					this.drawer.open();
					this.contentClass = 'shrink'
				} else {
					this.drawer.close();
					this.contentClass = 'full'
				}
			}
		});
	}

	ngAfterViewInit(): void {
		// console.log('navigation loaded');
	}

	toggleSidenav(): void {
		this.drawer.toggle();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
