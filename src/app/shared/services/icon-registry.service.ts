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
				domain + svgUrlBase + 'card-suits/spades.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'hearts-card',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'card-suits/hearts.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'clubs-card',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'card-suits/clubs.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'diamonds-card',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'card-suits/diamonds.svg'
			)
		);

		// Menu Icons
		//
		//
		this._matIconRegistry.addSvgIcon(
			'account-settings',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/account_settings.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'admin-tools',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/admin_tools.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'current-session',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/current_session.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'database-admin',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/database_admin.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'game-code-settings',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/game_code_settings.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'hand-records',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/hand_records.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'historic-games',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/historic_games.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'home',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/house_solid.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'menu',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/menu_icon.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'player-db',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/player_db.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'reports',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/reports.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'rotate',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/rotate.svg'
			)
		);
		this._matIconRegistry.addSvgIcon(
			'activity',
			this._domSanitizer.bypassSecurityTrustResourceUrl(
				domain + svgUrlBase + 'menu_icons/eye-solid.svg'
			)
		);
	}
}
