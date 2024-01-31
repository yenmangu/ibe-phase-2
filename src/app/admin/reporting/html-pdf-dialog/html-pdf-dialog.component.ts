import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-html-pdf-dialog',
	templateUrl: './html-pdf-dialog.component.html',
	styleUrls: ['./html-pdf-dialog.component.scss']
})
export class HtmlPdfDialogComponent implements OnInit {
	htmlPdfForm: FormGroup;
	gameCode: string = '';
	dirKey: string = '';
	constructor(
		private fb: FormBuilder,
		private handActionsHttp: HandActionsHttpService,
		private dialogRef: MatDialogRef<HtmlPdfDialogComponent>
	) {}

	ngOnInit(): void {
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.buildHtmlForm();
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
	closeDialog() {
		this.dialogRef.close();
	}
}
