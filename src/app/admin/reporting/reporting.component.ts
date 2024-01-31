import { Component, OnDestroy, OnInit } from '@angular/core';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HtmlPdfDialogComponent } from './html-pdf-dialog/html-pdf-dialog.component';

@Component({
	selector: 'app-reporting',
	templateUrl: './reporting.component.html',
	styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit, OnDestroy {
	currentBreakpoint: string = '';
	gameCode: string = '';
	bridgewebsForm: FormGroup;
	bridgeWebsMasterPoints: boolean = false;

	constructor(
		private handActionsHttp: HandActionsHttpService,
		private breakpointService: BreakpointService,
		private fb: FormBuilder,
		private snackbar: MatSnackBar,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$.subscribe(breakpoint => {
			this.currentBreakpoint = breakpoint;
		});
		this.gameCode = localStorage.getItem('GAME_CODE');
		// this.buildBridgeWebsForm();
		// this.bridgewebsForm.get('masterpoints').valueChanges.subscribe(value => {
		// 	this.bridgeWebsMasterPoints = value;
		// });
	}

	// buildBridgeWebsForm() {
	// 	this.bridgewebsForm = this.fb.group({
	// 		eventName: [''],
	// 		directorName: ['', [Validators.pattern('^[a-zA-Z]+$')]],
	// 		scorerName: [''],
	// 		bridgeWebsAccount: [''],
	// 		masterpoints: [false],
	// 		masterpointsMatchWon: [false],
	// 		password: ['']
	// 	});
	// }

	uploadBridgeWebs() {}
	downloadBridgeWebs() {
		console.log('download bridgewebs invoked');
		const payload = { gameCode: this.gameCode };
		this.handActionsHttp.downloadBridgeWebs(payload).subscribe({
			next: (response: Blob) => {
				if (response) {
					const blob = new Blob([response], { type: 'text/csv' });
					saveAs(blob, `${this.gameCode}.csv`);
				}
			},
			error: error => {
				console.error('Error fetching bridgewebs CSV');
				this.snackbar.open(
					'Error fetching CSV data, please try again. If the issue persists, please contact admin@ibescore.com',
					'Dismiss'
				);
			}
		});
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
				this.snackbar.open(
					'Error fetching XML data, please try again. If the issue persists, please contact admin@ibescore.com',
					'Dismiss'
				);
			}
		});
		// }
	}

	openHtmlPdf() {
		this.dialog
			.open(HtmlPdfDialogComponent, { width: '400px' })
			.afterClosed()
			.subscribe();
	}
	ngOnDestroy(): void {}
}
