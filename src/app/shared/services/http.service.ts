import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root'
})
export class HttpService {
	private apiUrl: string = environment.API_URL;

	constructor(private http: HttpClient) {}

	// Auth Routes

	updateEmail(data): Observable<any> {
		const body = {
			directorId: data.directorId,
			newEmail: data.newEmail
		};
		return this.http.put<any>(`${this.apiUrl}/auth/update-email`, body);
	}

	updatePassword(data): Observable<any> {
		const params = new HttpParams().append('SLOT', data.gameCode);
		const body = {
			directorId: data.directorId,
			currentPassword: data.currentKey,
			password: data.newKey
		};
		console.log('body in update password: ', body)
		// return new Observable<any>()
		return this.http.put<any>(`${this.apiUrl}/auth/update-password`, body, { params });
	}
	
	requestPassword(data): Observable<any> {
		const { gameCode, email } = data;
		const params = new HttpParams().append('SLOT', gameCode);
		const body = {
			email: email
		};
		return this.http.post(`${this.apiUrl}/auth/request-password`, body, { params });
	}

	// Data routes

	postData(data): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}/player_database`, data).pipe(
			tap(response => {
				console.log(response);
			}),
			catchError(err => {
				throw err;
			})
		);
	}

	postCurrent(data, gamecode, dir_key): Observable<any> {
		console.log('post current invoked');

		const body = {
			dir_key: dir_key,
			game_code: gamecode,
			data
		};
		return this.http.post<any>(`${this.apiUrl}/current_game/table_config`, body);
	}

	postSettings(data, gamecode, dir_key): Observable<any> {
		const body = {
			dir_key: dir_key,
			game_code: gamecode,
			data
		};
		return this.http.post<any>(`${this.apiUrl}/current_game/base_settings`, body);
	}

	postHistoric(data, gamecode, dir_key): Observable<any> {
		const body = {
			dir_key: dir_key,
			game_code: gamecode,
			data
		};
		return this.http.post<any>(`${this.apiUrl}/historic_games`, body);
	}

	fetchData(gamecode, dir_key): Observable<any> {
		const params = new HttpParams()
			.set('game_code', gamecode)
			.set('dir_key', dir_key);
		return this.http.get(`${this.apiUrl}/database`, { params });
	}

	saveStartingLineup(gameCode, data): Observable<any> {
		const params = new HttpParams().append('game_code', gameCode);
		return this.http.post(`${this.apiUrl}/lineup/games`, data, { params });
	}

	getStartingLineup(gameCode, gameId): Observable<any> {
		const params = new HttpParams()
			.append('game_code', gameCode)
			.append('game_id', gameId);
		return this.http.get(`${this.apiUrl}/lineup/games`, { params });
	}

	downloadCurrent(gameCode): Observable<any> {
		const params = new HttpParams().append('gameCode', gameCode);
		return this.http.get<any>(`${this.apiUrl}/current_game/deal_file`, { params });
	}
}
