import {
	OnInit,
	AfterViewInit,
	Component,
	Output,
	EventEmitter,
	Input,
	ChangeDetectorRef,
	OnDestroy
} from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
	selector: 'app-app-interface',
	templateUrl: './app-interface.component.html',
	styleUrls: ['./app-interface.component.scss']
})
export class AppInterfaceComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() appInterfaceSettings: any;
	@Input() successMessage: boolean;
	@Output() appInterfaceEmitter = new EventEmitter<any>();

	// playersSeeConfig: any = [
	// 	{ name: 'Hand Diagrams', value: false },
	// 	{ name: 'Own results', value: false },
	// 	// { name: "Others' results", value: false },
	// 	{ name: 'Rankings', value: false },
	// 	{ name: 'Adjusted Score Details', value: false }
	// ];
	playersChangeConfig: any = [
		{ name: 'Device Assignments', value: false },
		{ name: "Player's Names", value: false },
		{ name: 'Team/ Side Names', value: false },
		{ name: 'Results (Current Round)', value: false }
	];
	playersInputConfig: any = [
		{ name: 'Leads', values: ['Yes', 'No', 'Required'] },
		{ name: 'Auctions', values: ['Yes', 'No', 'Required'] },
		{ name: 'Deals', values: ['Yes', 'No'] },
		{ name: 'Notes', values: ['Yes', 'No'] }
	];
	resultsTimeoutsConfig: any = [
		{ display: '15s', value: 15 },
		{ display: '30s', value: 30 },
		{ display: '45s', value: 45 },
		{ display: '60s', value: 60 },
		{ display: 'Never', value: 'Never' }
	];

	warnPlayersConfig: any = [
		{ name: 'Stationary Switch', value: false },
		{ name: 'Share', value: false },
		{ name: 'Out of Order', value: false },
		{ name: 'Unlikely Score', value: false },
		{ name: 'New Name', value: false }
	];

	appInterfaceForm: FormGroup;
	formPopulated: boolean = false;
	clicked: boolean = false;

	constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
		this.appInterfaceForm = this.createFormGroup();

		this.createFormControls();
	}

	ngOnInit(): void {
		// console.log(
		// 	'testing data readiness: ',
		// 	JSON.stringify(this.appInterfaceSettings, null, 2)
		// );
		// console.log('app interface form: ', this.appInterfaceForm.controls);

		if (this.appInterfaceForm && this.appInterfaceSettings) {
			this.cd.detectChanges();
			console.log('form and app interface settings are present. Populating form: ');
			this.populateFormControls(this.appInterfaceSettings)
				.then(() => {
					this.formPopulated = true;
					console.log('appInterface form has been populated');
				})
				.catch(error => {
					// handle error
					console.error('Error populating form: ', error);
				});
		}
		// console.log('app-interface form: ', this.appInterfaceForm.controls);
		this.appInterfaceForm.valueChanges.subscribe(data => {
			// console.log('app intfc val change: ', data);
		});
		console.log('appInterfaceForm initiated');
	}

	ngAfterViewInit(): void {}

	checkEmpty(obj) {
		for (var i in obj) return false;
		return true;
	}

	populateFormControls(data: any) {
		return new Promise((resolve, reject): void => {
			try {
				// console.log('data in populate form: ', data);
				const playersChangeArray = data.playersChange;
				for (let i = 0; i < playersChangeArray.length; i++) {
					const controlName = `control${i}`;
					this.appInterfaceForm
						.get(`playersChange.${i}.${controlName}`)
						.setValue(playersChangeArray[i][controlName]);
				}
				const playersInputArray = data.playersInput;
				for (let i = 0; i < playersInputArray.length; i++) {
					const controlName = `control${i}`;
					this.appInterfaceForm
						.get(`playersInput.${i}.${controlName}`)
						.setValue(playersInputArray[i][controlName]);
				}
				const warnPlayersArray = data.warnPlayers;
				for (let i = 0; i < warnPlayersArray.length; i++) {
					const controlName = `control${i}`;
					this.appInterfaceForm
						.get(`warnPlayers.${i}.${controlName}`)
						.setValue(warnPlayersArray[i][controlName]);
				}
				this.appInterfaceForm
					.get('handDiagrams')
					.setValue(this.appInterfaceSettings.handDiagrams);
				this.appInterfaceForm
					.get('ownResults')
					.setValue(this.appInterfaceSettings.ownResults);
				this.appInterfaceForm
					.get('othersResults')
					.setValue(this.appInterfaceSettings.othersResults);
				this.appInterfaceForm
					.get('rankings')
					.setValue(this.appInterfaceSettings.rankings);
				this.appInterfaceForm
					.get('adjustedScores')
					.setValue(this.appInterfaceSettings.adjustedScores);
				this.appInterfaceForm
					.get('resultsTimeout')
					.setValue(this.appInterfaceSettings.resultsTimeout);
				this.appInterfaceForm
					.get('flash')
					.setValue(this.appInterfaceSettings.flash);
				this.appInterfaceForm.get('qaba').setValue(this.appInterfaceSettings.qaba);
				this.appInterfaceForm.get('scov').setValue(this.appInterfaceSettings.scov);

				resolve(true);
			} catch (error) {
				reject(error);
			}
		});
	}

	createFormGroup() {
		return this.fb.group({
			// playersSee: this.fb.array([]),
			playersChange: this.fb.array([]),
			playersInput: this.fb.array([]),
			handDiagrams: new FormControl(false),
			ownResults: new FormControl(false),
			othersResults: new FormControl(false),
			rankings: new FormControl(false),
			adjustedScores: new FormControl(false),
			resultsTimeout: new FormControl(15),
			flash: new FormControl(false),
			qaba: new FormControl(false),
			scov: new FormControl(false),
			// additionalConfig: this.fb.array([]),
			warnPlayers: this.fb.array([])
		});
	}

	createFormControls() {
		const controls = {
			playersChange: this.fb.array([]),
			playersInput: this.fb.array([]),
			// additionalConfig: this.fb.array([]),
			warnPlayers: this.fb.array([])
		};
		this.playersChangeConfig.forEach((item, index) => {
			const group = this.fb.group({
				[`control${index}`]: new FormControl(item.value)
			});
			(this.appInterfaceForm.get('playersChange') as FormArray).push(group);
		});

		this.playersInputConfig.forEach((item, index) => {
			const group = this.fb.group({
				[`control${index}`]: new FormControl(item.values[0])
			});
			(this.appInterfaceForm.get('playersInput') as FormArray).push(group);
		});

		controls['handDiagrams'] = new FormControl(false);
		controls['othersResults'] = new FormControl(false);
		controls['ownResults'] = new FormControl(false);
		controls['rankings'] = new FormControl(false);
		controls['adjustedScores'] = new FormControl(false);
		controls['resultsTimeout'] = new FormControl('15');
		controls['flash'] = new FormControl(false);
		controls['qaba'] = new FormControl(false);
		controls['scov'] = new FormControl(false);

		this.warnPlayersConfig.forEach((item, index) => {
			const group = this.fb.group({
				[`control${index}`]: new FormControl(item.value)
			});
			(this.appInterfaceForm.get('warnPlayers') as FormArray).push(group);
		});
		return controls;
	}

	addControlsToGroup(group: FormGroup, configItems: any[]) {
		configItems.forEach(item => {
			group.addControl(item.name, new FormControl(item.value));
		});
	}

	getAppInterfaceValues(): void {
		const data = {
			formName: 'appInterface',
			xmlElement: 'pluisets',
			formData: this.appInterfaceForm.value
		};
		// console.log('app-interface data: ', data);
		this.appInterfaceEmitter.emit(data);
		this.clicked = true;
	}
	ngOnDestroy(): void {
		this.successMessage = false;
	}
}
