import { Injectable } from '@angular/core';
import {
	BehaviorSubject,
	Observable,
	Subject,
	takeUntil,
	filter,
	take,
	firstValueFrom,
	throwError,
	catchError
} from 'rxjs';
import { DataService } from './data.service';
import { ProcessHandsService } from './process-hands.service';
import { FetchCurrentDataService } from './fetch-current-data.service';
import { ProcessCurrentDataService } from './process-current-data.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { tag } from 'rxjs-spy/operators';
tag;

@Injectable({
	providedIn: 'root'
})
export class CurrentGamesDatabaseServiceService {
	public matchTypeSubject = new Subject();
	public matchType$ = this.matchTypeSubject.asObservable();

	public currentGameLoadingSubject = new BehaviorSubject<any>(null);
	public currentGameLoading$ = this.currentGameLoadingSubject.asObservable();

	private destroy$: Subject<void> = new Subject<void>();

	isDbInitialised: boolean = false;

	constructor(
		private dataService: DataService,
		private processHands: ProcessHandsService,
		private fetchMatchData: FetchCurrentDataService,
		private iDBStatus: IndexedDatabaseStatusService,
		private processCurrentDataService: ProcessCurrentDataService
	) {
		this.iDBStatus.isInitialised$
			.pipe(takeUntil(this.destroy$))
			.subscribe(initialised => {
				this.isDbInitialised = initialised;
			});
	}

	async fetchCurrentData(objectStore: string, key: string): Promise<any> {
		try {
			console.log('fetch current data invoked');
			await this.waitForDBInitialization();
			const data = await this.fetchMatchData.getData(objectStore, key);
			this.currentGameLoadingSubject.next(data);
			return data;
		} catch (err) {
			this.currentGameLoadingSubject.next(err);
			throw err; // Rethrow the error for the caller to handle
		}
	}

	fetchAndProcessGameData(): Observable<any> {
		console.log('fetch and process data invoked');

		return this.processCurrentDataService.getInitialTableData().pipe(
			tag('getInitial'),
			catchError(error => {
				console.error('Error fetching and processing game data', error);
				return throwError(() => error);
			})
		);
	}

	async refreshDatabase (){
		this.dataService.deleteIndexedDBDatabase()
	}

	private async waitForDBInitialization() {
		if (!this.isDbInitialised) {
			// Wait until the IndexedDB is initialized
			await firstValueFrom(
				this.iDBStatus.isInitialised$.pipe(
					filter(initialized => initialized),
					take(1),
					takeUntil(this.destroy$)
				)
			);
		}
	}
}
