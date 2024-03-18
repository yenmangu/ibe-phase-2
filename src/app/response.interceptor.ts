import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse
} from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
	constructor() {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					const headerObject: any = {};

					event.headers.keys().forEach(key => {
						// headerObject[key] = event.headers.get(key);
						event.headers.get(key);
					});
				}
				return event;
			})
		);
	}
}
