import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
export class GameSetupComponent implements OnInit {
	setupForm: FormGroup;
	securityForm: FormGroup;
	scoringForm: any;
	dbInit: boolean = false;
	twoPageStartup: boolean;

	initialSettingsData: any = {};

	directorKey: string = '';
	gameCode: string = '';

	savedData: any = {};

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

		this.sharedSettingsService
			.getGameSettings()
			.pipe(tag('settings'))
			.subscribe({
				next: data => {
					if (data) {
						console.log(data);
						this.initialSettingsData = data;
					}
				},
				error: error => {}
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
			pinLength: null,
			pinType: 'numeric',
			pinCase: 'lower',
			spectateApp: false,
			spectateWebsite: false
		});

		this.setupForm.valueChanges.subscribe(values => {
			console.log('form values: ', values);
		});
		this.userDetailsService.directorKey$.subscribe(key => (this.directorKey = key));
		this.userDetailsService.gameCode$.subscribe(code => (this.gameCode = code));
		this.setupForm.get('twoPageStartup').valueChanges.subscribe(isChecked => {
			this.twoPageStartup = isChecked;
			console.log('twoPageStartup value: ', this.twoPageStartup);
		});
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
					console.log('api response: ', response);
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
					console.log('api response: ', response);
				},
				error: error => {}
			});
	}

	onPlayerIdForm(formData: any): void {
		console.log('Player ID Form: ', formData);
	}

	onScoringForm(formData: any): void {
		console.log('Scoring form data: ', formData);
	}

	onAppInterfaceForm(formData: any) {
		console.log('app-interface form data: ', formData);
	}

	onNamingNumberingForm(formData: any) {
		console.log('Naminng-numbering form data: ', formData);
	}
}
