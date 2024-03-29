import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../../../shared/custom-snackbar/custom-snackbar.component';

@Component({
	selector: 'app-import-export',
	templateUrl: './import-export.component.html',
	styleUrls: ['./import-export.component.scss']
})
export class ImportExportComponent implements OnInit {
	currentBreakpoint: string = '';
	hide: boolean = true;
	// bridgeWebs
	bwUpdateForm: FormGroup;
	bwDownloadForm: FormGroup;
	importDiskForm: FormGroup;
	IdNumbersForm: FormGroup;

	selectedFile: any[] = [];
	fileList: any[] = [];

	filesDetected: boolean = false;
	uploadDetected: boolean = false;

	gameCode: string = '';
	dirKey: string = '';

	constructor(
		private fb: FormBuilder,
		private breakpointService: BreakpointService,
		private httpService: HttpService,
		private snackbar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$.subscribe(bp => {
			this.currentBreakpoint = bp;
		});
		this.buildBwUpdateFromForm();
		this.buildBwDownloadForm();
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirKey = localStorage.getItem('DIR_KEY');
		
	}

	openSnackbar(message: string, noContact?, error?): void {
		this.snackbar.openFromComponent(CustomSnackbarComponent, {
			data: { message, error, noContact }
		});
	}

	onFileListChange(files: any[]) {
		this.fileList = files;
		console.log('Import-Export component: ', this.fileList);
	}

	private buildBwUpdateFromForm(): void {
		this.bwUpdateForm = this.fb.group({
			contactInfo: [false],
			excludePlayers: [false],
			bwAccount: ['', [Validators.required]],
			bwPass: ['', [Validators.required]]
		});
	}

	private buildBwDownloadForm(): void {
		this.bwDownloadForm = this.fb.group({
			bwAccount: ['', [Validators.required]],
			bwPass: ['', [Validators.required]]
		});
	}

	public bridgeWebsUpdateFrom() {
		let formData;
		if (this.bwUpdateForm.valid) {
			formData = { ...this.bwUpdateForm.value };
			// console.log('FormData: ', formData);
		}
		const data = { gameCode: this.gameCode, dirKey: this.dirKey, formData };

		this.httpService.dbBwFrom(data).subscribe({
			next: response => {
				if (response.success) {
					this.snackbar.open(
						'Success updating database from BridgeWebs. Please refresh the database to see the latest changes.',
						'Dismiss'
					);
				} else if (response.error) {
					this.openSnackbar(
						'Error updating database from BridgeWebs.',
						true,
						response.error
					);
				}
			},
			error: error => {
				this.openSnackbar(`Error updating from BridgeWebs. `);
			}
		});
	}
	public bridgeWebsDownload() {
		if (this.bwDownloadForm.valid) {
			const formData = { ...this.bwDownloadForm.value };
		}
	}
	public onDatabaseExport() {
		this.exportPlayerDb();
	}

	private exportPlayerDb() {
		const data = { gameCode: this.gameCode, dirKey: this.dirKey };
		this.httpService.exportPlayerDB(data).subscribe({
			next: (response: { filename: string; fileBlob: Blob }) => {
				console.log('Filename');

				const blob = new Blob([response.fileBlob], { type: 'application/xml' });
				const blobURL = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = blobURL;
				link.download = response.filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			},
			error: error => {
				this.openSnackbar('Error generating the XML file.');
			}
		});
	}
}
