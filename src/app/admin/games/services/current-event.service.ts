import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
	BehaviorSubject,
	Observable,
	catchError,
	map,
	tap,
	throwError
} from 'rxjs';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ProcessHandsService } from './process-hands.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
@Injectable({
	providedIn: 'root'
})
export class CurrentEventService implements OnInit {
	apiUrl = environment.API_URL;
	private handDataSubject = new BehaviorSubject<any[]>([]);
	public handData$ = this.handDataSubject.asObservable();

	constructor(
		private http: HttpClient,
		private httpService: HttpService,
		private sharedDataService: SharedDataService,
		private userDetailsService: UserDetailsService,
		private processCurrentMatch: ProcessHandsService
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
	public getLiveData(gameCode: string, dirKey: string): Observable<any> {
		console.log('calling http service');
		return this.httpService.fetchData(gameCode, dirKey).pipe(
			catchError(err => {
				console.error('Error in getLiveData: ', err);
				// You can handle the error here or re-throw it as needed
				return throwError(() => err);
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
				console.log('hand data: ', handData.value);

				return handData;
			} else {
				throw new Error('No returned hand data');
			}
		} catch (err) {
			throw err;
		}
	}
}
