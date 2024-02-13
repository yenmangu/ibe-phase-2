import {
	Component,
	OnInit,
	OnDestroy,
	ChangeDetectorRef,
	ChangeDetectionStrategy,
	NgZone
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedDataService } from '../../services/shared-data.service';
import { UserDetailsService } from '../../services/user-details.service';
import { tag } from 'rxjs-spy/operators';

@Component({
	selector: 'app-user-details',
	templateUrl: './user-details.component.html',
	styleUrls: ['./user-details.component.scss']
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent implements OnInit, OnDestroy {
	isAuth: boolean = false;
	gameCode: string = '';
	email: string = '';
	private gameCodeSubscription = new Subscription();
	private emailSubscription = new Subscription();

	private isAuthSubscription = new Subscription();
	isDataReady: boolean = false;
	constructor(
		public authService: AuthService,
		public sharedDataService: SharedDataService,
		public userDetailsService: UserDetailsService,
		private cdr: ChangeDetectorRef,
		private ngZone: NgZone
	) {}

	ngOnInit(): void {
		console.log('user details component init');

		this.isAuthSubscription = this.authService.isAuthedSubject$
			// .pipe(tag('auth'))
			.subscribe(auth => {
				if (auth) {
					this.isAuth = auth;
				}
			});
		this.emailSubscription = this.userDetailsService.email$
			// .pipe(tag('email$'))
			.subscribe(email => {
				if (email) {
					this.email = email;
				}
			});
		this.gameCodeSubscription = this.userDetailsService.gameCode$
			// .pipe(tag('gamecode'))
			.subscribe(gameCode => {
				if (gameCode) {
					this.gameCode = gameCode;
				}
			});
		// const result = this.userDetailsService.updateFromLocalStorage();
		// console.log('updated result: ', result);
	}

	ngOnDestroy(): void {
		console.log('user-details component being destroyed');

		this.isAuthSubscription.unsubscribe();
		this.emailSubscription.unsubscribe();
		this.gameCodeSubscription.unsubscribe();
	}
}
