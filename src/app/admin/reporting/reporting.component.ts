import { Component, OnDestroy, OnInit } from '@angular/core';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-reporting',
	templateUrl: './reporting.component.html',
	styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit, OnDestroy {
	currentBreakpoint: string = '';
	gameCode: string = '';

	constructor(
		private handActionsHttp: HandActionsHttpService,
		private breakpointService: BreakpointService
	) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$.subscribe(breakpoint => {
			this.currentBreakpoint = breakpoint;
		});
		this.gameCode = localStorage.getItem('GAME_CODE');
	}

  downloadEBU() {
		console.log('download ebu invoked');
		// if (this.ebuDownloadForm.valid) {
		const ebuValues = {
			gameCode: this.gameCode,
			type: 'EBUP2PXML',
			action: 'download'
		};
		console.log('ebu download values: ', ebuValues);
		this.handActionsHttp.fetchEBU(ebuValues).subscribe({
			next: (response: Blob) => {
				if (response) {
					const blob = new Blob([response], { type: 'application/xml' });
					saveAs(blob, `${this.gameCode}.xml`);
				}
			},
			error: error => {
				console.error('error fetching EBU', error);
			}
		});
		// }
	}
	ngOnDestroy(): void {}
}
