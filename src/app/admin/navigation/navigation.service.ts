import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NavigationService {
	private readonly STORAGE_KEY = 'menuLabel';

	isSelectedSubject = new Subject<boolean>();
	isSelected$ = this.isSelectedSubject.asObservable();

	currentSelectedSubject = new BehaviorSubject<string>(
		this.getSelectedFromStorage()
	);
	currentSelected$ = this.currentSelectedSubject.asObservable();

	retrievedSelected: string = '';

	constructor() {}

	setSelected(selected) {
		console.log('current selected: ', selected);
		this.currentSelectedSubject.next(selected);
		sessionStorage.setItem(this.STORAGE_KEY, selected);
	}

	getSelected(): BehaviorSubject<string> {
		this.retrievedSelected = sessionStorage.getItem(this.STORAGE_KEY);
		return this.currentSelectedSubject;
	}
	private getSelectedFromStorage(): string {
		return sessionStorage.getItem(this.STORAGE_KEY) || '';
	}
}
