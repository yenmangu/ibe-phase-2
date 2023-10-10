import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { CurrentEventService } from './services/current-event.service';
import { DataService } from './services/data.service';
import { SharedGameDataService } from './services/shared-game-data.service';
import { ProcessMatchDataService } from './services/process-match-data.service';
import {
	Subject,
	Subscription,
	combineLatest,
	takeUntil,
	switchMap,
	pipe,
	tap,
	of,
	Observable,
	catchError
} from 'rxjs';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit, OnDestroy {
	gameCodeSubscription = new Subscription();
	dirKeySubscription = new Subscription();

	gameCode: string;
	dirKey: string;

	private destroy$ = new Subject<void>();

	constructor(
		private sharedDataService: SharedDataService,
		private currentEventService: CurrentEventService,
		private dataService: DataService,
		private processMatchData: ProcessMatchDataService,
		private sharedGameData: SharedGameDataService
	) {}

	ngOnInit(): void {
		console.log('games component init');

		this.subscribeToGameCodeAndDirKey();
	}

	private subscribeToGameCodeAndDirKey(): void {
		console.log('subscribe to gamecode and dirkey');

		combineLatest([
			this.sharedDataService.gameCode$,
			this.sharedDataService.dirKey$
		])
			.pipe(
				takeUntil(this.destroy$),
				switchMap(([gameCode, dirKey]) => {
					// Check if both gameCode and dirKey are populated
					if (gameCode && dirKey) {
						console.log('game code and dir key: ', gameCode, dirKey);
						this.gameCode = gameCode;
						this.dirKey = dirKey;
						return this.fetchData(gameCode, dirKey);
					} else {
						console.log('no gamecode or dirkey');

						console.error('no gamecode or dirkey provided');
						return of('EMPTY');
					}
				}),
				switchMap(data => {
					if (data !== 'EMPTY') {
						return this.processData(data);
					} else {
						return of(null);
					}
				})
			)
			.subscribe({
				next: value => {},
				error: err => {}
			});
	}
	private callCurrentEventService(gameCode: string, dirKey: string) {
		// Make the data fetch here using gameCode and dirKey
		// Example:
		return this.currentEventService.getLiveData(gameCode, dirKey);
	}

	private fetchData(gameCode: string, dirKey: string): Observable<any> {
		return this.currentEventService.getLiveData(gameCode, dirKey).pipe(
			catchError(error => {
				console.error('error calling current event service: ', error);
				return of(null);
			})
		);
	}

	private async processData(data) {
		console.log('processData() called with data: ', data);
		await this.dataService.initialiseDB(data);
		await this.storeInitialData(data);
	}

	async storeInitialData(data) {
		try {
			if (!data) {
				throw new Error('Error calling server');
			}
			const dbResponse = await this.dataService.storeData(data);
			if (!dbResponse) {
				throw new Error('Error calling data service');
			}
			this.sharedGameData.setLoadingStatus(false);
		} catch (err) {
			console.error('Error performing high level requestAndStore(): ', err);
		}
	}

	onTabChange(event: MatTabChangeEvent): void {
		const selectedTabIndex = event.index;
		const selectedTabLabel = event.tab.textLabel;
		this.sharedDataService.updateTabChange(selectedTabIndex);

		// Now you have the index and label of the selected tab
		console.log(`Selected Tab Index: ${selectedTabIndex}`);
		console.log(`Selected Tab Label: ${selectedTabLabel}`);

		// You can use these values as needed in your component logic
	}
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
