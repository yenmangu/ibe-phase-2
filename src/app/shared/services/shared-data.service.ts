import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedDataService {
	private gameCodeSubject = new BehaviorSubject<string>(
		localStorage.getItem('GAME_CODE') || ''
	);
	private emailSubject = new BehaviorSubject<string>('');
	private TabChangeSubject = new BehaviorSubject<number>(undefined);
	private dirKeySubject = new BehaviorSubject<string>(
		localStorage.getItem('DIR_KEY') || ''
	);
	email$: Observable<string> = this.emailSubject.asObservable();

	gameCode$: Observable<string> = this.gameCodeSubject.asObservable();
	tabChange$: Observable<number> = this.TabChangeSubject.asObservable();
	dirKey$: Observable<string> = this.dirKeySubject.asObservable();
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
	public updateDirKey(dirKey: string) {
		localStorage.setItem('DIR_KEY', dirKey);
		this.dirKeySubject.next(dirKey);
	}

	public updateGameCode(gameCode: string) {
		// console.log('shared data service updating game code: ', gameCode);
		localStorage.setItem('GAME_CODE', gameCode);
		this.gameCodeSubject.next(gameCode);
	}
	private updateEmail(email: string) {
		// console.log('shared data service updating email: ', email);
		localStorage.setItem('user_email', email);
		this.emailSubject.next(email);
	}

	public updateMatchType(type) {
		// console.log('Shared data service updating match type: ', type);
		this.selectedMatchTypeSubject.next(type);
	}

	public updateTabChange(tabIndex: number) {
		this.TabChangeSubject.next(tabIndex);
	}

	public getGameCode(): Observable<string> {
		return this.gameCodeSubject.asObservable();
	}
	public getDirKey(): Observable<string> {
		return this.dirKeySubject.asObservable();
	}
}
