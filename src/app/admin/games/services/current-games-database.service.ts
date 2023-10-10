import { Injectable } from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ProcessMatchDataService } from './process-match-data.service';
import { ApiDataCoordinationService } from './api/api-data-coordination.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CurrentGamesDatabaseService {
	isDBInitialised = false;
	public currentDataLoadingSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
		null
	);
	currentDataLoading$ = this.currentDataLoadingSubject.asObservable();

	private currentDataUpdated$ = new BehaviorSubject<any>(null);

	private dataSubject = new Subject();
	fetchedData$: Observable<any> = this.dataSubject.asObservable();

	public destroy$: Subject<void> = new Subject<void>();

	constructor(
		private sharedDataService: SharedDataService,
		private processMatchDataService: ProcessMatchDataService,
		private apiDataService: ApiDataCoordinationService
	) {
		console.log('current games database service init');
	}

	async fetchCurrentData(): Promise<any> {
		try {
			const currentGame = await this.processMatchDataService.getCurrentGame();
			if (currentGame) {
        console.log('current game config in current-games-database-service: ', currentGame)
				this.currentDataLoadingSubject.next(currentGame);
				return currentGame;
			}
		} catch (err) {
			this.currentDataLoadingSubject.next(err);
		}
	}

  
}
