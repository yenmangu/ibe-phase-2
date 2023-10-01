import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TablesService {
	private _tablesConfigSubject: BehaviorSubject<any> = new BehaviorSubject<any>({
		venues: false,
		stratification: false,
		sitters: false,
		adjustments: false,
		handicaps: false,
		labels: false,
		abbrev: false,
		boardCol: false,
		timesLunch: false
	});

  tablesConfig$: Observable<any> = this._tablesConfigSubject.asObservable()

	constructor() {}

	public updateTableConfig(selectedOption: string) {
    const newConfig ={...this._tablesConfigSubject.value}
		for (const key in newConfig) {
			if (newConfig.hasOwnProperty(key)) {
				newConfig[key] = key === selectedOption;
			}
		}
    this._tablesConfigSubject.next(newConfig)
		console.log(newConfig);
	}
}
