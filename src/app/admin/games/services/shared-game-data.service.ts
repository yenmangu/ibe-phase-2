import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedGameDataService {
	private tableConfigOptionSubject = new BehaviorSubject<string>('default');
	tableConfigOption$ = this.tableConfigOptionSubject.asObservable();

	constructor() {}

	setTableConfigOption(option: string) {
		this.tableConfigOptionSubject.next(option);
		console.log(this.tableConfigOptionSubject.value)
	}
}
