import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChargeCodeInterface, chargeCodes } from 'src/app/shared/data/charge-code';
import {
	FormBuilder,
	FormGroup,
	ValidationErrors,
	Validators
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { Subscription } from 'rxjs';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-ebu-xml-dialog',
	templateUrl: './ebu-xml-dialog.component.html',
	styleUrls: ['./ebu-xml-dialog.component.scss']
})
export class EbuXmlDialogComponent implements OnInit, OnDestroy {
	ebuChargeCodes: ChargeCodeInterface[] = chargeCodes;
	mpScale: any[] = [
		'Club',
		'District',
		'County',
		'Reigional',
		'National',
		'Individual',
		'County association',
		'Club quali-final',
		'District quali-final',
		'Reigional quali-final',
		'National quali-final',
		'Special quali-final'
	];

	ebuXmlForm: FormGroup;
	gameCode: string = '';
	showError: boolean = false;

	private subscription: Subscription = new Subscription();

	constructor(
		private fb: FormBuilder,
		private userDetailsService: UserDetailsService,
		private handActionsHttp: HandActionsHttpService,
		private snackbar: MatSnackBar,
		private dialogRef: MatDialogRef<EbuXmlDialogComponent>
	) {}

	ngOnInit(): void {
		this.showError = false;
		this.buildEbuForm();
		this.userDetailsService.gameCode$.subscribe(gameCode => {
			console.log('subscribed to the userDetails service: ', gameCode);
			this.gameCode = gameCode;
		});

		if (this.ebuXmlForm) {
			this.setDefaultValues();
		}
	}

	private buildEbuForm() {
		this.ebuXmlForm = this.fb.group({
			clubName: ['', Validators.required],
			clubId: ['', Validators.required],
			eventName: ['', Validators.required],
			chargeCode: ['10', Validators.required],
			awardMp: [false],
			perMatchWon: [false],
			mpType: ['Black'],
			mpScale: [''],
			directorName: [''],
			directorEmail: [''],
			comments: ['']
		});
	}

	private setDefaultValues() {
		const scaleDefault = this.mpScale.find(scale => scale === 'Club');
		this.ebuXmlForm.get('mpScale').setValue(scaleDefault);
		this.ebuXmlForm.get('mpType').setValue('black');
	}

	handleSubmit() {
		if (this.ebuXmlForm.valid) {
			const data = { ...this.ebuXmlForm.value };
			console.log('data in ebuXmlForm: ', data);
			const ebuValues = {
				gameCode: this.gameCode,
				type: 'EBUP2PXML',
				action: 'download',
				formData: data
			};
			this.handActionsHttp.fetchEBU(ebuValues).subscribe({
				next: (response: Blob) => {
					if (response) {
						const blob = new Blob([response], { type: 'application/xml' });
						saveAs(blob, `${this.gameCode}.xml`);
						this.dialogRef.close();
					}
				},
				error: error => {
					this.snackbar.open(
						'Error fetching XML data, please try again. If the issue persists, please contact admin@ibescore.com',
						'Dismiss'
					);
				}
			});
		}
	}

	testEbuSubmit() {
		const workingSampleFormData = {
			clubName: 'Cheam Bridge Club',
			clubId: '431200',
			eventName: 'Cheam BC XMas party',
			chargeCode: '10',
			awardMp: true,
			perMatchWon: true,
			mpType: 'blue',
			mpScale: 'National',
			directorName: 'Victor Lesk',
			directorEmail: 'victorlesk@hotmail.com',
			comments: 'My opinions on the session are 1 2 3'
		};
		const testFormData = {
			clubName: 'Test Club Name',
			clubId: 'ID1245554455',
			eventName: 'Test event name',
			chargeCode: '10',
			awardMp: true,
			perMatchWon: true,
			mpType: 'black',
			mpScale: 'Club',
			directorName: 'Rob Test',
			directorEmail: 'robert.shelford@googlemail.com',
			comments: 'any comments here'
		};
		console.log('TEST EBU SUBMIT with: ', workingSampleFormData);
		const ebuValues = {
			gameCode: this.gameCode,
			type: 'EBUP2PXML',
			action: 'download',
			formData: workingSampleFormData
		};
		this.handActionsHttp.fetchEBU(ebuValues).subscribe({
			next: (response: Blob) => {
				if (response) {
					console.log('Response: ', response);
					const blob = new Blob([response], { type: 'application/xml' });
					saveAs(blob, `${this.gameCode}.xml`);
					this.dialogRef.close();
				}
			},
			error: error => {
				console.log(error);
				this.snackbar.open(
					'Error fetching XML data, please try again. If the issue persists, please contact admin@ibescore.com',
					'Dismiss'
				);
			}
		});
	}

	closeDialog() {
		this.dialogRef.close();
	}

	ngOnDestroy(): void {
		this.userDetailsService.gameCodeSubject.unsubscribe();
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
