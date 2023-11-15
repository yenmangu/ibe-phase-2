import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { ChargeCodeInterface, chargeCodes } from 'src/app/shared/data/charge-code';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
@Component({
	selector: 'app-hand-actions',
	templateUrl: './hand-actions.component.html',
	styleUrls: ['./hand-actions.component.scss']
})
export class HandActionsComponent implements OnInit, AfterViewInit {
	currentBreakpoint: string = '';
	// Tab Control
	selectedTab: string = 'movement';
	gameCode: string = '';
	dirKey: string = '';

	// Movement
	movementInput: string = '';

	// Masterpoints
	masterpointsForm: FormGroup;

	// HTML/PDF
	htmlPdfForm: FormGroup;

	// EBU
	ebuDownloadForm: FormGroup;
	ebuUploadForm: FormGroup;
	chargeCodes: ChargeCodeInterface[] = chargeCodes;

	// ECATS
	ecatsForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private handActionsHttp: HandActionsHttpService,
		private breakpointService: BreakpointService
	) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$.subscribe(
			breakpoint => (this.currentBreakpoint = breakpoint)
		);
		this.buildMasterpointsForm();
		this.buildHtmlForm();
		this.buildEbuForm();
	}

	ngAfterViewInit(): void {}

	selectTab(tabName) {
		setTimeout(() => {
			this.selectedTab = tabName;
		}, 0);
	}

	buildMasterpointsForm() {
		this.masterpointsForm = this.fb.group({
			eventName: [''],
			directorName: ['', [Validators.pattern('^[a-zA-Z]+$')]],
			scorerName: [''],
			masterpoints: false,
			bridgeWebsAccount: [''],
			password: ['']
		});
	}

	getMovement() {
		const data = {
			gameCode: this.gameCode,
			title: this.movementInput
		};

		this.handActionsHttp.fetchMovement(data).subscribe({
			next: response => {
				if (response.data) {
					console.log(response.data);
				}
			},
			error: () => {}
		});
	}

	buildHtmlForm() {
		this.htmlPdfForm = this.fb.group({
			eventName: [''],
			directorName: [''],
			comments: [''],
			fileType: [''],
			rankings: [],
			matrix: [],
			hands: [],
			scorecards: []
		});
		this.htmlPdfForm.patchValue({
			fileType: 'html'
		});
	}

	buildEbuForm() {
		this.ebuDownloadForm = this.fb.group({
			chargeCode: [''],
			masterpoints: ['']
		});
		this.ebuUploadForm = this.fb.group({
			eventName: [''],
			directorName: [''],
			clubName: [''],
			clubId: [''],
			password: [''],
			comment: ['']
		});
	}

	buildEcatsForm() {
		this.ecatsForm = this.fb.group({
			sessionId: [''],
			clubName: [''],
			fedId: [''],
			country: [''],
			county: [''],
			town: [''],
			email: [''],
			phone: ['', [Validators.pattern('^[0-9]+$')]],
			contactName: ['', [Validators.pattern('^[a-zA-Z]+$')]],
			eventName: [''],
			fax: ['']
		});
	}

	previewPdf() {}

	downloadPdf() {}

	uploadBridgeWebs() {
		if(this.masterpointsForm.valid){
			const values = {...this.masterpointsForm.value}
		}
	}

	downloadBridgeWebs() {}

	previewHtmlPdf() {}
	downloadHtmlPdf() {
		if (this.htmlPdfForm.valid) {
			const values = { ...this.htmlPdfForm.value };
			console.log('formData: ', values);
		}
	}
	downloadEBU() {}
	uploadEBU() {
		if (this.ebuUploadForm.valid) {
			const values = { ...this.ebuUploadForm.value };
		}
	}
	uploadEcats() {
		if (this.ecatsForm.valid) {
			const values = { ...this.ecatsForm.value };
		}
	}
	downloadEcats() {
		if (this.ecatsForm.valid) {
			const values = { ...this.ecatsForm.value };
		}
	}
}
