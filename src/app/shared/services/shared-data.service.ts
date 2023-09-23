import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedDataService {
	private gameCodeSubject = new BehaviorSubject<string>('');

	gameCode$: Observable<string> = this.gameCodeSubject.asObservable();

	constructor() {}
	public updateGameCode(gameCode: string) {
		console.log('shared data service updating game code: ', gameCode);
		this.gameCodeSubject.next(gameCode);
		console.log(
			'shared data service Game Code: ',
			gameCode,
			'gameCode observable: ',
			this.gameCode$
		);
	}
}
