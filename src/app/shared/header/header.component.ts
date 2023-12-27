import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedDataService } from '../services/shared-data.service';
import { SidenavService } from '../services/sidenav.service';
import { Subscription, filter } from 'rxjs';
import { UserDetailsService } from '../services/user-details.service';
import { IndexedDatabaseStatusService } from '../services/indexed-database-status.service';
import { SharedGameDataService } from 'src/app/admin/games/services/shared-game-data.service';
import { BreakpointService } from '../services/breakpoint.service';
import { DialogService } from '../services/dialog.service';
import { PasswordRecoverComponent } from 'src/app/auth/password-recover/password-recover.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IconRegistryService } from '../services/icon-registry.service';
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
	isAuthenticated: boolean = false;
	isSidenavOpen = false;
	isDataReady: boolean = false;
	gameCode: string = '';
	email: string = '';
	dataReadySubscription = new Subscription();
	gameCodeSubscription = new Subscription();
	emailSubscription = new Subscription();
	userLoggedOut: boolean = false;
	currentBreakpoint;
	isPublicLink: boolean = false;

	private sidenavSubscription: Subscription;
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		public authService: AuthService,
		public sharedDataService: SharedDataService,
		private sidenavService: SidenavService,
		public userDetailsService: UserDetailsService,
		private cdr: ChangeDetectorRef,
		private IDBStatus: IndexedDatabaseStatusService,
		private sharedGameDataService: SharedGameDataService,
		private breakpointService: BreakpointService,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => {
				this.isPublicLink = this.checkRoute();
			});

		this.userDetailsService.updateFromLocalStorage();
		this.cdr.detectChanges();
		this.sharedDataService.logout$.subscribe(logout => {
			if (logout) {
				this.logout();
			}
		});

		this.breakpointService.currentBreakpoint$.subscribe(breakpoint => {
			this.currentBreakpoint = breakpoint;
			console.log(this.currentBreakpoint);
		});
	}

	ngAfterViewInit(): void {}

	checkRoute(): boolean {
		const urlSegments = this.router.url.split('/');
		const firstPath = urlSegments.length > 1 && urlSegments[1];
		console.log('first path: ', firstPath);

		if (firstPath.startsWith('starting-lineup')) {
			return true;
		} else {
			return false;
		}
	}

	toggleSidenav(): void {
		this.sidenavService.toggle();
		// console.log('sidenav button clicked');
	}

	isLoggedIn(): boolean {
		return this.isAuthenticated;
	}

	refreshDatabase(): void {
		this.sharedGameDataService.triggerRefreshDatabase();
	}

	logout(): void {
		this.IDBStatus.resetProgress();
		this.authService.logout();
		this.userLoggedOut = true;
		this.userDetailsService.loggedInSubject.next(false);
		this.cdr.detectChanges();
		this.router.navigate(['/home']);
	}

	forgotPassword(): void {
		console.log('Forgot password clicked');
		const dialogRef = this.dialog
			.open(PasswordRecoverComponent, {
				width: '400px',
				data: {}
			})
			.afterClosed()
			.subscribe({
				next: success => {
					if (success) {
						console.log('Success resetting password');
					}
				},
				error: error => {
					console.error('Error resetting password');
				}
			});
	}

	ngOnDestroy(): void {
		this.sidenavSubscription.unsubscribe();
	}
}
