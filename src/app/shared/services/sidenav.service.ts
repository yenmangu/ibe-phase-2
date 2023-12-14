import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SidenavService {
	public isOpenSubject = new BehaviorSubject<boolean>(false);
	isOpen$ = this.isOpenSubject.asObservable();
	constructor() {}

	toggle(): void {
		this.isOpenSubject.next(!this.isOpenSubject.value);
	}

	open() {
		this.isOpenSubject.next(true);
	}
	close() {
		this.isOpenSubject.next(false);
	}
}
