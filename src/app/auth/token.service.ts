import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, takeUntil, timer } from 'rxjs';
import { DateTime } from 'luxon';
@Injectable({
	providedIn: 'root'
})
export class TokenService {
	private tokenKey = 'auth_token';
	private tokenExpirationTime: number | null = null;
	private tokenExpirationTimes: number[] = [];
	private isTokenExpiredSubject = new BehaviorSubject<boolean>(false);

	constructor() {
		this.initTokenExpirationTimeCheck();
	}

	private initTokenExpirationTimeCheck(): void {
		timer(0, 1000) // Check every second
			.subscribe(() => {
				const now = DateTime.now().toMillis();
				const earliestExpiration = Math.min(...this.tokenExpirationTimes);
				const isExpired =
					earliestExpiration !== undefined && now >= earliestExpiration;
				this.isTokenExpiredSubject.next(isExpired);
			});
	}

	hasToken(): boolean {
		return !!this.getToken();
	}

	setToken(token: any, expiresIn: number): void {
		localStorage.setItem(this.tokenKey, token);
		const expirationTime = DateTime.now()
			.plus({ millisecond: expiresIn })
			.toMillis();
		this.tokenExpirationTimes.push(expirationTime);
		// this.initTokenExpirationTimeCheck();
	}

	getToken(): any | null {
		return localStorage.getItem(this.tokenKey);
	}

	removeToken(): void {
		localStorage.removeItem('auth_token');
	}

	isTokenExpired(): Observable<boolean> {
		return new Observable<boolean>(observer => {
			const now = DateTime.now().toMillis();
			const isExpired =
				this.tokenExpirationTime !== null && now >= this.tokenExpirationTime;
			observer.next(isExpired);
		});
	}
}
