import { Injectable } from '@angular/core';
import {
	Observable,
	BehaviorSubject,
	Subject,
	combineLatest,
	startWith
} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedDataService {
	public gameCodeSubject = new Subject<string>();
	private emailSubject = new BehaviorSubject<string>('');
	private TabChangeSubject = new BehaviorSubject<number>(undefined);
	public isAuthedSubject = new Subject<any>();
	public dirKeySubject = new Subject<string>();

	isAuthed$: Observable<any> = this.isAuthedSubject.asObservable();
	email$: Observable<string> = this.emailSubject.asObservable();
	gameCode$: Observable<string> = this.gameCodeSubject.asObservable();
	dirKey$: Observable<string> = this.dirKeySubject.asObservable();
	tabChange$: Observable<number> = this.TabChangeSubject.asObservable();
	dirKey$: Observable<string> = this.dirKeySubject.asObservable();

	public userDataReadySubject = new BehaviorSubject<boolean>(false);
	userDataReady$: Observable<boolean> = this.userDataReadySubject.asObservable();
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

	public updateUserData(gameCode: string, email: string, dirKey: string) {
		this.updateEmail(email);
		this.updateGameCode(gameCode);
	}

	public updateGameCode(gameCode: string) {
		console.log('shared data service updating game code: ', gameCode);
		localStorage.setItem('game_code', gameCode);
		this.gameCodeSubject.next(gameCode);
	}
	public updateEmail(email: string) {
		// console.log('shared data service updating email: ', email);
		localStorage.setItem('EMAIL', email);
		this.emailSubject.next(email);
	}

	public updateDirKey(dirKey: string) {
		console.log('updating dirkey');
		localStorage.setItem('DIRKEY', dirKey);
		this.dirKeySubject.next(dirKey);
	}

	public updateMatchType(type) {
		console.log('Shared data service updating match type: ', type);
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

	setLocalStorageItem(key: string, value: any): void {
		localStorage.setItem(key, value);
	}

	public clearAll(): void {
		localStorage.clear();
		this.gameCodeSubject.next('');
		this.dirKeySubject.next('');
		this.emailSubject.next('');
		this.TabChangeSubject.next(undefined);
		this.selectedMatchTypeSubject.next('');

		this.gameCodeSubject.complete();
		this.dirKeySubject.complete();
		this.emailSubject.complete();
		this.TabChangeSubject.complete();
		this.selectedMatchTypeSubject.complete();
	}
}
