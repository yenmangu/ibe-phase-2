import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedSettingsService {
	private gameSettingsSubject = new BehaviorSubject<any>('');
	public gameSettings$ = this.gameSettingsSubject.asObservable();

	constructor() {}

	populateGameSettings(gameSettings: any) {
		this.gameSettingsSubject.next(gameSettings);
	}

	getGameSettings() {
		return this.gameSettingsSubject.asObservable();
	}

	
}
