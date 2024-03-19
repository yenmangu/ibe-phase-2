import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DrawerService {
	private isOpenSubject = new BehaviorSubject<boolean>(false);
	isOpen$ = this.isOpenSubject.asObservable();

	constructor() {}

	toggle() {
		this.isOpenSubject.next(!this.isOpenSubject.value);
	}
	close() {
		this.isOpenSubject.next(false);
	}
	open() {
		this.isOpenSubject.next(true);
	}
}
