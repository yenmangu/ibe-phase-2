import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root'
})
export class HandActionsHttpService {
	apiUrl = environment.API_URL;
	constructor(private http: HttpClient) {}

	uploadHand(data): Observable<any> {
		return this.http.post(`${this.apiUrl}/hand-actions/upload`, data);
	}

	downloadHand(data): Observable<any> {
		const params = new HttpParams().append('gameCode', data.gameCode);
		return this.http.get(`${this.apiUrl}/hand-actions/download`, { params });
	}

	fetchMovement(data): Observable<any> {
		const body = { title: data.title };
		const params = new HttpParams()
			.append('gameCode', data.gameCode)
			.append('TYPE', 'movement')
			.append('format', 'PDF');
		return this.http.post(`${this.apiUrl}/hand-actions/movement-pdf`, body, {
			params
		});
	}
	
}
