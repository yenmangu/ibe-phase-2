import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class UserDetailsService {
	loggedInSubject = new BehaviorSubject<boolean>(false);
	loggedIn$ = this.loggedInSubject.asObservable();
	emailSubject = new BehaviorSubject<string>('');
	gameCodeSubject = new BehaviorSubject<string>('');
	directorKeySubject = new BehaviorSubject<string>('');
	email$ = this.emailSubject.asObservable();
	gameCode$ = this.gameCodeSubject.asObservable();
	directorKey$ = this.directorKeySubject.asObservable();

	constructor() {}

	updateFromLocalStorage() {
		let updateStatus = {
			loggedIn: false,
			emailUpdated: false,
			gameCodeUpdated: false,
			dirKeyUpdated: false
		};

		const localStorageLoggedIn = localStorage.getItem('LOGGED_IN');
		if (localStorageLoggedIn === 'true') {
			updateStatus.loggedIn = true;

			if (!this.gameCodeSubject.getValue()) {
				const localGameCode = localStorage.getItem('GAME_CODE');
				if (localGameCode) {
					this.updateGameCode(localGameCode);
					updateStatus.gameCodeUpdated = true;
				}
			}

			if (!this.emailSubject.getValue()) {
				const localEmail = localStorage.getItem('EMAIL');
				if (localEmail) {
					this.updateEmail(localEmail);
					updateStatus.emailUpdated = true;
				}
			}

			if (!this.directorKeySubject.getValue()) {
				const localDirKey = localStorage.getItem('DIR_KEY');
				if (localDirKey) {
					this.updateDirectorKey(localDirKey);
					updateStatus.dirKeyUpdated = true;
				}
			}
		} else {
			return false;
		}

		return updateStatus;
	}

	updateLoggedIn(status: boolean): void {
		// console.log('updating loggedIn status: ', status);

		this.loggedInSubject.next(status);
	}

	updateGameCode(gamecode: string): void {
		// console.log('update gamecode: ', gamecode);

		localStorage.setItem('GAME_CODE', gamecode);
		this.gameCodeSubject.next(gamecode);
	}
	updateEmail(email: string): void {
		// console.log('updating email: ', email);
		localStorage.setItem('EMAIL', email);
		this.emailSubject.next(email);
	}

	updateDirectorKey(directorKey: string): void {
		// console.log('updating director key: ', directorKey);
		localStorage.setItem('DIR_KEY', directorKey);
		this.directorKeySubject.next(directorKey);
	}

	getLoggedinSubject(): Observable<boolean> {
		return this.loggedInSubject.asObservable();
	}

	getEmailSubject(): Observable<any> {
		return this.emailSubject.asObservable();
	}
	getGameCodeSubject(): Observable<any> {
		return this.gameCodeSubject.asObservable();
	}

	getDirectorKeyObservable(): Observable<any> {
		return this.directorKeySubject.asObservable();
	}
}
