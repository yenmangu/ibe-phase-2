// import { Injectable } from '@angular/core';
// import {
// 	HttpClient,
// 	HttpHandler,
// 	HttpEvent,
// 	HttpRequest,
// 	HttpHeaders,
// 	HttpParams
// } from '@angular/common/http';
// import { ResponseInterceptor } from './response.interceptor';

// @Injectable({ providedIn: 'root' })
// export class BlobHttpClient extends HttpClient {
// 	constructor(handler: HttpHandler, private interceptor: ResponseInterceptor) {
// 		super(handler);
// 	}
// 	override request<R>(
// 		method: string | HttpRequest<any>,
// 		url?: string,
// 		options: {
// 			body?: any;
// 			headers?: HttpHeaders | { [header: string]: string | string[] };
// 			observe?: 'body';
// 			params?: HttpParams | { [param: string]: string | string[] };
// 			reportProgress?: boolean;
// 			responseType?: 'blob';
// 			withCredentials?: boolean;
// 			interceptors?: any[]; // Add this option
// 		} = {}
// 	) {
// 		if (
// 			options &&
// 			options.interceptors &&
// 			options.interceptors.indexOf(this.interceptor) === -1
// 		) {
// 			options.interceptors.push(this.interceptor);
// 		} else {
// 			options.interceptors = [this.interceptor];
// 		}
// 		return super.request(method,url,options)
// 	}

// }
