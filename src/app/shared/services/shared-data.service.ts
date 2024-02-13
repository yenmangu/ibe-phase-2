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
	public gameCodeSubject = new BehaviorSubject<string>('');
	public emailSubject = new BehaviorSubject<string>('');
	public dirKeySubject = new Subject<string>();
	public TabChangeSubject = new BehaviorSubject<number>(undefined);
	public eventNameSubject = new BehaviorSubject<string>('');

	public logoutSubject = new Subject<boolean>();

	email$: Observable<string> = this.emailSubject.asObservable();
	gameCode$: Observable<string> = this.gameCodeSubject.asObservable();
	tabChange$: Observable<number> = this.TabChangeSubject.asObservable();
	dirKey$: Observable<string> = this.dirKeySubject.asObservable();
	logout$: Observable<boolean> = this.logoutSubject.asObservable();
	eventName$: Observable<string> = this.eventNameSubject.asObservable();

	public userDataReadySubject = new BehaviorSubject<boolean>(false);
	userDataReady$: Observable<boolean> = this.userDataReadySubject.asObservable();
	// Dev for updating match type

	private selectedMatchTypeSubject = new BehaviorSubject<string>('');
	selectedMatchType$: Observable<string> =
		this.selectedMatchTypeSubject.asObservable();

	constructor() {}

	public updateUserData(gameCode: string, dirKey: string, email: string) {
		console.log('setting user data: ', gameCode, dirKey, email);
		this.gameCodeSubject.next(gameCode);
		this.dirKeySubject.next(dirKey);
		this.emailSubject.next(email);

		combineLatest([
			this.gameCode$.pipe(startWith(gameCode)),
			this.email$.pipe(startWith(email)),
			this.dirKey$.pipe(startWith(dirKey))
		]).subscribe(([gameCodeVal, dirKeyVal, emailVal]) => {
			if (gameCodeVal && dirKeyVal && emailVal) {
				this.userDataReadySubject.next(true);
				console.log('user data ready');
				// } else {
				// 	console.log('user data NOT ready');
				// }
			}
		});

		localStorage.setItem('GAME_CODE', gameCode);
		localStorage.setItem('DIR_KEY', dirKey);
		localStorage.setItem('EMAIL', email);
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
	public updateEmail(email: string) {
		// console.log('shared data service updating email: ', email);
		localStorage.setItem('EMAIL', email);
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

	setLocalStorageItem(key: string, value: any): void {
		localStorage.setItem(key, value);
	}

	public updateEventName(eventName: string): void {
		this.eventNameSubject.next(eventName);
	}

	public getEventName(): Observable<string> {
		return this.eventNameSubject.asObservable();
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
