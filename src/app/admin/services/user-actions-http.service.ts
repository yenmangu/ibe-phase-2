import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserActionsHttpService {
	apiUrl: string = environment.USER_ACTION;
	constructor(private http: HttpClient) {}

	reqData(params: { gameCode: string; startFrom: string }): Observable<any> {
		const urlParams = { GAMECODE: params.gameCode, STARTFROM: params.startFrom };
		return this.http
			.get<any>(`${this.apiUrl}/data`, {
				params: urlParams
			})
			.pipe(tap(actions => console.log('Actions: ', actions)));
	}
}
