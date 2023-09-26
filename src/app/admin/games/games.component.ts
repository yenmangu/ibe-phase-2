import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { CurrentEventService } from './services/current-event.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { StorageService } from './services/storage.service';
@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
	currentMatch: string = '';
	constructor(
		private currentEventService: CurrentEventService,
		private sharedDataService: SharedDataService,
    private localStorageService: StorageService
	) {
		this.sharedDataService.selectedMatchType$.subscribe(matchType => {
			this.currentMatch = matchType;
			this.getCurrentMatchData();
		});
	}

	ngOnInit(): void {
		// this.currentEventService.getDummyXmlData()
	}

	private getCurrentMatchData() {
		return this.currentEventService
			.getAndDecompressData(this.currentMatch)
			.pipe(
				tap(data => {
          console.log('component',data)
          this.localStorageService.storeCurrentGameData(data)
					// console.log('data in games component: ', JSON.stringify(data, null, 2));
          console.log('data in component: ', data)
          console.log('current_game_data: ', data.siteauthresponse.currentgamedata)
          
				})
			)
			.subscribe();
	}
}
