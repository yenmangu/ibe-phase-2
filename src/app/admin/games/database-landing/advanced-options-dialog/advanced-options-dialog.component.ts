import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-advanced-options-dialog',
	templateUrl: './advanced-options-dialog.component.html',
	styleUrls: ['./advanced-options-dialog.component.scss']
})
export class AdvancedOptionsDialogComponent {

// Update FROM bridge webs
  savedAccount: string = 'test_saved'
  savedPassword: string ='saved_password'
  includeContactChecked: boolean
  deletePlayersChecked: boolean

// Update TO BridgeWebs

// Export TO disk

// Export FROM disk

// Fill in ID numbers



constructor(
		public dialogRef: MatDialogRef<AdvancedOptionsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}
}
