import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-delete-dialog',
	templateUrl: './delete-dialog.component.html',
	styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {
	constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>) {}

	confirmDelete() {
		this.dialogRef.close(true);
	}
}
