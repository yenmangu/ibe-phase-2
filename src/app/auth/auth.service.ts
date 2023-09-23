import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	BehaviorSubject,
	Observable,
	of,
	map,
	switchMap,
	tap,
	catchError
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DateTime } from 'luxon';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private isAuthed = new BehaviorSubject<boolean>(false);

	private _authed: boolean = false;
	private userExist: boolean = false;
	private apiUrl: string = environment.API_URL;
	private tokenExpiration: DateTime | null = null;
	private tokenKey: any = null;

	constructor(private http: HttpClient) {}

	public get authStatus() {
		return this._authed;
	}

	setToken(token: any): void {
		localStorage.setItem('auth_token', token);
	}

	getToken(): any | null {
		return localStorage.getItem('auth_token');
	}

	removeToken(): void {
		localStorage.removeItem('auth_token');
	}

	isTokenExpired(): boolean {
		return this.tokenExpiration !== null && DateTime.now() >= this.tokenExpiration;
	}

	private storeTokenExpiration(expiresIn: string): void {
		const regexResult = expiresIn.match(/(\d+)(\w+)/);
		if (regexResult)
		const expiration = DateTime.now().plus({ millisecond: expiresIn });
		localStorage.setItem('auth_token_expiration', expiration.toISO());
	}

	authenticateUser(data): Observable<boolean> {
		const { type, username, password } = data;
		return this.http
			.post<any>(`${this.apiUrl}/login`, { type, username, password })
			.pipe(
				map(response => {
					console.log('login response: ', response);
					const token = response.token;
					const expiresIn = response.expires;

					return response.isAuthed;
				}),
				tap(isAuthenticated => {
					if (isAuthenticated) {
						this.isAuthed.next(true);
					}
				}),
				catchError(err => {
					console.error('Error authenticating user', err);
					return of(false);
				})
			);
	}

	login(credentials): Observable<boolean> {
		return this.authenticateUser(credentials).pipe(
			switchMap(authResult => {
				return of(authResult);
			})
		);
	}

	logout(): void {
		localStorage.removeItem(this.tokenKey);
	}
}
