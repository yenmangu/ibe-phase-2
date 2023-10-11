import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedDataService } from '../shared/services/shared-data.service';
import { UserDetailsService } from '../shared/services/user-details.service';
import { AuthService } from '../auth/services/auth.service';
import { Observable, Subscription, take } from 'rxjs';
import { IndexedDatabaseStatusService } from '../shared/services/indexed-database-status.service';

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
	directorKey$: Observable<string>;

	constructor(
		private sharedDataService: SharedDataService,
		public authService: AuthService,
		private userDetailsService: UserDetailsService,
		private IDBStatus: IndexedDatabaseStatusService
	) {
		// console.log('admin loaded');
	}
	ngOnInit(): void {
		console.log('admin init');
		this.gameCode$ = this.userDetailsService.gameCode$;
		this.directorKey$ = this.userDetailsService.directorKey$;
		this.gameCodeSubscription = this.gameCode$.pipe(take(1)).subscribe(gameCode => {
			console.log('Game Code: ', gameCode);
		});

		this.dirKeySubscription = this.directorKey$.pipe(take(1)).subscribe(dirKey => {
			console.log('Dir Key: ', dirKey);
		});

		this.IDBStatus.resetProgress();
	}
	ngOnDestroy(): void {
		this.gameCodeSubscription.unsubscribe();
		this.dirKeySubscription.unsubscribe();
	}
}
