import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class IndexedDatabaseStatusService {
	private databaseStatusSubject = new BehaviorSubject<boolean>(false);
	public dataFinishedLoadingSubject = new BehaviorSubject<boolean>(false);
	dataProgressSubject = new BehaviorSubject<number>(0);

	isInitialised$ = this.databaseStatusSubject.asObservable();
	dataFinished$ = this.dataFinishedLoadingSubject.asObservable();
	dataProgress$ = this.dataProgressSubject.asObservable();

	setStatus(isInitialised: boolean): void {
		this.databaseStatusSubject.next(isInitialised);
	}

	isInitialised(): Observable<boolean> {
		console.log('isInitialised observable');
		return this.databaseStatusSubject.asObservable();
	}

	setProgress(totalStores: number, storesAdded: number): void {
		const progress = (storesAdded / totalStores) * 100;
		this.dataProgressSubject.next(progress);
	}

	resetProgress(): void {
		console.log('resetting progress to 0');

		this.dataProgressSubject.next(0);
	}

	constructor() {}
}
