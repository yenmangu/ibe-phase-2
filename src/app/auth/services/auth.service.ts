import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	BehaviorSubject,
	Observable,
	of,
	switchMap,
	tap,
	map,
	catchError
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DateTime } from 'luxon';
import { TokenService } from './token.service';
import { SharedDataService } from '../../shared/services/shared-data.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private isAuthedSubject = new BehaviorSubject<boolean>(false);
	private statusSubject = new BehaviorSubject<any>('')

	private _authed: boolean = false;
	private userExist: boolean = false;
	private apiUrl: string = environment.API_URL;
	private tokenKey: any = null;

	constructor(
		private http: HttpClient,
		private tokenService: TokenService,
		private sharedDataService: SharedDataService
	) {
		const token = this.tokenService.getToken();
		if (token) {
			this.isAuthedSubject.next(true);
		}
		this.tokenService.isTokenExpired().subscribe(isExpired => {
			if (isExpired) {
				// when token is expired
				this.logout();
			}
		});
	}

	public get isAuthedSubject$(): Observable<boolean> {
		return this.isAuthedSubject.asObservable();
	}
	public get statusSubject$(): Observable<any> {
		return this.statusSubject.asObservable()
	}

	setAuthenticationStatus(isAuthenticated: boolean) {
		this.isAuthedSubject.next(isAuthenticated);
	}

	// public get authStatus() {
	// 	return this.isAuthedSubject.asObservable();
	// }

	private storeTokenExpiration(expires: number): void {
		console.log('auth.service storeTokenExpiration() ');
		// const milliseconds = this.convertToMilliseconds(expiresIn);
		const milliseconds = expires;
		if (milliseconds !== null) {
			const expiration = DateTime.now().plus({ milliseconds });
			console.log('expiration: ', expiration);
			localStorage.setItem('auth_token_expiration', expiration.toISO());
		}
	}

	authenticateUser(data): Observable<boolean> {
		const { type, username, password } = data;
		return this.http
			.post<any>(`${this.apiUrl}/auth/login`, { type, username, password })
			.pipe(
				// map(response => {
				// 	// mutate response
				// 	return response;
				// }),
				tap(response => {
					console.log('login response: ', response);
					const token = response.idToken;
					const expiresIn = response.expires;
					if (token && expiresIn) {
						this.tokenService.setToken(token, expiresIn);
						const expires: number = response.expires;
						this.storeTokenExpiration(expires);
					}
					if (response.status === 'LOGGEDIN') {
						this.isAuthedSubject.next(true);
						this.statusSubject.next('AUTHED')
						console.log('User Authenticated');
					}
					if (response.status === 'ERRORNOUSER') {
						this.isAuthedSubject.next(false);
						this.statusSubject.next('NO_USER')
						console.log('No User Found');

					}
					if (response.status === 'ERRORPASS') {
						this.isAuthedSubject.next(false);
						this.statusSubject.next('INCORRECT_PASS')
						console.log('Incorrect Password');
					}
				}),
				catchError(err => {
					console.error('Error authenticating user', err);
					return of(false);
				})
			);
	}

	login(credentials): Observable<any> {
		return this.authenticateUser(credentials).pipe(
			switchMap(authResult => {
				console.log('login() authResult: ', authResult);
				return of(authResult);
			})
		);
	}

	logout(): void{
		this.tokenService.removeToken();
		this.isAuthedSubject.next(false);

	}
}
