import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap, of, timer } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
	private timeout: any = null;
	private requestCount: number = 0;
	constructor() {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		if (this.requestCount === 0) {
			this.timeout = null;
		}
		this.requestCount++;

		// set delay of 50ms if ongoing request

		return of(null).pipe(
			switchMap(() => {
				if (this.timeout === null) {
					this.timeout = setTimeout(() => {
						this.timeout = null;
						this.requestCount--;
					}, 50);
					return next.handle(request);
				} else if (this.requestCount > 1) {
					return timer(50).pipe(switchMap(() => next.handle(request)));
				} else {
					return next.handle(request);
				}
			})
		);
	}
}
