import {
	Component,
	ElementRef,
	OnInit,
	OnDestroy,
	ViewChild,
	AfterViewInit,
	NgZone
} from '@angular/core';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { UserActionsDataService } from '../services/user-actions-data.service';
import { UserActionsHttpService } from '../services/user-actions-http.service';
import { UserActionsTableControlService } from '../services/user-actions-table-control.service';
import { UserActionsPdfService } from '../services/user-actions-pdf.service';
import {
	DeviceHistoryArray,
	QueryObject
} from 'src/app/shared/data/interfaces/query-object.ts';
import { UserActions } from 'src/app/shared/data/interfaces/user-action';

// type ButtonString = 'GO' | 'Fetching';
@Component({
	selector: 'app-user-actions',
	templateUrl: './user-actions.component.html',
	styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent implements OnInit, AfterViewInit {
	@ViewChild('contentBox', { static: true }) contentEl!: ElementRef;
	@ViewChild('canvas') canvas!: ElementRef;
	private resizeObserver!: ResizeObserver;
	private clickTimeout: any = null;
	private heightTimeout: any = null;
	private prevHeight: number = 0;
	private touchDetected: boolean = false;

	private gameCode: string = '';
	public fetchingData: boolean = false;
	public buttonString: 'GO' | 'Fetching' = 'GO';

	expectedOrigin: string = '';
	queryObject!: QueryObject;
	deviceHistoryArray: DeviceHistoryArray = [];
	requestSent: boolean = false;
	tableReady: boolean = false;
	uniqueDeviceList: string[] = [];
	filteredResults: UserActions = [];
	params: { gameCode: string; startFrom: number } = { gameCode: '', startFrom: 1 };
	errorDisplay: { display: boolean; message: string } = {
		display: false,
		message: ''
	};
	// Dev
	public dev = false;
	testParams: { gameCode: string; startFrom: number } = {
		gameCode: 'ponty',
		startFrom: 48
	};
	constructor(
		private el: ElementRef,
		private zone: NgZone,
		private userDetails: UserDetailsService,
		private data: UserActionsDataService,
		private http: UserActionsHttpService,
		private tableControls: UserActionsTableControlService,
		private pdf: UserActionsPdfService
	) {}

	ngOnInit(): void {
		this.userDetails.getGameCodeSubject().subscribe({
			next: value => {
				this.gameCode = value;
				this.params.gameCode = value;
			},
			error: error => {
				console.error('error retrieving Game Code');
			}
		});
	}
	ngAfterViewInit(): void {}

	private observeContentHeight(): void {
		if (this.contentEl) {
			this.zone.runOutsideAngular(() => {
				this.resizeObserver = new ResizeObserver(entries => {
					for (const entry of entries) {
						const newHeight = entry.contentRect.height;
						if (this.heightTimeout) clearTimeout(this.heightTimeout);
						this.heightTimeout = setTimeout(() => {
							this.zone.run(() => {
								if (newHeight !== this.prevHeight) {
									// this.sendHeight();
									this.prevHeight = newHeight;
								}
							});
							this.heightTimeout = null;
						}, 300);
					}
				});
			});
			this.resizeObserver.observe(this.contentEl.nativeElement);
		}
	}

	public handleClick(): void {
		if (this.touchDetected) {
			console.log('Touch detected');
			return;
		}
		if (this.clickTimeout) {
			console.log('Click timeout activated');

			return;
		}
		this.clickTimeout = setTimeout(() => {
			this.resetBools();

			const reqParams = {
				gameCode: this.params.gameCode,
				startFrom: this.params.startFrom.toString()
			};
			this.makeRequest(reqParams);
			this.clickTimeout = null;
		}, 300);

		// Test the service
	}

	handleTouchstart(event: TouchEvent) {
		this.touchDetected = true;
		if (this.clickTimeout) return;
		this.clickTimeout = setTimeout(() => {
			this.resetBools();
			const reqParams = {
				gameCode: this.params.gameCode,
				startFrom: this.params.startFrom.toString()
			};
			this.makeRequest(reqParams);
			this.clickTimeout = null;
		}, 300);
		// this.handleClick();
	}

	resetTouchDetected() {
		setTimeout(() => {
			if (this.touchDetected) this.touchDetected = false;
		}, 300);
	}

	private makeRequest(params) {
		this.fetchingData = true;
		this.buttonString = 'Fetching';
		console.log('Request invoked');

		this.requestSent = true;
		this.http.reqData(params).subscribe({
			next: async response => {
				await this.handleResponse(response.xml);
			},
			error: err => {
				this.handleError(err);
			}
		});
	}

	private async handleResponse(xml: string) {
		try {
			const result = await this.data.processData(xml);
			if (!result) {
				return;
			}
			this.queryObject = result;

			if (result.historyArray) {
				this.deviceHistoryArray = result.historyArray;
				this.tableReady = true;
				this.fetchingData = false;
				this.buttonString = 'GO';
				this.organiseFilter();
				this.tableReady = true;
			}
		} catch (error) {
			this.handleError(error);
		}
	}

	private handleError(error: any): void {
		this.errorDisplay.display = true;
		this.buttonString = 'GO';
		this.fetchingData = false;
		if (error.status && error.status === 500) {
			this.errorDisplay.message = 'Internal Server Error';
			return;
		}
		if (error.message === 'nonposint') {
			this.errorDisplay.message = 'Please provide a valid start from';
		}
		this.errorDisplay.message = error.message;
		console.error('Error: ', error);
	}

	private organiseFilter() {
		this.uniqueDeviceList = this.tableControls.populateFilter(
			this.queryObject.deviceColours
		);

		this.filteredResults = this.tableControls.filterResults(
			this.queryObject.actionHistory
		);
	}

	onDeviceSelect(event: Event) {
		const selectedDevice = (event.target as HTMLSelectElement).value;
		this.filteredResults = this.tableControls.filterResults(
			this.queryObject.actionHistory,
			selectedDevice
		);
	}

	private getHeight() {
		const el = this.contentEl.nativeElement;
		return new Promise<any>((resolve, reject) => {
			requestAnimationFrame(() => {
				el.style.display = 'none';
				el.offsetHeight;
				el.stye.display = 'block';
				const rect = el.getBoundingClientRect();
				resolve(rect.height);
			});
		});
	}

	private resetBools(): void {
		this.errorDisplay = { display: false, message: '' };
		this.requestSent = false;
		this.tableReady = false;
	}

	public handlePDF(): void {
		if (this.canvas) {
			this.pdf.downloadPDF(
				this.canvas.nativeElement,
				`${this.params.gameCode}-${this.queryObject.dateRange}.pdf`
			);
		}
	}

	public returnStringDate(action) {
		if (!action?.timeMeta) {
			return 'No Date Found';
		}
		const { epoch, format } = action.timeMeta;
		if (typeof epoch === 'string') {
			const epochNum = Number(epoch);
			return new Date(epochNum * 1000).toString();
		} else if (typeof epoch === 'number') {
			const time = new Date(epoch * 1000).toLocaleTimeString();
			return `${time}\t${format}`;
		} else return 'No Date Found';
	}

	// @HostListener('window:message', ['$event'])
	// onMessage(event: MessageEvent) {
	// 	if (!event || event == undefined) return;

	// 	const checked = this.checkMessage(event);
	// 	if (!checked || checked !== true) {
	// 		return;
	// 	} else {
	// 		console.log('Message receiver invoked');
	// 		if (event.origin !== this.userActionsSrc) {
	// 			// console.log('Event: ', event);
	// 			console.warn('Untrusted origin: ', event.origin);
	// 			return;
	// 		}
	// 		if (!this.iframeElement) {
	// 			console.warn('No iframeElement detected');
	// 			return;
	// 		} else {
	// 			console.log('Message: ', event);

	// 			const frameHeight = event.data.frameHeight;
	// 			this.setFrameHeight(frameHeight);
	// 		}
	// 	}
	// }

	// ngOnInit(): void {
	// 	this.userDetails.getGameCodeSubject().subscribe({
	// 		next: value => {
	// 			this.gameCode = value;
	// 		},
	// 		error: error => {
	// 			console.error('error retrieving Game Code');
	// 		}
	// 	});
	// }

	// ngAfterViewInit(): void {
	// 	if (!this.iframeElement) {
	// 		console.warn('No iframeElement loaded');
	// 		return;
	// 	}
	// 	const iframe: HTMLIFrameElement = this.iframeElement.nativeElement;
	// 	iframe.addEventListener('load', () => {
	// 		console.log('Iframe Loaded');
	// 		this.sendMessage(true);
	// 	});
	// }

	// private setFrameHeight(height: number) {
	// 	console.log('Setting Frame Height: ', height);

	// 	this.iframeElement.nativeElement.style.height = height + 30 + 'px';
	// }

	// private checkMessage(event: MessageEvent) {
	// 	if (!event.data.frameHeight) {
	// 		return false;
	// 	} else {
	// 		return true;
	// 	}
	// }

	// private sendMessage(initial: boolean): void {
	// 	console.log(
	// 		'Send Message invoked with initial? : ',
	// 		initial ? 'true' : 'false'
	// 	);

	// 	if (!this.iframeElement) {
	// 		console.log('No iframeElement found');

	// 		return;
	// 	}
	// 	const iframeWindow = this.iframeElement.nativeElement.contentWindow;
	// 	console.log('iframe Window found');

	// 	let data: any = {};
	// 	if (initial) {
	// 		data = {
	// 			appOrigin: window.origin,
	// 			gamecode: this.gameCode
	// 		};
	// 	} else {
	// 		data = { gameCode: this.gameCode };
	// 	}
	// 	console.log('Posting message with: ', data);

	// 	iframeWindow?.postMessage(data, this.userActionsSrc);
	// }
}
