import { OnInit, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
	selector: 'app-app-interface',
	templateUrl: './app-interface.component.html',
	styleUrls: ['./app-interface.component.scss']
})
export class AppInterfaceComponent implements OnInit {
	@Output() appInterfaceEmitter = new EventEmitter<any>();

	playersSeeConfig: any = [
		{ name: 'Hand Diagrams', value: false },
		{ name: 'Own results', value: false },
		{ name: "Others's results", value: false },
		{ name: 'Rankings', value: false },
		{ name: 'Adjusted Score Details', value: false }
	];
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
		this.appInterfaceForm.valueChanges.subscribe(data=> {
			console.log('app intfc val change: ',data )
		})
	}

	createFormGroup() {
		return this.fb.group({
			playersSee: this.fb.array([]),
			playersChange: this.fb.array([]),
			playersInput: this.fb.array([]),
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

		this.playersSeeConfig.forEach(item => {
			const control = new FormControl(item.value);
			(this.appInterfaceForm.get('playersSee') as FormArray).push(control);
		});
		this.playersChangeConfig.forEach(item => {
			const control = new FormControl(item.value);
			(this.appInterfaceForm.get('playersChange') as FormArray).push(control);
		});
		this.playersInputConfig.forEach(item => {
			const control = new FormControl(item.values[0]);
			(this.appInterfaceForm.get('playersInput') as FormArray).push(control);
		});

		this.additonalConfig.forEach(item => {
			const control = new FormControl(item.value);
			(this.appInterfaceForm.get('additionalConfig') as FormArray).push(control);
		});
		controls['resultsTimeout'] = new FormControl('15');

		this.warnPlayersConfig.forEach(item => {
			const control = new FormControl(item.value);
			(this.appInterfaceForm.get('warnPlayers') as FormArray).push(control);
		});
		return controls;
	}

	addControlsToGroup(group: FormGroup, configItems: any[]) {
		configItems.forEach(item => {
			group.addControl(item.name, new FormControl(item.value));
		});
	}

	getFormValues(): void {
		const data = this.appInterfaceForm.value;
		console.log('app-interface data: ', data);
		this.appInterfaceEmitter.emit(data);
	}
}
