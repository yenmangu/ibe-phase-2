import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
export class PlayerIdentificationComponent implements OnInit {
	@Output() idFormEmitter = new EventEmitter<any>();
	organisations: Organisation[] = [];
	internationalOrganisationForm: FormGroup;
	selectedOrganisations: (string | null)[] = [];
	choices: FormArray;

	subOrgsCache: { [key: string]: Organisation[] } = {};

	constructor(
		private fb: FormBuilder,
		private sharedGameData: SharedGameDataService
	) {
		this.organisations = organisations;
		this.internationalOrganisationForm = this.fb.group({
			choices: this.fb.array([])
		});
		this.choices = this.internationalOrganisationForm.get('choices') as FormArray;
	}
	ngOnInit(): void {
		this.addChoice();
		console.log('org data: ', JSON.stringify(this.organisations, null, 2));

		console.log('Selected org form: ', this.internationalOrganisationForm);
		console.log('Selected choices: ', this.choices);
		// console.log('child component twopagestartup value: ', this.twoPageStartupValue);
	}

	createStaticRow(): FormGroup {
		return this.fb.group({
			selectedOrganisation: 'local-club'
		});
	}

	getChoiceFormGroup(index: number): FormGroup {
		return this.choices.at(index) as FormGroup;
	}

	// onOrgChange(orgValue: string, index: number): void {
	// 	console.log(
	// 		'onOrgChange called with orgValue: ',
	// 		orgValue,
	// 		'and index: ',
	// 		index
	// 	);

	// 	this.selectedOrganisations[index] = orgValue;
	// 	const choiceFormGroup = this.getChoiceFormGroup(index);
	// 	console.log('choice form group in OnOrgChange: ', choiceFormGroup)

	// 	const organisation = this.organisations.find(org=>org.value===orgValue)

	// 	if (choiceFormGroup.get('selectedSubOrganisation')) {
	// 		if (organisation && organisation.subOrganisations) {
	// 			// The selected organization has sub-organizations, add or enable the 'selectedSubOrganisation' control
	// 			choiceFormGroup.get('selectedSubOrganisation').enable();
	// 		} else {
	// 			// The selected organization does not have sub-organizations, so disable and clear the 'selectedSubOrganisation' control
	// 			choiceFormGroup.get('selectedSubOrganisation').disable();
	// 			choiceFormGroup.get('selectedSubOrganisation').setValue(null);
	// 		}

	// 	}
	// 	console.log('onOrgCVhange function ended')

	// }

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

		if (choiceFormGroup.get('selectedSubOrganisation')) {
			choiceFormGroup.removeControl('selctedSubOrganisation')
		}
		if(organisation && organisation.subOrganisations){
			choiceFormGroup.get('selectedSubOrganisation').enable()
			choiceFormGroup.addControl('selectedSubOrganisation',this.fb.control(null))
		}
		console.log('onOrgChange function ended');
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
		console.log('getSubOrgs invoked.. with orgValue: ', orgValue);
		const selectedOrg = this.organisations.find(org => org.value === orgValue);
		console.log('selected org org: ', selectedOrg)
		return selectedOrg ? selectedOrg.subOrganisations : [];
	}

	getSubOrgsForChoice(index: number): Organisation[] {
		console.log('getSubOrgsForChoice called');

		const selectedOrgControl = this.choices.at(index).get('selectedOrganisation');
		// console.log('selectedOrgControl: ', selectedOrgControl);
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

	addChoice(): void {
		const choiceGroup = this.createChoiceFormGroup();
		console.log('choiceGroup as creeated by createChoiceFormGroup: ', choiceGroup);

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

	createChoiceFormGroup(): FormGroup {
		const choiceGroup = this.fb.group({
			setDefault: false,
			selectedOrganisation: [null],
			selectedSubOrganisation: [null]
		});
		choiceGroup.get('selectedOrganisation').valueChanges.subscribe(selectedOrg => {
			if (selectedOrg) {
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

	getPlayerIdValues(): void {
		const data = this.internationalOrganisationForm.value;
		this.idFormEmitter.emit(data);
	}
}
