import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedDataService } from '../services/shared-data.service';
import { SidenavService } from '../services/sidenav.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	isAuthenticated: boolean = false;
	isSidenavOpen = false;
	private sidenavSubscription: Subscription;
	constructor(
		private router: Router,
		public authService: AuthService,
		public sharedDataService: SharedDataService,
		private sidenavService: SidenavService
	) {}

	ngOnInit(): void {
		this.authService.isAuthedSubject$.subscribe((authStatus: boolean) => {
			this.isAuthenticated = authStatus;
		});

		this.sidenavSubscription = this.sidenavService.isOpen$.subscribe(isOpen => {
			// console.log('Sidenav State: ', isOpen);
			this.isSidenavOpen = isOpen;
		});
	}

	ngOnDestroy(): void {
		this.sidenavSubscription.unsubscribe();
	}

	toggleSidenav(): void {
		this.sidenavService.toggle();
		// console.log('sidenav button clicked');
	}

	isLoggedIn(): boolean {
		return this.isAuthenticated;
	}

	logout(): void {
		this.authService.logout();

		this.router.navigate(['/home'])

	}


	forgotPassword(): void {
		console.log('Forgot password clicked');
	}
}
