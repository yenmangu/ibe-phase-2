import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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
}
