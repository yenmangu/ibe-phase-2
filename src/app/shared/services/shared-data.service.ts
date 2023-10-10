import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

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
		this.updateDirKey(dirKey);
	}

	public updateGameCode(gameCode: string) {
		console.log('shared data service updating game code: ', gameCode);
		localStorage.setItem('game_code', gameCode);
		this.gameCodeSubject.next(gameCode);
	}
	private updateEmail(email: string) {
		// console.log('shared data service updating email: ', email);
		localStorage.setItem('user_email', email);
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

	public async getUserData(): Promise<any> {
		const data: { gameCode: string; dirKey: string } = {
			gameCode: localStorage.getItem('GAMECODE') || '',
			dirKey: localStorage.getItem('DIRKEY') || ''
		};

		if (data) {
			this.updateGameCode(data.gameCode);
			this.updateDirKey(data.dirKey);
		}

		console.log('data in getUserData: ', data);
	}
}
