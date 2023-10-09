import { Component, OnDestroy, OnInit } from '@angular/core';
import { CheckSessionService } from '../auth/services/check-session.service';
import { CurrentEventService } from './games/services/current-event.service';
import { Subscription, combineLatest, lastValueFrom } from 'rxjs';
import { SharedDataService } from '../shared/services/shared-data.service';
import { AuthService } from '../auth/services/auth.service';
import { DataService } from './games/services/data.service';
import { SharedGameDataService } from './games/services/shared-game-data.service';
import { ProcessCurrentMatchService } from './games/services/process-current-match.service';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
	private isAuthedSubscription: Subscription = new Subscription();
	private gameCodeSubscription: Subscription = new Subscription();
	private dirKeySubscription: Subscription = new Subscription();
	private matchTypeSubscription: Subscription = new Subscription();

	private matchType: string;
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

			const matchType = this.processCurrentMatch.getMatchType(data);
			if (matchType) {
				this.sharedDataService.updateMatchType(matchType);
			}

			this.matchTypeSubscription =
				this.sharedDataService.selectedMatchType$.subscribe(
					async currentMatchType => {
						if (currentMatchType) {
							this.matchType = currentMatchType;
							if (data) {
								await this.processData(data);
							}
						} else {
							throw new Error('No match type from subscription');
						}
					}
				);
		} catch (err) {
			console.error('error fetching initial data: ', err);
		}
	}

	private async processData(data: any) {
		await this.dataService.initialiseDB(data);
		const success = await this.storeInitialData(data);
		if (success) {
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
			}
			this.sharedGameDataService.setLoadingStatus(true);
		} catch (error) {
			throw error;
		}
	}

	ngOnDestroy(): void {
		this.dirKeySubscription.unsubscribe();
		this.gameCodeSubscription.unsubscribe();
		this.isAuthedSubscription.unsubscribe();
		this.matchTypeSubscription.unsubscribe();
	}
}
