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
	catchError,
	of
} from 'rxjs';
import { DataService } from './data.service';
import { ProcessHandsService } from '../../hands/services/process-hands.service';
import { FetchCurrentDataService } from './fetch-current-data.service';
import { RevisedProcessCurrentDataService } from './revised-process-current-data.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { SharedGameDataService } from './shared-game-data.service';
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
		private processCurrentDataService: RevisedProcessCurrentDataService,
		private sharedGameData: SharedGameDataService
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
			// tag('getInitial'),
			catchError(error => {
				console.error('Error fetching and processing game data', error);
				return throwError(() => error);
			})
		);
	}

	async fetchLock(): Promise<Observable<any>> {
		try {
			console.log('fetch current actions settings invoked ');
			const data = await this.dataService.getSingleStore('lock');
			if (data) {
				const lockValue = this.processCurrentDataService.processLock(data);
				// console.log('lock value after processing:  ', lockValue);

				this.sharedGameData.gameActionsSubject.next(lockValue);
			}
			return of(null);
		} catch (error) {
			console.error('Error fetching current game lock settings');
			throw error;
		}
	}

	async writeLock(lock): Promise<any> {
		try {
			const lockValue = lock === true ? 't' : 'f';

			const dataToWrite = { value: { $: { tf: lockValue } } };

			const result = await this.dataService.updateSingle(
				dataToWrite,
				'lock',
				'lock'
			);
			if (result === true) {
				console.log('update successful');
				this.sharedGameData.gameActionsSubject.next(lock);
			} else {
				throw new Error('Update failed:');
			}
			return result;
		} catch (error) {
			console.error('error writing lock: ', error);
			return false;
		}
	}

	async refreshDatabase() {
		this.dataService.deleteIndexedDBDatabase();
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
