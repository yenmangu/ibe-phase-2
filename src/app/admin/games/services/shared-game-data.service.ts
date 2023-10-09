import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedGameDataService {
	private tableConfigOptionSubject = new BehaviorSubject<string>('default');
	tableConfigOption$ = this.tableConfigOptionSubject.asObservable();

	private tableLoadingSubject = new BehaviorSubject<boolean>(true);
	tableLoading$ = this.tableLoadingSubject.asObservable();

	private dataStoredSubject = new BehaviorSubject<boolean>(false);
	dataStored$ = this.dataStoredSubject.asObservable();

	constructor() {}

	setTableConfigOption(option: string) {
		this.tableConfigOptionSubject.next(option);
		// console.log(this.tableConfigOptionSubject.value);
	}

	setLoadingStatus(boolean: boolean) {
		this.tableLoadingSubject.next(boolean);
		// console.log(this.tableLoading$);
	}

	setDataStoredStatus(boolean: boolean) {
		this.dataStoredSubject.next(boolean);
	}
}
