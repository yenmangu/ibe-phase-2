import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../auth/services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private tokenService: TokenService) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		if (request.url.includes('/webhook/bulk-convert')) {
			return next.handle(request);
		}
		const token = this.tokenService.getToken();

		if (token) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`
				}
			});
		}
		return next.handle(request);
	}
}
