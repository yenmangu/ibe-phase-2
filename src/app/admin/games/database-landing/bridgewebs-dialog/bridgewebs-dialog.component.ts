import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';

@Component({
	selector: 'app-bridgewebs-dialog',
	templateUrl: './bridgewebs-dialog.component.html',
	styleUrls: ['./bridgewebs-dialog.component.scss']
})
export class BridgewebsDialogComponent implements OnInit, OnDestroy {
	private subscription: Subscription;
	bridgeWebsForm: FormGroup;
	constructor(
		private userDetailsService: UserDetailsService,
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<BridgewebsDialogComponent>
	) {}

	ngOnInit(): void {}

	private createBridgeWebsForm() {}

	ngOnDestroy(): void {}
}
