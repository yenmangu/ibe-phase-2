import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedDataService } from '../shared/services/shared-data.service';
import { AuthService } from '../auth/services/auth.service';
import { Observable, Subscription, take } from 'rxjs';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
	gameCode: string = '';
	dirKey: string = '';
	dirKeySubscription = new Subscription();
	gameCodeSubscription = new Subscription();
	gameCode$: Observable<string>;
	dirKey$: Observable<string>;

	constructor(
		private sharedDataService: SharedDataService,
		public authService: AuthService
	) {
		// console.log('admin loaded');
	}
	ngOnInit(): void {
		console.log('admin init');
		// this.gameCode$ = this.sharedDataService.gameCode$;
		// this.dirKey$ = this.sharedDataService.dirKey$;
		this.gameCodeSubscription = this.gameCode$.pipe(take(1)).subscribe(gameCode => {
			console.log('Game Code: ', gameCode);
		});

		this.dirKeySubscription = this.dirKey$.pipe(take(1)).subscribe(dirKey => {
			console.log('Dir Key: ', dirKey);
		});
	}
	ngOnDestroy(): void {
		this.gameCodeSubscription.unsubscribe();
		this.dirKeySubscription.unsubscribe();
	}
}
