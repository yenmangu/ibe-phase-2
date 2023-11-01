import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SidenavService {
	public isOpenSubject = new BehaviorSubject<boolean>(true);
	isOpen$ = this.isOpenSubject.asObservable();
	constructor() {}

	toggle(): void {
		this.isOpenSubject.next(!this.isOpenSubject.value);

	}
}
