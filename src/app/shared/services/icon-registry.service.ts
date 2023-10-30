import { Injectable, OnInit, Inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class IconRegistryService {
	constructor(
		private _matIconRegistry: MatIconRegistry,
		private _domSanitizer: DomSanitizer,
		@Inject(PLATFORM_ID) private _platformId: string
	) {
		const svgUrlBase = 'assets/images/icons/';
		const domain = isPlatformServer(_platformId) ? 'https://localhost:4200/' : '';

		this._matIconRegistry.addSvgIcon(
			'upload-download',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'upload-and-download-from-the-cloud.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'sort',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'sort.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'x',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'x.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'spades-card',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'spades.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'hearts-card',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'hearts.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'clubs-card',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'clubs.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'diamonds-card',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'diamonds.svg'
			)
		);
	}
}
