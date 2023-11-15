import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
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

	constructor(private handActions: HandActionsHttpService) {}

	ngOnInit(): void {
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirKey = localStorage.getItem('DIR_KEY');
	}

	handleFiles(files: File[]) {
		console.log('files received in parent: ', files);
		if (files.length > 0) {
			this.handActions.uploadHand(files).subscribe({
				next: response => {
					if (response.success) {
						this.uploadSuccess = true;
					} else {
						this.uploadSuccess = false;
					}
				},
				error: error => {
					console.error('Error uploading files: ', error);
					this.uploadSuccess = false;
				}
			});
		}
	}

	handleDownload() {
		const data = { gameCode: this.gameCode, dirKey: this.dirKey };
		this.handActions.downloadHand(data).subscribe({
			next: response => {
				if (response.success) {
					this.downloaded = response.data;
				} else {
					this.downloadError = true;
				}
			},
			error: error => {
				console.error('Error downloading latest hand file: ', error);
				this.downloadError = true;
			}
		});
	}

	tryAgain() {
		if (this.downloadError) {
			this.downloadError = false;
		}
	}
}
