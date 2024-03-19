import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
	HttpParams,
	HttpResponse
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map, tap, of, catchError } from 'rxjs';

export interface ResponseData {
	headers: any;
	blob: Blob;
}
@Injectable({
	providedIn: 'root'
})
export class AdminToolsService {
	private apiUrl: string = environment.API_URL;
	private authToken: string =
		'dzKiWLbFuWDSAHMe3YbbuzTMojHfMPo5xbfq9T5R5RszCEcxl0BGmqOgZTWZ5eA30rA61FEHXoeKU6EMseiHAP3HD3GJAr15iEgaRLLFIUHK97ypYa5R81u7UyqfxY76';

	constructor(private http: HttpClient) {}

	// prettier-ignore
	private getHeaders(): HttpHeaders {
		return new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${this.authToken}`
		});
	}

	verifyAdmin(gameCode): Observable<any> {
		let params = new HttpParams();
		params = params.append('gameCode', gameCode);
		// console.log('Params before request: ', params);

		return this.http
			.get(`${this.apiUrl}/verification/admin-verify`, {
				params,
				observe: 'response'
			})
			.pipe(
				map((response: HttpResponse<any>) => {
					console.log('Response Status in service: ', response);

					if (response.status === 200) {
						return response.body;
					} else {
						throw new Error(`Unexpected response status: ${response.status}`);
					}
				}),
				catchError((error: HttpErrorResponse) => {
					if (error.status === 400) {
						return of({ authStatus: false });
					} else {
						console.error('An error occurred: ', error);
						return of(null);
					}
				})
			);
	}

	sendUrls(data): Observable<Blob> {
		return this.http.post(`${this.apiUrl}/admin-tools/extract-lin`, data, {
			responseType: 'blob'
		}) as Observable<Blob>;
	}

	batchConvertReq(): Observable<any> {
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', 'Bearer ' + this.authToken);
		return this.http.get(`${this.apiUrl}/webhook/bulk-convert`, { headers });
	}

	// uploadPbn(payload): Observable<ResponseData> {
	// 	return this.http
	// 		.post(`${this.apiUrl}/admin-tools/convert-pbn`, payload, {
	// 			observe: 'response',
	// 			responseType: 'blob'
	// 		})
	// 		.pipe(
	// 			map(response => {
	// 				return {
	// 					headers: response.headers,
	// 					blob: response.body
	// 				};
	// 			})
	// 		);
	// }

	uploadPbn(payload): Observable<ResponseData> {
		// let headers = new HttpHeaders();

		return this.http
			.post(`${this.apiUrl}/admin-tools/convert-pbn`, payload, {
				observe: 'response',
				responseType: 'blob'
			})
			.pipe(
				tap(response => {
					const headers = response.headers;
					headers.keys().forEach(key => {
						headers.get(key);
					});
				}),
				map(response => {
					return {
						headers: response.headers,
						blob: response.body
					};
				})
			);
	}
}
