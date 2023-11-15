import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ChangeDetectorRef,
	ChangeDetectionStrategy
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedDataService } from '../services/shared-data.service';
import { SidenavService } from '../services/sidenav.service';
import { Subject, Subscription, startWith, takeUntil } from 'rxjs';
import { UserDetailsService } from '../services/user-details.service';
import { IndexedDatabaseStatusService } from '../services/indexed-database-status.service';
import { SharedGameDataService } from 'src/app/admin/games/services/shared-game-data.service';
import { BreakpointService } from '../services/breakpoint.service';
import { DialogService } from '../services/dialog.service';
import { PasswordRecoverComponent } from 'src/app/auth/password-recover/password-recover.component';
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

	private sidenavSubscription: Subscription;
	constructor(
		private router: Router,
		public authService: AuthService,
		public sharedDataService: SharedDataService,
		private sidenavService: SidenavService,
		public userDetailsService: UserDetailsService,
		private cdr: ChangeDetectorRef,
		private IDBStatus: IndexedDatabaseStatusService,
		private sharedGameDataService: SharedGameDataService,
		private breakpointService: BreakpointService,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.userDetailsService.updateFromLocalStorage();
		this.cdr.detectChanges();

		this.breakpointService.currentBreakpoint$.subscribe(breakpoint => {
			this.currentBreakpoint = breakpoint;
			console.log(this.currentBreakpoint);
		});
	}

	ngAfterViewInit(): void {}

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
		this.dialogService.openDialog('forgotPASSWORD',undefined,undefined,undefined,undefined,PasswordRecoverComponent)
	}

	ngOnDestroy(): void {
		this.sidenavSubscription.unsubscribe();
	}
}
