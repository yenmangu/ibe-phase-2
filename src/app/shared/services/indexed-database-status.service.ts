import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class IndexedDatabaseStatusService {
	public dataFinishedLoadingSubject = new BehaviorSubject<boolean>(false);
	dataProgressSubject = new BehaviorSubject<number>(0);
	private isInitialisedsubject = new BehaviorSubject<boolean>(false);
	private storeNamesExistSubject = new Subject<boolean>();

	isInitialised$ = this.isInitialisedsubject.asObservable();
	dataFinished$ = this.dataFinishedLoadingSubject.asObservable();
	dataProgress$ = this.dataProgressSubject.asObservable();
	storeNamesExist$ = this.storeNamesExistSubject.asObservable();

	constructor() {}
	setStatus(isInitialised: boolean): void {
		this.isInitialisedsubject.next(isInitialised);
	}

	isInitialised(): Observable<boolean> {
		console.log('isInitialised observable');
		return this.isInitialisedsubject.asObservable();
	}

	setProgress(totalStores: number, storesAdded: number): void {
		const initialProgress = 5
		const actualProgress = (storesAdded / totalStores) * 95;
		const totalProgress = initialProgress + actualProgress
		this.dataProgressSubject.next(totalProgress);
	}

	resetProgress(): void {
		console.log('resetting progress to 5%');

		this.dataProgressSubject.next(5);
	}

	bypassProgress() {
		this.dataProgressSubject.next(100);
		this.isInitialisedsubject.next(true);
		this.dataFinishedLoadingSubject.next(true)
	}

	setStoreNamesExist(initalised: boolean) {
		this.storeNamesExistSubject.next(initalised);
		this.dataFinishedLoadingSubject.next(true);
	}
}
