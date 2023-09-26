import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedDataService {
	private gameCodeSubject = new BehaviorSubject<string>('');
	private emailSubject = new BehaviorSubject<string>('');

	email$: Observable<string> = this.emailSubject.asObservable();
	gameCode$: Observable<string> = this.gameCodeSubject.asObservable();

	// Dev for updating match type

	private selectedMatchTypeSubject = new BehaviorSubject<string>('');
	selectedMatchType$: Observable<string> =
		this.selectedMatchTypeSubject.asObservable();

	constructor() {
		const gameCode = localStorage.getItem('game_code');
		if (gameCode) {
			this.updateGameCode(gameCode);
		} else {
			this.updateGameCode('No Game Code Found');
		}

		const email = localStorage.getItem('user_email');
		if (email) {
			this.updateEmail(email);
		} else {
			this.updateEmail('No Email Found');
		}
	}

	public updateUserData(gameCode: string, email: string) {
		this.updateEmail(email);
		this.updateGameCode(gameCode);
	}

	private updateGameCode(gameCode: string) {
		console.log('shared data service updating game code: ', gameCode);
		localStorage.setItem('game_code', gameCode);
		this.gameCodeSubject.next(gameCode);
	}
	private updateEmail(email: string) {
		console.log('shared data service updating email: ', email);
		localStorage.setItem('user_email', email);
		this.emailSubject.next(email);
	}

	public updateMatchType(type) {
		console.log('Shared data service updating match type: ', type);
		this.selectedMatchTypeSubject.next(type);
	}
}
