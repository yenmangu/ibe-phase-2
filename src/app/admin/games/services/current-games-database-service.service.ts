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
import { ProcessHandsService } from './process-hands.service';
import { ProcessMatchDataService } from './process-match-data.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
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
		private processHands: ProcessHandsService,
		private processMatchData: ProcessMatchDataService,
		private iDBStatus: IndexedDatabaseStatusService
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
			const data = await this.processMatchData.getData(objectStore, key);
			this.currentGameLoadingSubject.next(data);
			return data;
		} catch (err) {
			this.currentGameLoadingSubject.next(err);
			throw err; // Rethrow the error for the caller to handle
		}
	}

	fetchAndProcessGameData(): Observable<any> {
    console.log('fetch and process data invoked');

		return this.processMatchData.getInitialTableData().pipe(
			catchError(error => {
				console.error('Error fetching and processing game data', error);
				return throwError(() => error);
			})
		);
	}

	// async fetchCurrentData(objectStore: string, key: string): Promise<any> {
	// 	try {
	// 		await this.waitForDBInitialization();
	// 		const data = await this.processMatchData.getData(objectStore, key);
	// 		this.currentGameLoadingSubject.next(data);
	// 		return data;
	// 	} catch (err) {
	// 		this.currentGameLoadingSubject.next(err);
	// 	}
	// }

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
