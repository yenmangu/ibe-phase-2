import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root'
})
export class GameActionsHttpService {
	apiUrl = environment.API_URL;

	constructor(private http: HttpClient) {}

	finaliseGame(data): Observable<any> {
		const body = data;
		return this.http.post<{ any }>(`${this.apiUrl}/game-actions/finalise`, body);
	}

	lockGame(data): Observable<any> {
		const body = data;
		console.log('data in lockGame http: ', body);

		return this.http.post<{ any }>(`${this.apiUrl}/game-actions/lock`, body);
	}

	redateGame(data): Observable<any> {
		const body = {
			gameCode: data.gameCode,
			dirKey: data.dirKey,
			date: data.date
		};
		return this.http.post<{ any }>(`${this.apiUrl}/game-actions/redate`, body);
	}

	bboToServer(formData, gameCode): Observable<any> {
		const params = new HttpParams()
			.append('gameCode', gameCode)
			.append('type', 'BBO');
		return this.http.post<{ any }>(
			`${this.apiUrl}/game-actions/bbo-upload`,
			formData,
			{ params }
		);
	}

	bclToServer(data): Observable<any> {
		const body = { data };
		return this.http.post(`${this.apiUrl}/game-actions/bcl-upload`, body);
	}

	importUSEBIO(formData, gameCode): Observable<any> {
		const params = new HttpParams()
			.append('gameCode', gameCode)
			.append('type', 'USEBIO');

		return this.http.post(`${this.apiUrl}/game-actions/usebio`, formData, {
			params
		});
	}

	setSimultaneous(data): Observable<any> {
		const params = new HttpParams().append('game_code', data.gameCode);
		const body = data;
		return this.http.post(`${this.apiUrl}/game-actions/merge`, body, {
			params
		});
	}

	purgeGame(data): Observable<any> {
		const body = data;
		return this.http.post<{ any }>(`${this.apiUrl}/game-actions/purge`, body);
	}
}
