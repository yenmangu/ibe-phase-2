import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NavLink } from '../data/interfaces/nav-link';
import { LinkManagementService } from '../services/link-management.service';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointService } from '../services/breakpoint.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IconRegistryService } from '../services/icon-registry.service';
@Component({
	selector: 'app-header-nav-drawer',
	templateUrl: './header-nav-drawer.component.html',
	styleUrls: ['./header-nav-drawer.component.scss']
})
export class HeaderNavDrawerComponent implements OnInit, OnDestroy {
	@Output() emitClose = new EventEmitter<boolean>();
	@Output() emitLogout = new EventEmitter<boolean>();
	@Output() emitRefresh = new EventEmitter<boolean>();

	drawerLinks: NavLink[] = [];
	currentbreakpoint: string;
	showText: boolean = true;
	private destroy$ = new Subject<void>();

	constructor(
		private linkManagement: LinkManagementService,
		private breakpointService: BreakpointService,
		public authService: AuthService,
		public iconRegistry: IconRegistryService
	) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(bp => {
				this.showText = !(bp === 'handset' || bp === 'medium');
				this.currentbreakpoint = bp;
			});
		this.linkManagement.links$
			.pipe(takeUntil(this.destroy$))
			.subscribe((links: NavLink[]) => {
				this.drawerLinks = links.filter(link => link.position === 'bottom');
			});

		// console.log('Links: ', this.drawerLinks);
	}

	handleLinkClick() {
		if (
			this.currentbreakpoint === 'handset' ||
			this.currentbreakpoint === 'medium'
		) {
			this.closeDrawer();
		}
	}
	refreshDatabase() {
		this.emitRefresh.emit(true);
	}
	closeDrawer() {
		this.emitClose.emit(true);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	logout() {
		this.emitLogout.emit(true);
	}
}
