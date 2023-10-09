import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ProcessCurrentMatchService } from './process-current-match.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
	providedIn: 'root'
})
export class CurrentEventService implements OnInit {
	apiUrl = environment.API_URL;
	private handDataSubject = new BehaviorSubject<any[]>([])
	public handData$ = this.handDataSubject.asObservable()

	constructor(
		private http: HttpClient,
		private sharedDataService: SharedDataService,
		private processCurrentMatch: ProcessCurrentMatchService
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
		console.log(
			`private getDummyData to ${this.apiUrl}/dev/dummy_xml?filename=${matchType} called`
		);
		return this.http
			.get<any>(`${this.apiUrl}/dev/dummy_xml?filename=${matchType}`)
			.pipe(
				tap(data => {
					// console.log('data tapped from http-response',data)
				}),
				catchError(err => {
					console.error('Error', err);
					throw err;
				})
			);
	}

	private async processHandData(selectedMatchType): Promise<any> {
		try {
			if (!selectedMatchType) {
				throw new Error('No selected match type');
			}
			const handData = await this.processCurrentMatch.getCurrentHands(
				selectedMatchType
			);
			if (handData) {

				console.log('hand data: ', handData.value)

				return handData;
			} else {
				throw new Error('No returned hand data');
			}
		} catch (err) {
			throw err;
		}
	}
}


