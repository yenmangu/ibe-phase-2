import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { RevisedProcessCurrentDataService } from '../../games/services/revised-process-current-data.service';
import jsPDF from 'jspdf';
import * as html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { DeviceService } from '../../services/device.service';
import { HtmlPdfService } from '../../services/html-pdf.service';
@Component({
	selector: 'app-html-pdf-dialog',
	templateUrl: './html-pdf-dialog.component.html',
	// templateUrl: './html.html',
	styleUrls: ['./html-pdf-dialog.component.scss']
})
export class HtmlPdfDialogComponent implements OnInit {
	htmlPdfForm: FormGroup;
	gameCode: string = '';
	dirKey: string = '';
	eventName: string = '';
	formValid: boolean = false;
	public newTab: Window | null = null;
	constructor(
		private fb: FormBuilder,
		private handActionsHttp: HandActionsHttpService,
		private dialogRef: MatDialogRef<HtmlPdfDialogComponent>,
		private currentDataService: RevisedProcessCurrentDataService,
		private deviceService: DeviceService,
		private htmlPdfService: HtmlPdfService
	) {}

	async ngOnInit(): Promise<void> {
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.buildHtmlForm();
		this.eventName = await this.getEventName();
		if (this.eventName) {
			this.htmlPdfForm.patchValue({ eventName: this.eventName });
		}
	}

	async getEventName(): Promise<string> {
		try {
			return this.currentDataService.getSingleEventName();
		} catch (error) {
			console.log('Error retrieving eventName');
			return '';
		}
	}

	buildHtmlForm() {
		console.log('Building form');

		this.htmlPdfForm = this.fb.group({
			eventName: ['', [Validators.required]],
			directorName: ['', [Validators.required]],
			comments: [''],
			// fileType: [''],
			rankings: [false],
			matrix: [false],
			hands: [false],
			scorecards: [false]
		});
		// this.htmlPdfForm.patchValue({
		// 	fileType: 'html'
		// });
	}

	handleRequest(options) {
		if (options.preview) {
			if (this.checkIosDevice()) {
				this.newTab = window.open();
				options = { ...options, ios: true };
			}
		}

		this.handleHtmlPdf(options);
	}

	handleHtmlPdf(options) {
		if (this.htmlPdfForm.valid) {
			// const fileType = this.htmlPdfForm.get('fileType').value;
			const fileType = 'html';
			const values = {
				...this.htmlPdfForm.value,
				gameCode: this.gameCode,
				fileType: 'html'
			};
			console.log('payload: ', values);
			this.handActionsHttp.htmlPDF(values).subscribe({
				next: (response: Blob) => {
					// console.log('response: ', response);
					// console.log('file type: ', fileType);
					const blob = new Blob([response], {
						// type: fileType === 'pdf' ? 'application/pdf' : 'text/html'
						type: 'text/html'
					});
					if (options.preview) {
						this.previewBlob(blob, options);
					} else if (options.download) {
						this.downloadBlob(blob);
					}
				},
				error: error => {
					console.error('Error fetching file: ', error);
				}
			});
		}
	}

	previewBlob(blob: Blob, options) {
		if (options.ios) {
			if (this.newTab) {
				this.htmlPdfService.handleIos(blob, this.newTab);
			} else {
				console.error('Error: Failed to open new tab / window');
			}
		} else {
			this.htmlPdfService.handleOtherDevice(blob);
		}
	}

	downloadBlob(blob: Blob) {
		this.htmlPdfService.handleDownload(blob, this.gameCode);
	}

	public checkIosDevice(): boolean {
		return this.deviceService.isIos();
	}

	closeDialog() {
		if (this.dialogRef) {
			this.dialogRef.close();
		}
	}
}
