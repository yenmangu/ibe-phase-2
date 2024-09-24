import {
	Component,
	ElementRef,
	OnInit,
	ViewChild,
	HostListener,
	AfterViewInit
} from '@angular/core';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';

@Component({
	selector: 'app-user-actions',
	templateUrl: './user-actions.component.html',
	styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent implements OnInit, AfterViewInit {
	@ViewChild('iframeElement') iframeElement!: ElementRef;

	userActionsSrc: string = 'https://user-actions.ibescore.com';
	windowOrigin: string = 'http://192.168.68.100:4200';
	gameCode: any;

	constructor(private userDetails: UserDetailsService) {}
	@HostListener('window:message', ['$event'])
	onMessage(event: MessageEvent) {
		if (!event || event == undefined) return;

		if (event.origin !== this.userActionsSrc) {
			console.log('Event: ', event);
			console.warn('Untrusted origin: ', event.origin);
			return;
		}
		console.log('Message receiver invoked');
		if (!this.checkMessage) {
			return;
		} else {
			if (!this.iframeElement) {
				console.warn('No iframeElement detected');
				return;
			} else {
				console.log('Message: ', event);

				const frameHeight = event.data.frameHeight;
				this.setFrameHeight(frameHeight);
			}
		}
	}

	ngOnInit(): void {
		this.userDetails.getGameCodeSubject().subscribe({
			next: value => {
				this.gameCode = value;
			},
			error: error => {
				console.error('error retrieving Game Code');
			}
		});
	}

	ngAfterViewInit(): void {
		if (!this.iframeElement) {
			console.warn('No iframeElement loaded');
			return;
		}
		const iframe: HTMLIFrameElement = this.iframeElement.nativeElement;
		iframe.addEventListener('load', () => {
			console.log('Iframe Loaded');
			this.sendMessage(true);
		});
	}

	private setFrameHeight(height: number) {
		console.log('Setting Frame Height: ', height);

		this.iframeElement.nativeElement.style.height = height + 30 + 'px';
	}

	private checkMessage(event: MessageEvent) {
		if (!event.data && !event.data.frameHeight) {
			return false;
		} else return true;
	}

	private sendMessage(initial: boolean): void {
		console.log(
			'Send Message invoked with initial? : ',
			initial ? 'true' : 'false'
		);

		if (!this.iframeElement) {
			console.log('No iframeElement found');

			return;
		}
		const iframeWindow = this.iframeElement.nativeElement.contentWindow;
		console.log('iframe Window found');

		let data: any = {};
		if (initial) {
			data = {
				appOrigin: window.origin,
				gamecode: this.gameCode
			};
		} else {
			data = { gameCode: this.gameCode };
		}
		console.log('Posting message with: ', data);

		iframeWindow?.postMessage(data, this.userActionsSrc);
	}
}
