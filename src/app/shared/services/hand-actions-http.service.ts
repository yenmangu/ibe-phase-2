import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpContext,
	HttpHeaders,
	HttpParams
} from '@angular/common/http';
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

	uploadBridgeWebs(data: { gameCode: string; payload: any }): Observable<any> {
		console.log('upload bridge webs http service with: ', data);

		const params = new HttpParams().set('gameCode', data.gameCode);
		params.set('gameCode', data.gameCode);
		return this.http.post(
			`${this.apiUrl}/hand-actions/upload-bridgewebs`,
			data.payload,
			{ params: params }
		);
	}

	downloadBridgeWebs(data: { gameCode: string; payload: any }) {
		console.log('Data in download bridgewebs: ', data);
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		const params = new HttpParams().set('gameCode', data.gameCode);
		const payload = data.payload;
		console.log('payload: ', payload);

		return this.http.post<Blob>(
			`${this.apiUrl}/hand-actions/download-bridgewebs`,
			payload,
			{
				headers,
				responseType: 'blob' as 'json'
			}
		);
	}

	handleBridgeWebsHttp<T extends 'upload' | 'download'>(
		action: 'upload' | 'download',
		data: {
			gameCode: string;
			eventName: string;
			[key: string]: any;
		}
	): Observable<T extends 'download' ? Blob : any> {
		const params = new HttpParams().set('action', action);
		const responseType = action === 'download' ? ('blob' as 'json') : 'json';
		// const options: {
		// 	headers?: HttpHeaders | { [header: string]: string | string[] };
		// 	observe?: 'body' | 'response' | 'events';
		// 	responseType: 'json' | 'blob';
		// 	constext?: HttpContext;
		// } = { responseType: action === 'download' ? 'blob' : 'json', observe: 'body' };
		return this.http.post<T extends 'download' ? Blob : any>(
			`${this.apiUrl}/hand-actions/bridgewebs`,
			data,
			{
				params,
				responseType
			}
		);
	}

	private getBridgeWebsHttpOptions(action: 'download' | 'upload') {
		return {
			responseType: action === 'download' ? 'blob' : 'json',
			observe: 'body'
		} as {
			responseType: 'json' | 'blob';
			observe: 'body' | 'response' | 'events';
		};
	}

	fetchEBU(data): Observable<any> {
		return this.http.post(`${this.apiUrl}/hand-actions/ebu/download`, data, {
			responseType: 'blob'
		});
	}
	sendEBU(data): Observable<any> {
		return this.http.post(`${this.apiUrl}/hand-actions/ebu/upload`, data);
	}

	htmlPDF(data): Observable<any> {
		const params = new HttpParams()
			.append('gameCode', data.gameCode)
			.append('TYPE', 'HTMLNEW');
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
