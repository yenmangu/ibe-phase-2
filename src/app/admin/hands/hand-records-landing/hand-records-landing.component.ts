import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
	selector: 'app-hand-records-landing',
	templateUrl: './hand-records-landing.component.html',
	styleUrls: ['./hand-records-landing.component.scss']
})
export class HandRecordsLandingComponent implements OnInit {
	filesEmitted: File[] = [];
	uploadSuccess: boolean = false;
	gameCode: string = '';
	dirKey: string = '';
	downloaded: any;
	downloadError: boolean = false;
	isLoading: boolean = false;
	// turn off when finished
	selectedTabIndex = 1;

	constructor(
		private handActions: HandActionsHttpService,
		private snackbar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirKey = localStorage.getItem('DIR_KEY');
	}

	handleFiles(files: File[]) {
		console.log('files received in parent: ', files);
		this.isLoading = true;
		if (files.length > 0) {
			this.handActions.uploadHand(files, this.gameCode).subscribe({
				next: response => {
					if (response.success) {
						console.log('upload success: ', response.success);

						this.uploadSuccess = true;
						this.isLoading = false;
					} else {
						this.uploadSuccess = false;
					}
				},
				error: error => {
					console.error('Error uploading files: ', error);
					this.isLoading = false;
					this.uploadSuccess = false;
				}
			});
		}
	}

	resetStatus() {
		this.isLoading = false;
		this.uploadSuccess = false;
	}

	handleDownload() {
		this.isLoading = true;
		const data = { gameCode: this.gameCode, dirKey: this.dirKey };
		this.handActions.downloadHand(data).subscribe({
			next: (response: Blob) => {
				if (response) {
					const mimeType = 'application/octet-stream';
					const blob = new Blob([response], { type: mimeType });
					const fileName = `${this.gameCode}.pbn`;
					const file = new File([blob], fileName);
					const downloadLink = document.createElement('a');
					downloadLink.href = URL.createObjectURL(blob);
					downloadLink.setAttribute('download', fileName);
					document.body.appendChild(downloadLink);
					downloadLink.click();
					document.body.removeChild(downloadLink);
					URL.revokeObjectURL(downloadLink.href);
					this.isLoading = false;
				} else {
					this.isLoading = false;
					this.downloadError = true;
				}
			},
			error: error => {
				this.snackbar.open(
					'Error downloading deal file, please try again. If the error persists please contact "..."',
					'Dismiss'
				);
				console.error('Error creating download: ', error);
				this.isLoading = false;
			}
		});
	}

	tryAgain() {
		if (this.downloadError) {
			this.downloadError = false;
		}
	}
}
