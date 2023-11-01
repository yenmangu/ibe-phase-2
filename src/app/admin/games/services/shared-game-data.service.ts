import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, switchMap, take, of } from 'rxjs';
import { tag } from 'rxjs-spy/cjs/operators';
@Injectable({
	providedIn: 'root'
})
export class SharedGameDataService {
	private tableConfigOptionSubject = new BehaviorSubject<string>('default');
	private tableLoadingSubject = new BehaviorSubject<boolean>(true);
	private refreshDatabaseSubject = new Subject<boolean | null>();
	private startingLineupSubject = new BehaviorSubject<any>('');
	private triggerRefresh$ = new Subject<boolean>();
	databaseDeleted$ = new Subject<boolean>()

	public twoPageStartupSubject = new BehaviorSubject<boolean>(false);
	public databaseDeletedSubject = this.databaseDeleted$.asObservable()
	private requestGamecodeSubject = new Subject<string>();
	startingLineup$ = this.startingLineupSubject.asObservable();
	requestGamecode$ = this.requestGamecodeSubject.asObservable();

	tableLoading$ = this.tableLoadingSubject.asObservable();
	tableConfigOption$ = this.tableConfigOptionSubject.asObservable();
	refreshDatabase$ = this.refreshDatabaseSubject.asObservable();
	twoPageStartupValue$ = this.twoPageStartupSubject.asObservable();
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
		this.triggerRefresh$.next(true);
		console.log('triggerRefreshDatabase() invoked');
		this.refreshDatabaseSubject.next(true);
	}

	get triggerRefreshObservable(): Observable<boolean> {
		return this.triggerRefresh$.pipe(
			tag('triggerRefreshObservable'),
			switchMap(triggerValue => {
				if (triggerValue) {
					return this.refreshDatabaseSubject.pipe(take(1));
				} else {
					return of(false);
				}
			})
		);
	}

	refreshDbRequest() {
		const refreshRequestSubject = new BehaviorSubject<boolean | null>(null);
		refreshRequestSubject.next(true);
		refreshRequestSubject.complete;
	}

	setLatestLineup(lineup) {
		this.startingLineupSubject.next(lineup);
	}
}
