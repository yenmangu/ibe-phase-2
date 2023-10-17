import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, switchMap, take } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedGameDataService {
	private tableConfigOptionSubject = new BehaviorSubject<string>('default');
	private tableLoadingSubject = new BehaviorSubject<boolean>(true);
	private refreshDatabaseSubject = new BehaviorSubject<boolean | null>(null);
	private triggerRefresh$ = new Subject<void>();
	tableLoading$ = this.tableLoadingSubject.asObservable();
	tableConfigOption$ = this.tableConfigOptionSubject.asObservable();
	refreshDatabase$ = this.refreshDatabaseSubject.asObservable();

	constructor() {}

	setTableConfigOption(option: string) {
		this.tableConfigOptionSubject.next(option);
		// console.log(this.tableConfigOptionSubject.value);
	}

	setLoadingStatus(boolean: boolean) {
		this.tableLoadingSubject.next(boolean);
		// console.log(this.tableLoading$);
	}

	triggerRefreshDatabase() {
		this.triggerRefresh$.next();
	}
	
	get triggerRefreshObservable(): Observable<boolean> {
		return this.triggerRefresh$.pipe(
			switchMap(() => this.refreshDatabaseSubject.pipe(take(1)))
		);
	}

	refreshDbRequest() {
		const refreshRequestSubject = new BehaviorSubject<boolean | null>(null);
		refreshRequestSubject.next(true);
		refreshRequestSubject.complete;
	}
}
