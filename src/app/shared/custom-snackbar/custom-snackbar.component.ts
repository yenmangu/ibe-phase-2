import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
	selector: 'app-custom-snackbar',
	templateUrl: './custom-snackbar.component.html',
	styleUrls: ['./custom-snackbar.component.scss']
})
export class CustomSnackbarComponent {
	constructor(
		@Inject(MAT_SNACK_BAR_DATA) public data: any,
		private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
	) {}

	get message(): string {
		return this.data.message;
	}
	get error():string{
		return this.data.error
	}
	get noContact():boolean{
		return this.data.noContact
	}
	close() {
		this.snackBarRef.dismiss();
	}
}
