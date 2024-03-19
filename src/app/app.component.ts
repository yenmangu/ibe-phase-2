import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointService } from './shared/services/breakpoint.service';
import { DrawerService } from './shared/services/drawer.service';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'ibescore_2';
	currentBreakpoint: string = '';
	isDrawerOpen = false;
	private drawerSubscription: Subscription;
	constructor(
		private breakpointService: BreakpointService,
		private drawerService: DrawerService
	) {
		this.drawerSubscription = this.drawerService.isOpen$.subscribe(isOpen => {
			this.isDrawerOpen = isOpen;
		});
	}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$.subscribe(bp => {
			this.currentBreakpoint = bp;
		});
	}
	ngOnDestroy(): void {
		this.drawerSubscription.unsubscribe();
	}
}
