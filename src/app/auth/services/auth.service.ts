import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
	BehaviorSubject,
	Observable,
	of,
	switchMap,
	tap,
	map,
	catchError,
	Subject
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { DateTime } from 'luxon';
import { TokenService } from './token.service';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { DataService } from 'src/app/admin/games/services/data.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private isAuthedSubject = new BehaviorSubject<boolean>(false);
	private statusSubject = new BehaviorSubject<any>('');
	private responseJSONSubject = new BehaviorSubject<any>({});
	responseJSON$ = this.responseJSONSubject.asObservable();
	destroy$ = new Subject<void>();
	destroySubject = this.destroy$.asObservable();

	private _authed: boolean = false;
	private userExist: boolean = false;
	private apiUrl: string = environment.API_URL;
	private tokenKey: any = null;

	constructor(
		private http: HttpClient,
		private router: Router,
		private tokenService: TokenService,
		private sharedDataService: SharedDataService,
		private dataService: DataService,
		private userDetailsService: UserDetailsService
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
		return this.statusSubject.asObservable();
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
					const directorId = response.directorId;
					if (token && expiresIn) {
						this.tokenService.setToken(token, expiresIn);
						const expires: number = response.expires;
						this.storeTokenExpiration(expires);
					}
					if (response.status === 'LOGGEDIN') {
						this.isAuthedSubject.next(true);
						this.statusSubject.next('AUTHED');
						this.responseJSONSubject.next(response.json);
						localStorage.setItem('DIRECTOR_ID', directorId);

						console.log('User Authenticated');
					}
				}),
				catchError(err => {
					console.error('Error authenticating user', err);
					console.log(err.error);
					if (
						(err.error && err.error.status === 'ERRORNOUSER') ||
						err.error.status === 'ERRORPASS'
					) {
						this.isAuthedSubject.next(false);
						if (err.error.status === 'ERRORNOUSER') {
							this.statusSubject.next('NO_USER');
						}
						if (err.error.status === 'ERRORPASS') {
							this.statusSubject.next('PASS_ERROR');
						} else {
							this.statusSubject.next(undefined);
						}
					}
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

	logout(): void {
		this.dataService.deleteIndexedDBDatabase();
		// this.sharedDataService.clearAll();`
		// this.userDetailsService.clearAllSubjects();
		this.tokenService.removeToken();
		this.isAuthedSubject.next(false);
		this.userDetailsService.updateLoggedIn(false);
		localStorage.clear();
		// this.isAuthedSubject.complete()
		console.log('User logged out successfully');
		this.router.navigate(['/home']);
		location.reload();
	}

	updateUserDetails(details) {
		if (details.newKey) {
			const newKey = details.newKey;
			this.userDetailsService.updateDirectorKey(newKey);
		}
		if (details.newEmail) {
			const newEmail = details.newEmail;
			this.userDetailsService.updateEmail(newEmail);
		}
	}
}
