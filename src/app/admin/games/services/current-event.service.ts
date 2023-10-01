import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, tap } from 'rxjs';
import * as pako from 'pako';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Injectable({
	providedIn: 'root'
})
export class CurrentEventService implements OnInit {
	apiUrl = environment.API_URL;

	constructor(
		private http: HttpClient,
		private sharedDataService: SharedDataService
	) {
		const headers = new HttpHeaders({
			Accept: 'application/json'
		});
	}

	ngOnInit(): void {}

	public getAndDecompressData(matchType): Observable<any> {
		return this.getDummyXmlData(matchType);
	}

	private getDummyXmlData(matchType): Observable<any> {
		console.log(`private getDummyData to ${this.apiUrl}/dev/dummy_xml?filename=${matchType} called`)
		return this.http
			.get<any>(`${this.apiUrl}/dev/dummy_xml?filename=${matchType}`)
			.pipe(
				tap((data)=> {
					// console.log('data tapped from http-response',data)
				}),
				catchError(err => {
					console.error('Error', err);
					throw err;
				})
			);
	}
}
