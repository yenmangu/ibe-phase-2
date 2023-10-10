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

	// qupdateFromLocalStorage() {
	// 	let updateStatus = {
	// 		loggedIn: false,
	// 		emailUpdated: false,
	// 		gameCodeUpdated: false,
	// 		dirKeyUpdated: false
	// 	};
	// 	const localStorageLoggedIn = localStorage.getItem('LOGGED_IN');
	// 	if (!localStorageLoggedIn) {
	// 		return updateStatus.loggedIn = false;
	// 	} else {
	// 		if (this.loggedInSubject.getValue()) {
	// 			updateStatus.loggedIn = true;
	// 			if (!this.gameCodeSubject.getValue()) {
	// 				const localGameCode = localStorage.getItem('GAME_CODE');
	// 				if (localGameCode) {
	// 					this.updateGameCode(localGameCode);
	// 					updateStatus.gameCodeUpdated = true;
	// 				}
	// 			}
	// 			if (!this.emailSubject.getValue()) {
	// 				const localEmail = localStorage.getItem('EMAIL');
	// 				if (localEmail) {
	// 					this.updateEmail(localEmail);
	// 					updateStatus.emailUpdated = true;
	// 				}
	// 			}
	// 			if (!this.directorKeySubject.getValue()) {
	// 				const localDirKey = localStorage.getItem('DIR_KEY');
	// 				if (localDirKey) {
	// 					this.updateDirectorKey(localDirKey);
	// 					updateStatus.dirKeyUpdated = true;
	// 				}
	// 			}
	// 		} else {
	// 			updateStatus.loggedIn = false;
	// 		}
	// 	}
	//   return updateStatus;
	// }

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
			return false
		}

		return updateStatus;
	}

	clearAllSubjects(): void {
		this.emailSubject.next('');
		this.gameCodeSubject.next('');
		this.directorKeySubject.next('');
		this.loggedInSubject.next(false);

		this.emailSubject.complete();
		this.gameCodeSubject.complete();
		this.directorKeySubject.complete();
	}

	updateLoggedIn(status: boolean): void {
		this.loggedInSubject.next(status);
	}

	updateGameCode(gamecode: string): void {
		this.gameCodeSubject.next(gamecode);
	}
	updateEmail(email: string): void {
		this.emailSubject.next(email);
	}

	updateDirectorKey(directorKey: string): void {
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
