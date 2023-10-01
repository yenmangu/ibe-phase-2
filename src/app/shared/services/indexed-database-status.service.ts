import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class IndexedDatabaseStatusService {
	private databaseStatusSubject = new BehaviorSubject<boolean>(false);

  isInitialised$ = this.databaseStatusSubject.asObservable()

  setStatus(isInitialised: boolean): void {
		
		this.databaseStatusSubject.next(isInitialised);
	}

	isInitialised(): Observable<boolean> {
		console.log('isInitialised observable')
		return this.databaseStatusSubject.asObservable();
	}

	constructor() {}
}
