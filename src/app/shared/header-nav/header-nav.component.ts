import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavLink } from '../data/interfaces/nav-link';
import { LinkManagementService } from '../services/link-management.service';
import { Subject, takeUntil } from 'rxjs';
import { IconRegistryService } from '../services/icon-registry.service';
import { BreakpointService } from '../services/breakpoint.service';
@Component({
	selector: 'app-header-nav',
	templateUrl: './header-nav.component.html',
	styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent implements OnInit, OnDestroy {
	topBarLinks: NavLink[] = [];
	private destroy$ = new Subject<void>();
	currentBreakpoint: string;
	showText: boolean = true;
	constructor(
		private linkManagement: LinkManagementService,
		public iconRegistry: IconRegistryService,
		private breakpointsService: BreakpointService
	) {}

	ngOnInit(): void {
		this.breakpointsService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(bp => {
				console.log('bp in header nav: ', bp);
				this.showText = !(bp === 'handset' || bp === 'medium');
				this.currentBreakpoint = bp;
			});
		this.linkManagement.links$
			.pipe(takeUntil(this.destroy$))
			.subscribe((links: NavLink[]) => {
				this.topBarLinks = links.filter(link => link.position === 'top');
			});
		// console.log('Top bar links: ', this.topBarLinks);
	}

	public handleLinkClick() {
		console.log('link clicked');
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
