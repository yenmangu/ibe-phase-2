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

	constructor(private fb: FormBuilder) {
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
	}


	createStaticRow(): FormGroup {
		return this.fb.group({
			selectedOrganisation: 'local-club'
		});
	}

	getChoiceFormGroup(index: number): FormGroup {
		return this.choices.at(index) as FormGroup;
	}

	onOrgChange(orgValue: string): void {
		console.log('onOrgChange invoked with index: ', orgValue);
		const index = this.choices.controls.findIndex(
			(control: any) => control.value.selectedOrganisation === orgValue
		);
		const choiceFormGroup = this.getChoiceFormGroup(index);
		this.selectedOrganisations[index] = orgValue;
		if (choiceFormGroup.get('setDefault').value) {
			this.choices.controls.forEach((control, i) => {
				if (i !== index) {
					control.get('setDefault').setValue(false);
				}
			});
		}
		const selectedOrganisation = choiceFormGroup.get('selectedOrganisation').value;
		if (choiceFormGroup.get('selectedSubOrganisation')) {
			choiceFormGroup.removeControl('selectedSubOrganisation');
		}
		const organisation = this.organisations.find(
			org => org.value === selectedOrganisation
		);
		if (organisation && organisation.subOrganisations) {
			choiceFormGroup.addControl('selectedSubOrganisation', this.fb.control(null));
		}
	}

	selectedOrgHasSubOrgs(index: number): boolean {
		console.log('selctedOrgHasSubOrg called');
		const selectedOrgControl = this.choices.at(index).get('selectedOrganisation');
		// console.log('selectedOrgControl: ', selectedOrgControl.value);
		const selectedOrg = selectedOrgControl.value as Organisation;
		if (selectedOrg && selectedOrg.subOrganisations) {
			console.log(
				'found sub orgs for selected org: ',
				selectedOrg,
				selectedOrg.subOrganisations
			);
		}
		return (
			selectedOrg &&
			selectedOrg.subOrganisations &&
			selectedOrg.subOrganisations.length > 0
		);
	}

	getSubOrgs(orgValue: string): Organisation[] {
		console.log('getSubOrgs invoked..');

		const selectedOrg = this.organisations.find(org => org.value === orgValue);
		return selectedOrg ? selectedOrg.subOrganisations : [];

		// const selectedOrgControl = this.choices.at(index).get('selectedOrganisation');
		// const selectedOrg = selectedOrgControl.value as Organisation;
		// console.log('selected org', selectedOrg);
		// return selectedOrg ? selectedOrg.subOrganisations : [];
	}

	getSubOrgsForChoice(index: number): Organisation[] {
		const selectedOrgControl = this.choices.at(index).get('selectedOrganisation');
		const selectedOrg = selectedOrgControl.value;
		console.log('selected org: ', selectedOrg);
		if (selectedOrg && !this.subOrgsCache[selectedOrg]) {
			this.subOrgsCache[selectedOrg] = this.getSubOrgs(selectedOrg);
		}
		return this.subOrgsCache[selectedOrg] || [];
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
		choiceGroup.patchValue({ orgValue: null });
		this.choices.push(choiceGroup);
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


  getFormValues():void {
    const data = this.internationalOrganisationForm.value
    this.idFormEmitter.emit(data)
  }

}
