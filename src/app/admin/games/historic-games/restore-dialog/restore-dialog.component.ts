import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/shared/services/http.service';
@Component({
	selector: 'app-restore-dialog',
	templateUrl: './restore-dialog.component.html',
	styleUrls: ['./restore-dialog.component.scss']
})
export class RestoreDialogComponent implements OnInit {
	zip: string = '';
	gameCode: string = '';
	dirKey: string = '';

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<RestoreDialogComponent>,
		private httpService: HttpService
	) {}

	ngOnInit(): void {
		this.zip = this.data.zip;
		this.gameCode = this.data.gameCode;
		this.dirKey = this.data.dirKey;
	}

	onClose() {
		this.dialogRef.close(false);
	}
	onRestore() {
		const data = { zip: this.zip, gameCode: this.gameCode, dirKey: this.dirKey };
		this.httpService.restoreHistoricGame(data);
	}
}
