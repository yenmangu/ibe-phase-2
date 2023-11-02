import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { ApiDataProcessingService } from './api-data-processing.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { tap, map } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class ApiDataCoordinationService {
	constructor(
		private apiDataProcessing: ApiDataProcessingService,
		private httpService: HttpService,
		private authService: AuthService
	) {}

	public invokeAPICoordination(
		data: any,
		game_code?: string,
		dir_key?: string
	): Observable<any> {
		console.log('api coordination invoked');

		if (game_code === undefined && dir_key === undefined) {
			return this.sendToHttp(data);
		} else {
			if (data.settings) {
				return this.postSettings(dir_key, game_code, data);
			}
			if (data.table_config) {
				return this.postCurrent(dir_key, game_code, data);
			}
		}
		return of(null);
	}

	public setbaseSettings(dir_key, game_code, data): Observable<any> {
		return this.httpService.postSettings(data, game_code, dir_key);
	}

	private postSettings(dir_key, game_code, data): Observable<any> {
		return this.httpService.postSettings(data, game_code, dir_key);
	}

	private postCurrent(dir_key, game_code, data): Observable<any> {
		return this.httpService.postCurrent(data, game_code, dir_key);
	}

	private sendToHttp(data): Observable<any> {
		return this.httpService.postData(data);
	}

	setPublicGame(data): Observable<any> {
		const { gameCode, gameConfig } = data;
		return this.httpService.saveStartingLineup(gameCode, gameConfig);
	}

	getPublicGame(data): Observable<any> {
		console.log('get public game invoked');

		const { gameCode, gameId } = data;
		return this.httpService.getStartingLineup(gameCode, gameId);
	}

	getCurrentDealFile(data): Observable<any> {
		return this.httpService.downloadCurrent(data);
	}

	changeEmail(formData): Observable<any> {
		const directorId = localStorage.getItem('DIRECTOR_ID');
		const { email } = formData;
		const data = {
			directorId: directorId,
			email: email
		};
		return this.httpService.updateEmail(data).pipe(
			map(response => {
				if (response.success) {
					const details = { newEmail: email };
					this.authService.updateUserDetails(details);
					return {...response, updated: true}
				}
			})
		);
	}

	updatePassword(formData): Observable<any> {
		const directorId = localStorage.getItem('DIRECTOR_ID');

		const { gameCode, currentKey, newKey } = formData;
		const data = {
			gameCode,
			directorId,
			currentKey,
			newKey
		};
		return this.httpService.updatePassword(data).pipe(
			map(response => {
				if (response.success) {
					// console.log('response in map: ', response);
					const details = { newKey };
					this.authService.updateUserDetails(details);
					return {...response, updated: true}
				}
			})
		);
	}
}
