import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ChargeCodeInterface, chargeCodes } from 'src/app/shared/data/charge-code';
import {
	FormBuilder,
	FormGroup,
	ValidationErrors,
	Validators
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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

	fullEbu: boolean | null;

	ebuDetails: any = {};
	accountDetails: any = {};
	ids: any = {};

	private subscription: Subscription = new Subscription();
	private destroy$ = new Subject<void>();
	constructor(
		private fb: FormBuilder,
		private userDetailsService: UserDetailsService,
		private handActionsHttp: HandActionsHttpService,
		private snackbar: MatSnackBar,
		private dialogRef: MatDialogRef<EbuXmlDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData
	) {}

	ngOnInit(): void {
		this.showError = false;

		if (this.dialogData) {
			this.accountDetails = this.dialogData.accountDetails;
			this.ebuDetails = this.dialogData.ebuDetails;
			this.ids = this.dialogData.ids;
			if (this.dialogData.ebu && this.dialogData.england) {
				this.fullEbu = true;
			}
			this.buildEbuForm();
		}
		console.log('Data in dialog: ', this.dialogData);
		console.log('ebuXmlForm:', this.ebuXmlForm);
		console.log('fullEbu:', this.fullEbu);
		console.log('Form: ', this.ebuXmlForm);

		// this.buildEbuForm();
		this.userDetailsService.gameCode$
			.pipe(takeUntil(this.destroy$))
			.subscribe(gameCode => {
				console.log('subscribed to the userDetails service: ', gameCode);
				this.gameCode = gameCode;
			});

		if (this.ebuXmlForm || !this.fullEbu) {
			this.setNonEbuValues();
		}
	}

	private buildEbuForm() {
		this.ebuXmlForm = this.fb.group({
			clubName: [
				this.accountDetails.name ? this.accountDetails.name : '',
				Validators.required
			],
			clubId: [this.ids?.EBU ? this.ids.EBU : '', Validators.required],
			eventName: [
				this.dialogData.eventName ? this.dialogData.eventName : '',
				[Validators.required]
			],
			chargeCode: [
				this.ebuDetails.chargeCode ? this.ebuDetails.chargeCode : '10',
				Validators.required
			],
			awardMp: [false],
			perMatchWon: [false],
			mpType: [this.ebuDetails.mpType ? this.ebuDetails.mpType : 'Black'],
			mpScale: [''],
			directorName: [
				this.accountDetails.director ? this.accountDetails.director : ''
			],
			directorEmail: [
				this.accountDetails.dirEmail ? this.accountDetails.dirEmail : ''
			],
			comments: ['']
		});
	}

	private setDefaultValues() {
		const scaleDefault = this.mpScale.find(scale => scale === 'Club');
		this.ebuXmlForm.get('mpScale').setValue(scaleDefault);
		this.ebuXmlForm.get('mpType').setValue('black');
	}

	private setNonEbuValues() {
		this.ebuXmlForm.get('clubId').setValue('999999');
		this.ebuXmlForm.get('perMatchWon').setValue('n');
		this.ebuXmlForm.get('chargeCode').setValue('10');
		this.ebuXmlForm.get('awardMp').setValue('N');
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
		this.destroy$.next();
		this.destroy$.complete();
	}
}
