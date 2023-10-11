import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { CurrentEventService } from './services/current-event.service';
import { DataService } from './services/data.service';
import { SharedGameDataService } from './services/shared-game-data.service';
import { ProcessMatchDataService } from './services/process-match-data.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
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
} from 'rxjs';import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { SharedGameDataService } from './services/shared-game-data.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProcessCurrentMatchService } from './services/process-current-match.service';
@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit, OnDestroy {
	gameDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
	private gameData$ = this.gameDataSubject.asObservable();

	private databaseStatusSubscription: Subscription = new Subscription();

	constructor(
		private sharedDataService: SharedDataService,
		private indexedDBStatus: IndexedDatabaseStatusService,
		private sharedGamesDataService: SharedGameDataService,
		private processCurrentMatchService: ProcessCurrentMatchService
	) {}

	async ngOnInit(): Promise<void> {
		this.databaseStatusSubscription = this.indexedDBStatus.isInitialised$.subscribe(
			async isInit => {
				if (isInit) {
					console.log('Database status subscription: Initialised: ', isInit);
					await this.getMatchType().then(matchType => {
						if (matchType) {
							this.sharedDataService.updateMatchType(matchType);
						}
					});
				}
			}
		);
	}

	private async getMatchType(): Promise<any> {
		try {
			const settingsTxt = await this.processCurrentMatchService.getSettingsTxt();
			if (settingsTxt) {
				const matchType = this.processCurrentMatchService.getMatchType(settingsTxt);
				console.log('match type in games component: ', matchType);
				return matchType;
			}
		} catch (err) {
			console.error('Error retrieving match type: ', err);
			return err;
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
