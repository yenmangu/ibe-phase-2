import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { SharedGameDataService } from './services/shared-game-data.service';
import { BehaviorSubject, Subscription } from 'rxjs';

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
		private sharedGamesDataService: SharedGameDataService
	) {}

	async ngOnInit(): Promise<void> {
		this.databaseStatusSubscription = this.indexedDBStatus.isInitialised$.subscribe(
			isInit => {
				if (isInit) {
					console.log('Database status subscription: Initialised: ', isInit);
				}
			}
		);
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
	ngOnDestroy(): void {}
}
