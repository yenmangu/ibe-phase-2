import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { environment } from 'src/environments/environment';
@Component({
	selector: 'app-welcome-screen',
	templateUrl: './welcome-screen.component.html',
	styleUrls: ['./welcome-screen.component.scss']
})
export class WelcomeScreenComponent implements OnInit {
	currentBreakpoint: string = '';
	newLayout: boolean = false;
	wpOrigin: string = 'https://ibescore.com';
	local: boolean = false;
	dev: boolean = false;

	constructor(
		private bp: BreakpointService,
		private router: Router,
		private route: ActivatedRoute
	) {
		if (environment.LOCAL) {
			this.local = true;
			this.dev = false;
		} else {
			if (window.origin.includes('dev')) {
				this.local = false;
				this.dev = true;
			} else {
				this.dev = false;
			}
		}

		console.log('Origin in angular app: ', window.origin);
	}

	@HostListener('window:message', ['$event'])
	onMessage(event: MessageEvent) {
		if (!event.data || typeof event.data.target !== 'string') {
			// console.log('not the message we want');

			return;
		}
		console.log('Message Receiver invoked');
		if (event.origin !== this.wpOrigin) {
			console.warn('Untrusted origin: ', event.origin);
			return;
		}
		console.log('Event : ', event);

		console.log('Received message from origin: ', event.origin);

		const path = this.getPath(event.data.target);
		this.router.navigate([`/admin/${path}`], { relativeTo: this.route });
	}

	private getPath(target) {
		switch (target) {
			case 'gameCodeSettings':
				return 'game-setup';
			case 'playerDatabase':
				return 'player-database';
			case 'currentSession':
				return 'games';
			case 'handRecords':
				return 'hand-records';
			case 'reports':
				return 'reporting';
			case 'accountSettings':
				return 'account';
			case 'databaseAdmin':
				return 'database-admin';
			case 'historicGames':
				return 'historic-games';
			case 'adminTools':
				return 'admin-tools';
			default:
				return 'welcome-members';
		}
	}
	ngOnInit(): void {
		console.log('Envs: ', { local: this.local, dev: this.dev });
		this.bp.currentBreakpoint$.subscribe(bp => {
			this.currentBreakpoint = bp;
		});
	}
}
