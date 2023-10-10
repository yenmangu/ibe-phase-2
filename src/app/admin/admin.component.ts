import { Component, OnDestroy, OnInit, OnInit } from '@angular/core';
import { CheckSessionService } from '../auth/services/check-session.service';
import { CurrentEventService } from './games/services/current-event.service';
import { Subscription, combineLatest, lastValueFrom } from 'rxjs';
import { SharedDataService } from '../shared/services/shared-data.service';
import { AuthService } from '../auth/services/auth.service';
import { DataService } from './games/services/data.service';
import { SharedGameDataService } from './games/services/shared-game-data.service';
import { ProcessCurrentMatchService } from './games/services/process-current-match.service';
import { SharedDataService } from '../shared/services/shared-data.service';
import { AuthService } from '../auth/services/auth.service';
import { Observable, Subscription, take } from 'rxjs';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
	private isAuthedSubscription: Subscription = new Subscription();
	private gameCodeSubscription: Subscription = new Subscription();
	private dirKeySubscription: Subscription = new Subscription();

	gameCode: string;
	dirKey: string;
	sessionValid: boolean;

	constructor(
		private authService: AuthService,
		private checkSessionService: CheckSessionService,
		private currentEventService: CurrentEventService,
		private sharedDataService: SharedDataService,
		private dataService: DataService,
		private sharedGameDataService: SharedGameDataService,
		private processCurrentMatch: ProcessCurrentMatchService
	) {}

	async ngOnInit(): Promise<void> {
		this.checkSessionService.checkSession();
		this.isAuthedSubscription = this.checkSessionService.isValid$.subscribe({
			next: valid => {
				if (valid) {
					this.sessionValid = true;
				} else {
					this.sessionValid = false;
				}
			},
			error: err => {
				console.error('error subscribing to is valid session.', err);
			}
		});
		console.log('admin initialised');

		combineLatest([
			this.sharedDataService.gameCode$,
			this.sharedDataService.dirKey$
		]).subscribe(([gameCode, dirKey]) => {
			console.log('game code: ', gameCode);
			console.log('dirKey: ', dirKey);

			if (gameCode && dirKey) {
				this.gameCode = gameCode;
				this.dirKey = dirKey;

				console.log('fetchInitial called');
				this.fetchInitial();
			}
		});
	}

	private async fetchInitial(): Promise<void> {
		try {
			if (!this.gameCode || !this.dirKey) {
				throw new Error('No DirKey or Gamecode in function');
			}

			const data = await lastValueFrom(
				this.currentEventService.getLiveData(this.gameCode, this.dirKey)
			);

			if (data) {
				await this.processData(data);
			} else {
				throw new Error('No match type from subscription');
			}
		} catch (err) {
			console.error('error fetching initial data: ', err);
		}
	}

	private async processData(data: any) {
		await this.dataService.initialiseDB(data);
		const success = await this.storeInitialData(data);
		console.log(success)
		if (success) {
			console.log('process data success');

			this.sharedGameDataService.setDataStoredStatus(true);
		} else {
			this.sharedGameDataService.setDataStoredStatus(false);
		}
	}

	async storeInitialData(data): Promise<any> {
		try {
			if (!data) {
				throw new Error('no Data in store initial data function');
			}
			const dbResponse = await this.dataService.storeData(data);
			if (!dbResponse) {
				throw new Error('Error calling data service');
			} else {
				console.log('db response: ', dbResponse)
			}
			this.sharedGameDataService.setLoadingStatus(true);
			return dbResponse
		} catch (error) {
			throw error;
		}
	}

	ngOnDestroy(): void {
		this.dirKeySubscription.unsubscribe();
		this.gameCodeSubscription.unsubscribe();
		this.isAuthedSubscription.unsubscribe();
	}
	ngOnInit(): void {
		console.log('admin init');
		this.gameCode$ = this.sharedDataService.gameCode$;
		this.dirKey$ = this.sharedDataService.dirKey$;
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
