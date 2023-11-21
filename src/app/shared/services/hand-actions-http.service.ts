import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root'
})
export class HandActionsHttpService {
	apiUrl = environment.API_URL;
	constructor(private http: HttpClient) {}

	uploadHand(files, gameCode): Observable<any> {
		const params = new HttpParams().append('gameCode', gameCode);
		const formData = new FormData();

		files.forEach(file => {
			formData.append('files', file);
		});
		return this.http.post(`${this.apiUrl}/hand-actions/upload`, formData, {
			params
		});
	}

	uploadLin(files, gameCode): Observable<any> {
		const params = new HttpParams().append('gameCode', gameCode);
		return this.http.post(`${this.apiUrl}/hand-actions/upload-lin`, files, {
			params
		});
	}

	downloadHand(data): Observable<any> {
		const params = new HttpParams().append('gameCode', data.gameCode);
		return this.http.get<Blob>(`${this.apiUrl}/hand-actions/download-hand`, {
			params,
			responseType: 'blob' as 'json'
		});
	}

	fetchMovement(data): Observable<any> {
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		const body = { title: data.title };

		const params = new HttpParams()
			.append('gameCode', data.gameCode)
			.append('TYPE', 'movement')
			.append('format', 'PDF');

		console.log('body: ', body);

		return this.http.post<Blob>(`${this.apiUrl}/hand-actions/movement-pdf`, body, {
			headers,
			params,
			responseType: 'blob' as 'json'
		});
	}

	uploadBridgeWebs(data) {
		const payload = { ...data, upload: true };
		return this.http.post(`${this.apiUrl}/hand-actions/masterpoints`, payload);
	}
	downloadBridgeWebs(data) {
		const payload = { ...data, download: true };
		return this.http.post(`${this.apiUrl}/hand-actions/masterpoints`, payload);
	}

	fetchEBU(data): Observable<any> {
		return this.http.post(`${this.apiUrl}/hand-actions/ebu`, data);
	}
	sendEBU(data): Observable<any> {
		return this.http.post(`${this.apiUrl}/hand-actions/ebu`, data);
	}
	htmlPDF(data): Observable<any> {
		const params = new HttpParams()
			.append('gameCode', data.gameCode)
			.append('TYPE', 'HTMLNEW')
		return this.http.post<Blob>(`${this.apiUrl}/hand-actions/html-pdf`, data, {
			params,
			responseType: 'blob' as 'json'
		});
	}

	deleteHandRecord(data): Observable<any> {
		const params = new HttpParams().append('gameCode', data.gameCode);
		return this.http.get(`${this.apiUrl}/hand-actions/delete-hand`, { params });
	}
}
