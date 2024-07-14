import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '../../../../shared/services/http.service';
@Component({
	selector: 'app-historic-games-dialog',
	templateUrl: './historic-games-dialog.component.html',
	styleUrls: ['./historic-games-dialog.component.scss']
})
export class HistoricGamesDialogComponent implements OnInit {
	zip: string = '';
	gameCode: string = '';
	dirKey: string = '';

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<HistoricGamesDialogComponent>,
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
		this.dialogRef.close(true)
	}
}
