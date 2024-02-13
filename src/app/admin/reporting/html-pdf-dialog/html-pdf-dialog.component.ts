import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { RevisedProcessCurrentDataService } from '../../games/services/revised-process-current-data.service';

@Component({
	selector: 'app-html-pdf-dialog',
	templateUrl: './html-pdf-dialog.component.html',
	styleUrls: ['./html-pdf-dialog.component.scss']
})
export class HtmlPdfDialogComponent implements OnInit {
	htmlPdfForm: FormGroup;
	gameCode: string = '';
	dirKey: string = '';
	eventName: string = '';
	constructor(
		private fb: FormBuilder,
		private handActionsHttp: HandActionsHttpService,
		private dialogRef: MatDialogRef<HtmlPdfDialogComponent>,
		private sharedDataService: SharedDataService,
		private currentDataService: RevisedProcessCurrentDataService
	) {}

	ngOnInit(): void {
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.buildHtmlForm();
		this.getEventName();
		// this.buildHtmlForm();
	}

	async getEventName() {
		try {
			const eventName = await this.currentDataService.getSingleEventName();
			if (eventName) {
				this.eventName = eventName;
			} else {
				this.eventName = '';
			}
			this.htmlPdfForm.patchValue({
				eventName: this.eventName
			});
		} catch (error) {
			console.log('Error retrieving eventName');
		}
		// const eventName = this.processCurrentDataService.getData()
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
					// console.log('response: ', response);
					// console.log('file type: ', fileType);

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
	closeDialog() {
		this.dialogRef.close();
	}
}
