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

	constructor() {}
	public updateGameCode(gameCode: string) {
		console.log('shared data service updating game code: ', gameCode);
		this.gameCodeSubject.next(gameCode);
		// console.log(
		// 	'shared data service Game Code: ',
		// 	gameCode,
		// 	'gameCode observable: ',
		// 	this.gameCode$
		// );
	}
	public updateEmail(email: string) {
		console.log('shared data service updating email: ', email);
		this.emailSubject.next(email);
		// console.log(
		// 	'shared data service Email: ',
		// 	email,
		// 	'gameCode observable: ',
		// 	this.email$
		// );
	}
}
