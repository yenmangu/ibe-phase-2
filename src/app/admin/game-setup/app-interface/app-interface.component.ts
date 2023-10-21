import { OnInit, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
	selector: 'app-app-interface',
	templateUrl: './app-interface.component.html',
	styleUrls: ['./app-interface.component.scss']
})
export class AppInterfaceComponent implements OnInit {
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
		{ display: '60s', value: 65 },
		{ display: 'Never', value: 'Never' }
	];
	additonalConfig: any = [
		{ name: 'Flash Scores', value: false },
		{ name: 'Quick Adjust Button', value: false },
		{ name: 'Opps Verification', value: false }
	];
	warnPlayersConfig: any = [
		{ name: 'Stationary Switch', value: false },
		{ name: 'Share', value: false },
		{ name: 'Out of Order', value: false },
		{ name: 'Unlikely Score', value: false },
		{ name: 'New Name', value: false }
	];

	appInterfaceForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.appInterfaceForm = this.createFormGroup();

		this.createFormControls();
	}

	ngOnInit(): void {
		console.log('app-interface form: ', this.appInterfaceForm.controls);
		this.appInterfaceForm.valueChanges.subscribe(data => {
			console.log('app intfc val change: ', data);
			// if (this.appInterfaceForm.get(''))
		});
	}

	createFormGroup() {
		return this.fb.group({
			// playersSee: this.fb.array([]),
			playersChange: this.fb.array([]),
			playersInput: this.fb.array([]),
			handDiagrams: new FormControl(null),
			ownResults: new FormControl(null),
			othersResults: new FormControl(null),
			rankings: new FormControl(null),
			adjustedScores: new FormControl(null),
			resultsTimeout: new FormControl(null),

			additionalConfig: this.fb.array([]),
			warnPlayers: this.fb.array([])
		});
	}

	createFormControls() {
		const controls = {
			playersSee: this.fb.array([]),
			playersChange: this.fb.array([]),
			playersInput: this.fb.array([]),
			additionalConfig: this.fb.array([]),
			warnPlayers: this.fb.array([])
		};

		// this.playersSeeConfig.forEach((item, index) => {
		// 	const group = this.fb.group({
		// 		[`control${index}`]: new FormControl(item.value)
		// 	});
		// 	(this.appInterfaceForm.get('playersSee') as FormArray).push(group);
		// });

		this.playersChangeConfig.forEach((item, index) => {
			const group = this.fb.group({
				[`control${index}`]: new FormControl(item.value)
			});
			(this.appInterfaceForm.get('playersChange') as FormArray).push(group);
		});

		this.playersInputConfig.forEach((item, index) => {
			const group = this.fb.group({
				[`control${index}`]: new FormControl(item.value)
			});
			(this.appInterfaceForm.get('playersInput') as FormArray).push(group);
		});

		this.additonalConfig.forEach((item, index) => {
			const group = this.fb.group({
				[`control${index}`]: new FormControl(item.value)
			});
			(this.appInterfaceForm.get('additionalConfig') as FormArray).push(group);
		});
		controls['handDiagrams'] = new FormControl(false)
		controls['othersResults'] = new FormControl(false);
		controls['ownResults'] = new FormControl(false);
		controls['rankings']=new FormControl(false)
		controls['adjustedScores'] = new FormControl(false)
		controls['resultsTimeout'] = new FormControl('15');

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
		const data ={
			formName:'appInterface',
			xmlElement: 'pluisets',
			formData: this.appInterfaceForm.value
		}
		console.log('app-interface data: ', data);
		this.appInterfaceEmitter.emit(data);
	}
}
