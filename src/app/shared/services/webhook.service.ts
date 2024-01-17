import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WebhookService {
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

	sendWebhookRequest(data): Observable<any> {
		const headers = this.getHeaders();
		return this.http.post<any>(`${this.apiUrl}/webhook/googlesheet`, data, {
			headers
		});
	}
}
