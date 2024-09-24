import { Pipe, PipeTransform } from '@angular/core';
import {
	DomSanitizer,
	SafeHtml,
	SafeScript,
	SafeStyle,
	SafeUrl,
	SafeResourceUrl
} from '@angular/platform-browser';

@Pipe({
	name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
	constructor(protected _sanitizer: DomSanitizer) {}
	transform(
		value: string,
		type: string
	): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
		console.log('SafeUrlPipe value:', value); // Log the value

		switch (type) {
			case 'html':
				return this._sanitizer.bypassSecurityTrustHtml(value);
			case 'style':
				return this._sanitizer.bypassSecurityTrustStyle(value);
			case 'script':
				return this._sanitizer.bypassSecurityTrustScript(value);
			case 'url':
				return this._sanitizer.bypassSecurityTrustUrl(value);
			case 'resourceUrl':
				return this._sanitizer.bypassSecurityTrustResourceUrl(value);
			default:
				return this._sanitizer.bypassSecurityTrustHtml(value);
		}
	}
}
