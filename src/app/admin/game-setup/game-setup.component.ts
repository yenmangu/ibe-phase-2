import {
	Component,
	EventEmitter,
	OnInit,
	AfterViewInit,
	Output,
	OnDestroy
} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiDataCoordinationService } from '../games/services/api/api-data-coordination.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { SharedGameDataService } from '../games/services/shared-game-data.service';
import { GameSettingsService } from '../services/game-settings.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { SharedSettingsService } from '../services/shared-settings.service';
import { tag } from 'rxjs-spy/cjs/operators';
import { DataService } from '../games/services/data.service';
@Component({
	selector: 'app-game-setup',
	templateUrl: './game-setup.component.html',
	styleUrls: ['./game-setup.component.scss']
})
export class GameSetupComponent implements OnInit, AfterViewInit, OnDestroy {
	setupForm: FormGroup;
	securityForm: FormGroup;
	scoringForm: any;
	dbInit: boolean = false;
	twoPageStartup: boolean;
	successMessage: boolean = false;

	dbProgress: number = 0;

	initialSettingsData: any = {};
	setupSettings: any = {};
	scoringSettings: any = {};
	appInterfaceSettings: any = {};
	namingNumberingSettings: any = {};

	directorKey: string = '';
	gameCode: string = '';

	savedData: any = {};
	formPopulated: boolean = false;

	newEventClicked: boolean = false;
	setupClicked: boolean = false;
	tabChanged: boolean = false;

	applyMagentaGreyTheme = true;
	constructor(
		private breakpointService: BreakpointService,
		private fb: FormBuilder,
		private apiCoordinationService: ApiDataCoordinationService,
		private userDetailsService: UserDetailsService,
		private sharedGameData: SharedGameDataService,
		private gameSettingsService: GameSettingsService,
		private IDBstatusService: IndexedDatabaseStatusService,
		private sharedSettingsService: SharedSettingsService,
		private dataService: DataService
	) {}

	ngOnInit(): void {
		this.IDBstatusService.isInitialised$.subscribe(init => {
			if (init) {
				this.dbInit = init;
				console.log('db init');
			}
		});

		if (this.dbInit) {
			this.gameSettingsService.fetchAllSettings();
		}
		this.IDBstatusService.dataProgress$.subscribe(progress => {
			this.dbProgress = progress;
			console.log(this.dbProgress);
		});
		this.setupForm = this.fb.group({
			newEventUses: 'previous',
			twoPageStartup: false,
			tdEntersNames: false,
			requireAllNames: false,
			teamSignIn: false,
			// Security
			onGameCreation: 'no-lock-change',
			usePin: false,
			pinLength: 0,
			pinType: 'numeric',
			pinCase: 'lower',
			spectateApp: null,
			spectateWeb:null
		});

		this.sharedSettingsService
			.getGameSettings()
			.pipe(tag('settings'))
			.subscribe({
				next: data => {
					if (data) {
						console.log('initial settings data: ', data);
						this.initialSettingsData = data;
						this.setupSettings = data.setupConfig;
						this.scoringSettings = data.scoringConfig;
						this.appInterfaceSettings = data.appInterfaceConfig;
						this.namingNumberingSettings = data.namingNumberingConfig;
						this.populateForm();
					}
				},
				error: error => {
					console.error('error retrieving data');
				}
			});

		this.setupForm.valueChanges.subscribe(values => {
			// console.log('form values: ', values);
		});
		this.userDetailsService.directorKey$.subscribe(key => (this.directorKey = key));
		this.userDetailsService.gameCode$.subscribe(code => (this.gameCode = code));
		this.setupForm.get('twoPageStartup').valueChanges.subscribe(isChecked => {
			this.twoPageStartup = isChecked;
			console.log('twoPageStartup value: ', this.twoPageStartup);
		});
	}
	ngAfterViewInit(): void {}

	checkEmpty(obj) {
		for (var i in obj) return false;
		return true;
	}

	onNewEventChange() {
		this.successMessage = false;
	}

	onTabChange(event: MatTabChangeEvent) {
		this.tabChanged = true;
		this.resetState();
	}

	resetState() {
		this.setupClicked = false;
		this.newEventClicked = false;
		this.successMessage = false;
	}

	populateForm(): void {
		if (this.setupSettings && this.setupForm) {
			const { initConfig } = this.setupSettings;

			console.log('setup settings for populate form: ', initConfig);

			this.setupForm.get('newEventUses').setValue(initConfig.newEventUses);
			this.setupForm.get('twoPageStartup').setValue(initConfig.twoPageVal);
			this.setupForm.get('tdEntersNames').setValue(initConfig.tdEntersNames);
			this.setupForm.get('requireAllNames').setValue(initConfig.requireAllNames);
			this.setupForm.get('onGameCreation').setValue(initConfig.onGameCreation);
			this.setupForm.get('usePin').setValue(initConfig.usePin);
			this.setupForm.get('pinLength').setValue(initConfig.pinLength);
			this.setupForm.get('pinType').setValue(initConfig.pinType);
			this.setupForm.get('pinCase').setValue(initConfig.pinCase);
			this.setupForm.get('spectateApp').setValue(!!initConfig.spectateApp);
			this.setupForm
				.get('spectateWeb')
				.setValue(!!initConfig.spectateWeb);
		}
	}
	setup() {
		this.setupClicked = true;
	}
	newEvent() {
		this.newEventClicked = true;
	}
	save(): void {
		const data = {
			formName: 'setupForm',
			formData: this.setupForm.value
		};
		this.savedData = data;

		// data.setupForm = this.setupForm.value;
		console.log('set up form data: ', data);
		this.apiCoordinationService
			.setbaseSettings(this.directorKey, this.gameCode, this.savedData)
			.subscribe({
				next: response => {
					if (response.response.success) {
						this.successMessage = true;
					}
					console.log('api response: ', response.response.success);
				},
				error: error => {}
			});
	}

	onChildForm(formData: any): void {
		this.savedData = formData;
		console.log('all form data: ', formData);
		this.apiCoordinationService
			.setbaseSettings(this.directorKey, this.gameCode, this.savedData)
			.subscribe({
				next: response => {
					console.log('api response: ', response.response.success);
					if (response.response.success) {
						this.successMessage = true;
					}
				},
				error: error => {}
			});
	}

	onPlayerIdForm(formData: any): void {
		// console.log('Player ID Form: ', formData);
	}

	onScoringForm(formData: any): void {
		// console.log('Scoring form data: ', formData);
	}

	onAppInterfaceForm(formData: any) {
		// console.log('app-interface form data: ', formData);
	}

	onNamingNumberingForm(formData: any) {
		// console.log('Naminng-numbering form data: ', formData);
	}
	ngOnDestroy(): void {
		this.successMessage = false;
	}
}
