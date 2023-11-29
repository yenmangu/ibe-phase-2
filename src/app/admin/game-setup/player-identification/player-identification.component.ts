import {
	Component,
	OnInit,
	Input,
	EventEmitter,
	Output,
	AfterViewInit
} from '@angular/core';
import {
	FormBuilder,
	FormArray,
	FormGroup,
	FormControl,
	Form
} from '@angular/forms';
import { Organisation } from '../../games/data/international-organisation';
import { organisations } from '../../games/data/data-store/internatinal-organisations';
import { SharedGameDataService } from '../../games/services/shared-game-data.service';
@Component({
	selector: 'app-player-identification',
	templateUrl: './player-identification.component.html',
	styleUrls: ['./player-identification.component.scss']
})
export class PlayerIdentificationComponent implements OnInit, AfterViewInit {
	@Output() savePlayerIdForm = new EventEmitter<any>();
	@Output() formDirty = new EventEmitter<any>();
	@Input() getValues = false;
	@Input() initialPlayerIdValues: any[];
	organisations: Organisation[] = [];
	internationalOrganisationForm: FormGroup;
	selectedOrganisations: (string | null)[] = [];
	choices: FormArray;
	namesDefault: boolean = true;

	subOrgsCache: { [key: string]: Organisation[] } = {};

	constructor(
		private fb: FormBuilder,
		private sharedGameData: SharedGameDataService
	) {
		this.organisations = organisations;
		this.internationalOrganisationForm = this.fb.group({
			choices: this.fb.array([]),
			defaultNames: [true]
		});
		this.choices = this.internationalOrganisationForm.get('choices') as FormArray;
	}
	ngOnInit(): void {
		console.log('initial player id array: ', this.initialPlayerIdValues);

		this.initForm();
		this.internationalOrganisationForm.valueChanges.subscribe(value => {
			if (value) {
				this.formChanged(true);
			}
		});
	}

	ngAfterViewInit(): void {
		console.log('AFTER VIEW INIT');

		console.log('form: ', this.internationalOrganisationForm);

		console.log(this.internationalOrganisationForm.get('choices')?.value); // Check the entire choices array
		console.log(this.choices.at(0)?.value); // Check the first item in choices
		console.log(this.choices.at(0)?.get('selectedOrganisation')?.value); // Check the 'selectedOrganisation' control in the first item
	}

	initForm(): void {
		// const nameRow = this.createNameRowFormGroup();
		// this.choices.push(nameRow);

		console.log('initial player id values: ', this.initialPlayerIdValues);


		const idArray = this.initialPlayerIdValues.filter(
			playerId => playerId.type !== 'playername'
		);
		console.log('id array: ', idArray);

		idArray.forEach(value => {
			console.log('value: ', value);

			if (value.type === 'nativeclub' && value.fid === undefined) {
				this.addSelectedChoice('nativeclub');
			} else {
				this.addSelectedChoice(value.fid);
			}
		});
		this.internationalOrganisationForm = this.fb.group({
			choices: this.choices,
			defaultNames: [true]
		});
	}

	createNameRowFormGroup(): FormGroup {
		const formGroup = this.fb.group({
			defaultNames: [true]
		});
		return formGroup;
		// this.addExisting(this.initialPlayerIdValues)
	}

	getChoiceFormGroup(index: number): FormGroup {
		return this.choices.at(index) as FormGroup;
	}

	onOrgChange(orgValue: string, index: number): void {
		console.log(
			'onOrgChange called with orgValue: ',
			orgValue,
			'and index: ',
			index
		);

		const choiceFormGroup = this.getChoiceFormGroup(index);
		console.log('choice form group in OnOrgChange: ', choiceFormGroup);

		const organisation = this.organisations.find(org => org.value === orgValue);

		if (organisation && organisation.subOrganisations) {
			choiceFormGroup.get('selectedSubOrganisation')?.enable();
			if (!choiceFormGroup.get('selectedSubOrganisation')) {
				choiceFormGroup.addControl(
					'selectedSubOrganisation',
					this.fb.control(null)
				);
			} else {
				if (choiceFormGroup.get('selectedSubOrganisation')) {
					choiceFormGroup.get('selectedSubOrganisation')?.disable();
					choiceFormGroup.removeControl('selectedSubOrganisation');
				}
			}
		}
	}

	onDefaultChange(isNames: boolean, index?: number) {
		console.log(`onDefaultChange invoked with ${index} and ${isNames}`);

		const choicesArray = this.internationalOrganisationForm.get(
			'choices'
		) as FormArray;

		const namesAsDefault = this.internationalOrganisationForm.get('defaultNames');
		const selectedCheckbox = choicesArray.at(index) as FormGroup;
		const currentValue = selectedCheckbox?.value;

		console.log('current value: ', currentValue);
		if (isNames) {
			namesAsDefault.patchValue(true);
			choicesArray.controls.forEach(control => {
				control.get('setDefault')?.patchValue(false);
			});
		}
		if (!isNames) {
			namesAsDefault.patchValue(false);
			choicesArray.controls.forEach((control, i) => {
				if (i !== index) {
					console.log('index of choice array: ', i);
					control.get('setDefault')?.patchValue(false);
					if (i === index) {
						control.get('setDefault')?.patchValue(true);
					}
				}
			});
		}
	}

	selectedOrgHasSubOrgs(index: number): boolean {
		// console.log('selctedOrgHasSubOrg called');
		const selectedOrgControl = this.choices.at(index).get('selectedOrganisation');
		const selectedOrg = selectedOrgControl.value as Organisation;
		if (selectedOrg && selectedOrg.subOrganisations) {
		}
		return (
			selectedOrg &&
			selectedOrg.subOrganisations &&
			selectedOrg.subOrganisations.length > 0
		);
	}

	getSubOrgs(orgValue: string): Organisation[] {
		const selectedOrg = this.organisations.find(org => org.value === orgValue);
		return selectedOrg ? selectedOrg.subOrganisations : [];
	}

	getSubOrgsForChoice(index: number): Organisation[] {
		const selectedOrgControl = this.choices.at(index).get('selectedOrganisation');
		if (selectedOrgControl) {
			const selectedOrg = selectedOrgControl.value
				? selectedOrgControl.value
				: null;

			if (!this.subOrgsCache[selectedOrg]) {
				this.subOrgsCache[selectedOrg] = this.getSubOrgs(selectedOrg);
			}
			return this.subOrgsCache[selectedOrg] || [];
		} else {
			return [];
		}
	}

	addSubOrgControl(index: number, subOrgs: Organisation[]): void {
		const subOrgControl = this.fb.control(null);
		const choiceGroup = this.choices.at(index) as FormGroup;
		// choiceGroup.addControl('selectedOrganisation', subOrgControl);
		(choiceGroup.get('selectedOrganisation') as FormArray).push(subOrgControl);
	}

	removeSubOrgControl(index: number, subOrgIndex: number): void {
		const choiceGroup = this.choices.at(index) as FormGroup;
		const selectedOrganisationArray = choiceGroup.get(
			'selectedOrganisation'
		) as FormArray;
		selectedOrganisationArray.removeAt(subOrgIndex);
	}

	addSelectedChoice(fid) {
		const matchingOrg = this.organisations.find(org => org.value === fid);
		if (matchingOrg) {
			const choiceGroup = this.createChoiceFormGroup(matchingOrg);
			this.choices.push(choiceGroup);
		}
	}

	addExisting(playerIdArray) {
		const playerIds = playerIdArray.filter(
			playerId => playerId.type !== 'playername' || 'nativeclub'
		);

		const groupsToAdd = [];
		playerIds.forEach(playerId => {
			const matchingOrg = this.organisations.find(
				org => org.value === playerId.fid
			);
			const nativeClubOrg = this.organisations.find(
				org => org.value === 'nativeclub'
			);

			if (matchingOrg) {
				const choiceGroup = this.createChoiceFormGroup(matchingOrg);
				groupsToAdd.push(choiceGroup);
			}

			if (nativeClubOrg) {
				const nativeclubGroup = this.createChoiceFormGroup(nativeClubOrg);

				groupsToAdd.push(nativeclubGroup);
			}
		});
	}

	addChoice(): void {
		const choiceGroup = this.createChoiceFormGroup();
		console.log('choiceGroup as creeated by createChoiceFormGroup: ', choiceGroup);
		console.log('default ??: ', choiceGroup.get('setDefault').value);
		choiceGroup.valueChanges.subscribe(value => {
			console.log(
				'the value changed: ',
				value.selectedOrganisation,
				' ',
				value.setDefault
			);
			const selectedOrg = value.selectedOrganisation;
			if (value.setDefault) {
				this.namesDefault = false;
			}
		});

		// choiceGroup.patchValue({ orgValue: null });
		this.choices.push(choiceGroup);
		choiceGroup.get('selectedOrganisation').valueChanges.subscribe(selectedOrg => {
			const hasSubOrgs = this.organisations.some(
				org =>
					org.value === selectedOrg &&
					org.subOrganisations &&
					org.subOrganisations.length > 0
			);
			if (hasSubOrgs) {
				choiceGroup.get('selectedSubOrganisation').enable();
			} else {
				choiceGroup.get('selectedSubOrganisation').disable();
			}
		});
	}

	removeChoice(index: number): void {
		this.choices.removeAt(index);
	}

	createChoiceFormGroup(selectedOrg?: Organisation): FormGroup {
		const choiceGroup = this.fb.group({
			setDefault: [null],
			selectedOrganisation: [selectedOrg ? selectedOrg.value : null],
			selectedSubOrganisation: [{ value: null, disabled: true }]
		});

		choiceGroup
			.get('selectedOrganisation')
			.valueChanges.subscribe(selectedValue => {
				if (selectedValue) {
					console.log('organisation has changed');

					// Check if selectedOrg has sub-organizations here
					const hasSubOrgs = this.organisations.some(
						org =>
							org.value === selectedOrg &&
							org.subOrganisations &&
							org.subOrganisations.length > 0
					);
					if (hasSubOrgs) {
						choiceGroup.get('selectedSubOrganisation').enable();
					} else {
						choiceGroup.get('selectedSubOrganisation').disable();
					}
				} else {
					choiceGroup.get('selectedSubOrganisation').disable();
				}
			});
		return choiceGroup;
	}

	savePlayerIdValues() {
		console.log('save player id values invoked');

		const data = this.getPlayerIdValues();
		console.log('data in player id form component: ', data);
		this.savePlayerIdForm.emit(data);
	}

	formChanged(event) {
		this.formDirty.emit(true);
	}

	getPlayerIdValues(): any {
		return this.internationalOrganisationForm.value;
	}
}
