import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
@Injectable({
	providedIn: 'root'
})
export class CheckSessionService {
	apiUrl = environment.API_URL;
	isValidSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	isValid$ = this.isValidSubject.asObservable();
	constructor(
		private http: HttpClient,
		private sharedDataService: SharedDataService
	) {}

	async checkSession(): Promise<void> {
		console.log('checkSession method called'); // Add this line

		this.http.get<any>(`${this.apiUrl}/auth/check_session`).subscribe({
			next: async response => {
				console.log(response);
				if (response.status === 'SESSION_ACTIVE') {
					this.isValidSubject.next(true);
					const userData = await this.sharedDataService.getUserData();
					if (userData) {
						console.log('user data: ', userData);
						this.sharedDataService.updateGameCode(userData.gameCode);
						this.sharedDataService.updateDirKey(userData.dirKey);
						console.log('session service set session as valid');
					}
				} else {
					this.isValidSubject.next(false);
				}
			},
			error: error => {
				console.error('error checking session: ', error);
				this.isValidSubject.next(false);
			}
		});
	}
}
