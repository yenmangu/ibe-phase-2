import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { ChargeCodeInterface, chargeCodes } from 'src/app/shared/data/charge-code';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-hand-actions',
	templateUrl: './hand-actions.component.html',
	styleUrls: ['./hand-actions.component.scss']
})
export class HandActionsComponent implements OnInit, AfterViewInit {
	currentBreakpoint: string = '';
	// Tab Control
	selectedTab: string = 'movement';
	gameCode: string = '';
	dirKey: string = '';
	constData: any;

	// Movement
	movementInput: string = '';

	// Masterpoints
	masterpointsForm: FormGroup;
	masterPointsScales = [
		{ display: 'Club', value: 'Club' },
		{ display: 'District', value: 'District' },
		{ display: 'County', value: 'County' },
		{ display: 'Regional', value: 'Regional' },
		{ display: 'National', value: 'National' },
		{ display: 'Individual', value: 'Individual' },
		{ display: 'County assoc.', value: 'County assoc.' },
		{ display: 'Club qualif.', value: 'Club quali-final' },
		{ display: 'District qualif.', value: 'District quali-final' },
		{ display: 'County qualif.', value: 'County quali-final' },
		{ display: 'Regional qualif', value: 'Regional quali-final' },
		{ display: 'National qualif', value: 'National quali-final' },
		{ display: 'Special qualif', value: 'Special quali-final' }
	];

	// HTML/PDF
	htmlPdfForm: FormGroup;

	// EBU
	ebuDownloadForm: FormGroup;
	ebuUploadForm: FormGroup;
	chargeCodes: ChargeCodeInterface[] = chargeCodes;

	// ECATS
	ecatsForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private handActionsHttp: HandActionsHttpService,
		private breakpointService: BreakpointService,
		private dialog: MatDialog,
		private snackbar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$.subscribe(
			breakpoint => (this.currentBreakpoint = breakpoint)
		);
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.buildMasterpointsForm();
		this.buildHtmlForm();
		this.buildEbuForm();
		this.constData = {
			gameCode: this.gameCode
		};
	}

	ngAfterViewInit(): void {}

	selectTab(tabName) {
		setTimeout(() => {
			this.selectedTab = tabName;
		}, 0);
	}

	showMasterpoints() {
		const masterpoints = this.ebuDownloadForm.get('masterpoints').value;
		if (masterpoints) {
			return true;
		} else {
			return false;
		}
	}

	buildMasterpointsForm() {
		this.masterpointsForm = this.fb.group({
			eventName: [''],
			directorName: ['', [Validators.pattern('^[a-zA-Z]+$')]],
			scorerName: [''],
			masterpoints: false,
			bridgeWebsAccount: [''],
			password: ['']
		});
	}

	getMovement(options) {
		const data = {
			gameCode: this.gameCode,
			title: this.movementInput
		};

		console.log('data in getMovement: ', data);

		this.handActionsHttp.fetchMovement(data).subscribe({
			next: (response: Blob) => {
				if (response) {
					console.log('response: ', response);

					const blob = new Blob([response], { type: 'application/pdf' });
					const blobURL = window.URL.createObjectURL(blob);
					if (options.preview) {
						window.open(blobURL);
					} else {
						const link = document.createElement('a');
						link.href = blobURL;
						link.download = 'movement.pdf';
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					}
				}
			},
			error: error => {
				this.snackbar.open(
					'Error creating PDF, please try again. If the error persists please contact admin@ibescore.com',
					'Dismiss'
				);
				console.error('Error creating PDF: ', error);
			}
		});
	}

	buildHtmlForm() {
		this.htmlPdfForm = this.fb.group({
			eventName: ['', [Validators.required]],
			directorName: ['', [Validators.required]],
			comments: [''],
			fileType: [''],
			rankings: [false],
			matrix: [false],
			hands: [false],
			scorecards: [false]
		});
		this.htmlPdfForm.patchValue({
			fileType: 'html'
		});
	}

	buildEbuForm() {
		this.ebuDownloadForm = this.fb.group({
			chargeCode: ['10'],
			masterpoints: [false],
			mpType: [''],
			mpScale: ['club'],
			mpWon: [false]
		});
		this.ebuUploadForm = this.fb.group({
			eventName: [''],
			directorName: [''],
			clubName: [''],
			clubId: [''],
			password: [''],
			comment: ['']
		});
	}

	buildEcatsForm() {
		this.ecatsForm = this.fb.group({
			sessionId: [''],
			clubName: [''],
			fedId: [''],
			country: [''],
			county: [''],
			town: [''],
			email: [''],
			phone: ['', [Validators.pattern('^[0-9]+$')]],
			contactName: ['', [Validators.pattern('^[a-zA-Z]+$')]],
			eventName: [''],
			fax: ['']
		});
	}

	previewPdf() {}

	downloadPdf() {}

	uploadBridgeWebs() {
		if (this.masterpointsForm.valid) {
			const values = { ...this.masterpointsForm.value };
		}
	}

	downloadBridgeWebs() {}

	handleHtmlPdf(options) {
		if (this.htmlPdfForm.valid) {
			const fileType = this.htmlPdfForm.get('fileType').value;
			const values = {
				...this.htmlPdfForm.value,
				gameCode: this.gameCode,
				format: 'pdf'
			};
			console.log('payload: ', values);
			this.handActionsHttp.htmlPDF(values).subscribe({
				next: (response: Blob) => {
					console.log('response: ', response);
					console.log('file type: ', fileType);

					const blob = new Blob([response], {
						type: fileType === 'pdf' ? 'application/pdf' : 'text/html'
					});
					const blobURL = window.URL.createObjectURL(blob);
					if (options.preview) {
						window.open(blobURL);
					} else if (options.download) {
						const link = document.createElement('a');
						link.href = blobURL;
						link.download = `${this.gameCode}.${fileType}`;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						URL.revokeObjectURL(link.href);
					}
				},
				error: error => {
					console.error('Error fetching file: ', error);
				}
			});
		}
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
	uploadEBU() {
		if (this.ebuUploadForm.valid) {
			const values = {
				...this.ebuUploadForm.value,
				gameCode: this.gameCode,
				type: 'EBU',
				action: 'upload'
			};

			console.log('EBU Form Values: ', values);

			this.handActionsHttp.sendEBU(values).subscribe({
				next: response => {
					console.log('response from sending ebu: ', response);
				}
			});
		}
	}
	uploadEcats() {
		if (this.ecatsForm.valid) {
			const values = { ...this.ecatsForm.value };
		}
	}
	downloadEcats() {
		if (this.ecatsForm.valid) {
			const values = { ...this.ecatsForm.value };
		}
	}

	deleteHand() {
		const dialogRef = this.dialog.open(DeleteDialogComponent, {
			width: '360px'
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.handActionsHttp
					.deleteHandRecord({ gameCode: this.gameCode })
					.subscribe({
						next: response => {
							if (response.success === true) {
								this.snackbar.open(
									'Hand config deleted. please refresh the database to see the latest changes',
									'Dismiss'
								);
							}
						}
					});
			}
		});
	}
}
