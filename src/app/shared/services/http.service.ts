import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root'
})
export class HttpService {
	private apiUrl: string = environment.API_URL;

	constructor(private http: HttpClient) {}

	postData(data): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}/database`, data).pipe(
			tap(response => {
				console.log(response);
			}),
			catchError(err => {
				throw err;
			})
		);
	}

	fetchData(gamecode, dir_key): Observable<any> {
		const params = new HttpParams()
      .set('game_code', gamecode)
      .set('dir_key', dir_key);
		return this.http.get(`${this.apiUrl}/database`,{params});
	}
}
