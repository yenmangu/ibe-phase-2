import {
	Component,
	OnDestroy,
	OnInit,
	AfterViewInit,
	ViewChildren,
	QueryList,
	TemplateRef,
	ElementRef,
	ChangeDetectorRef
} from '@angular/core';
import { HandActionsHttpService } from 'src/app/shared/services/hand-actions-http.service';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HtmlPdfDialogComponent } from './html-pdf-dialog/html-pdf-dialog.component';
import { EbuXmlDialogComponent } from './ebu-xml-dialog/ebu-xml-dialog.component';
import { AccountSettingsService } from '../services/account-settings.service';
import { Subject, takeUntil } from 'rxjs';
import { NgTemplateNameDirective } from 'src/app/directives/ng-template-name.directive';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { CustomSnackbarComponent } from 'src/app/shared/custom-snackbar/custom-snackbar.component';

interface PayloadData {
	eventName: string;
	gameCode: string;
	data: { [key: string]: any };
}

@Component({
	selector: 'app-reporting',
	templateUrl: './reporting.component.html',
	styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChildren(NgTemplateNameDirective)
	private templates!: QueryList<NgTemplateNameDirective>;
	@ViewChildren('tabHeader') private tabHeaders!: QueryList<ElementRef>;
	currentBreakpoint: string = '';
	gameCode: string = '';
	eventName: string = '';
	bridgewebsGameDetailsForm: FormGroup;
	bridgewebsAccountDetailsForm: FormGroup;
	bridgeWebsMasterPoints: boolean = false;

	accountData: any;
	bwAccount: string;

	bwStatus: {
		uploading: boolean;
		downloading: boolean;
	} = {
		uploading: false,
		downloading: false
	};

	// Tabs
	private tabHeaderArray: HTMLElement[] = [];
	private templateMap: { [key: string]: TemplateRef<any> } = {};
	public activeTab: TemplateRef<any> | null = null;

	private destroy$ = new Subject<void>();

	constructor(
		private handActionsHttp: HandActionsHttpService,
		private breakpointService: BreakpointService,
		private accountSettings: AccountSettingsService,
		private sharedDataService: SharedDataService,
		private fb: FormBuilder,
		private snackbar: MatSnackBar,
		private dialog: MatDialog,
		private cdr: ChangeDetectorRef
	) {
		this.initialiseBridgewebsForms();
	}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(breakpoint => {
				this.currentBreakpoint = breakpoint;
			});
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.accountSettings.accountData$
			.pipe(takeUntil(this.destroy$))
			.subscribe(data => {
				// console.log('Data: ', data);
				if (data) {
					this.accountData = data;
					console.log('Account Data in Component: ', this.accountData);
					this.patchFormValues();
				}
			});
		// this.sharedDataService.eventName$.subscribe(eventName => {
		// 	this.eventName = eventName !== null ? eventName : 'Un Named Event';
		// });

		this.accountSettings.fetchAccountSettings();
		this.bridgewebsGameDetailsForm
			.get('bwMasterpoints')
			.valueChanges.subscribe((checked: boolean) => {
				this.bridgeWebsMasterPoints = checked;
				if (!checked) {
					this.bridgewebsGameDetailsForm.patchValue({
						masterpointsMatchWon: false
					});
				}
			});
	}

	ngAfterViewInit(): void {
		this.buildTabHeaderArray();
		this.buildTemplateMap();
		setTimeout(() => {
			this.setActiveTab('handRecords');
		});
	}

	private patchFormValues(): void {
		if (this.accountData.bwDetails?.bwAccount) {
			this.bwAccount = this.accountData.bwDetails.bwAccount;
		} else this.bwAccount = '';
		this.bridgewebsGameDetailsForm
			.get('bwEventName')
			.patchValue(this.accountData.eventName);
		this.bridgewebsAccountDetailsForm
			.get('bwAccountName')
			.patchValue(this.bwAccount);
	}

	private buildTabHeaderArray(): void {
		this.tabHeaders.forEach(item => {
			this.tabHeaderArray.push(item.nativeElement as HTMLElement);
		});
	}

	private buildTemplateMap(): void {
		this.templates.forEach(template => {
			const templateName = template.templateName;
			this.templateMap[templateName] = template.templateRef;
		});
	}

	initialiseBridgewebsForms() {
		this.buildBwGameDetailsForm();
		this.buildBwAccountDetailsForm();
	}

	buildBwGameDetailsForm() {
		this.bridgewebsGameDetailsForm = this.fb.group({
			bwEventName: [this.eventName],
			bwDirectorName: ['', [Validators.pattern('^[a-zA-Z\\s]+$')]],
			bwScorerName: [''],
			bwMasterpoints: [false],
			masterpointsMatchWon: [false]
		});
	}

	buildBwAccountDetailsForm() {
		this.bridgewebsAccountDetailsForm = this.fb.group({
			bwAccountName: ['', [Validators.required]],
			bwPassword: ['', [Validators.required]]
		});
	}

	public clearBwGameDetails() {
		this.bridgewebsGameDetailsForm.reset();
		this.patchFormValues();
	}

	public clearBwAccountDetails() {
		this.bridgewebsAccountDetailsForm.reset();
	}

	private openSnackbar(message: string, noContact?: boolean, error?: any): void {
		this.snackbar.openFromComponent(CustomSnackbarComponent, {
			data: { message, error, noContact }
		});
	}

	onTabClick(event: MouseEvent): void {
		this.removeActiveTab();
		const clickedElement = event.currentTarget as HTMLElement;
		const tabName = clickedElement.getAttribute('tabname');
		this.setTabClass(clickedElement);
		this.setActiveTab(tabName);
	}

	setTabClass(htmlElement: HTMLElement): void {
		// htmlElement.classList.add('active');
		htmlElement.firstElementChild.classList.add('active');
	}

	removeActiveTab(): void {
		const currentActiveTab = document.querySelector('span.active');
		if (currentActiveTab) {
			currentActiveTab.classList.remove('active');
		}
	}

	setActiveTab(tabName: string): void {
		this.getActiveTabHeader(tabName);
		this.activeTab = this.templateMap[tabName];
	}

	getActiveTabHeader(tabName: string): void {
		this.tabHeaderArray.forEach(tabHeader => {
			const tabnameAttribute = tabHeader.getAttribute('tabname');
			if (tabnameAttribute === tabName) {
				tabHeader.classList.add('active');
			} else {
				tabHeader.classList.remove('active');
			}
		});
	}

	resetBridgewebs(): void {
		this.bwStatus.downloading = false;
		this.bwStatus.uploading = false;
	}

	getEventName(): string {
		return this.eventName !==
			this.bridgewebsGameDetailsForm.get('bwEventName').value
			? this.eventName
			: this.bridgewebsGameDetailsForm.get('bwEventName').value;
	}

	uploadBridgeWebs() {
		console.log('upload bridgewebs invoked');
		this.bwStatus.uploading = true;
		const eventName = this.getEventName();
		const data: PayloadData = {
			...this.bridgewebsGameDetailsForm.value,
			eventName,
			gameCode: this.gameCode
		};
		this.handActionsHttp.handleBridgeWebsHttp('upload', data).subscribe({
			next: response => {
				this.resetBridgewebs();
				console.log('Response: ', response);
				if ((response.remoteSuccess = true)) {
					this.snackbar.open('Success uploading to BridgeWebs', 'Dismiss');
				} else {
					this.openSnackbar(
						'Error uploading to BridgeWebs.',
						false,
						'Unknown Error'
					);
				}
			},
			error: err => {
				this.resetBridgewebs();
				const {
					error: { remoteSuccess }
				} = err;
				const errorArr: string[] = remoteSuccess.error;
				let errorString: string;
				if (remoteSuccess && remoteSuccess.error.length) {
					errorString = errorArr.join(', ');
				}
				this.openSnackbar(
					'Error uploading game file to BridgeWebs',
					false,
					errorString ? errorString : 'Unknown Error'
				);

				console.log('error: ', remoteSuccess.error);

				this.openSnackbar(err.remoteSuccess.error[0]);
			}
		});
	}

	downloadBridgeWebs() {
		console.log('download bridgewebs invoked');
		this.bwStatus.downloading = true;
		const data: PayloadData = {
			gameCode: this.gameCode,
			eventName: this.getEventName(),
			data: this.bridgewebsGameDetailsForm.value
		};
		this.handActionsHttp.handleBridgeWebsHttp('download', data).subscribe({
			next: (response: Blob) => {
				if (response) {
					console.log('response received');

					this.resetBridgewebs();
					const blob = new Blob([response], { type: 'text/csv' });
					saveAs(blob, `${this.gameCode}.csv`);
				}
			},
			error: error => {
				this.resetBridgewebs();
				console.error('Error fetching bridgewebs CSV', error);
				this.openSnackbar('Error fetching BridgeWebs data.', false, error.error);
			}
		});
	}

	downloadEBU() {
		console.log('download ebu invoked');
		// if (this.ebuDownloadForm.valid) {
		const ebuValues = {
			gameCode: this.gameCode,
			type: 'EBUP2PXML',
			action: 'download'
		};
		console.log('ebu download values: ', ebuValues);
		this.handActionsHttp.fetchEBU(ebuValues).subscribe({
			next: (response: Blob) => {
				if (response) {
					const blob = new Blob([response], { type: 'application/xml' });
					saveAs(blob, `${this.gameCode}.xml`);
				}
			},
			error: error => {
				console.error('error fetching EBU', error);
				this.snackbar.open(
					'Error fetching XML data, please try again. If the issue persists, please contact admin@ibescore.com',
					'Dismiss'
				);
			}
		});
		// }
	}

	openEbu() {
		this.dialog.open(EbuXmlDialogComponent, {
			width: '400px',
			data: {
				england: this.accountData.england,
				ebu: this.accountData.ebu,
				ebuDetails: this.accountData.ebuDetails,
				ids: this.accountData.ids,
				accountDetails: this.accountData.accountDetails,
				eventName: this.accountData.eventName

				// ebu: this.accountData.ids
			}
		});
		// .afterClosed()
		// .subscribe();
	}

	openHtmlPdf() {
		if (this.dialog) {
			this.dialog.open(HtmlPdfDialogComponent, { width: '400px' });
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
