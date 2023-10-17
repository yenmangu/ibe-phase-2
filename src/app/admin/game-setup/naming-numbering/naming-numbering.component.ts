import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-naming-numbering',
	templateUrl: './naming-numbering.component.html',
	styleUrls: ['./naming-numbering.component.scss']
})
export class NamingNumberingComponent {
	@Output() namingNumberingEmitter: EventEmitter<any> = new EventEmitter<any>();

	mitchellEwConfig = [
		{ display: 'Add at least ten', value: 'add_10' },
		{ display: 'Add at least twenty', value: 'add_20' },
		{ display: 'Take table number', value: 'table_number' },
		{ display: 'Follow on from N/S', value: 'follow_ns' }
	];
	tableNamingConfig = [
		{ display: '1A-8A, 1B-8B etc', value: '' },
		{ display: 'Add at least ten per section, start from 1', value: 'from_1' },
		{ display: 'Add at least ten per section, start from 11', value: 'from_11' },
		{ display: 'Strictly sequntial', value: 'sequential' }
	];

	shortenPlayerNames = [
		{ display: 'First names', value: 'first_names' },
		{ display: 'Last names', value: 'last_names' }
	];
	defaultNameStyle = [
		{ display: 'Historical Figures', value: 'historical_figures' },
		{ display: 'U.S. Presidents & Spouses', value: 'presidents_spouses' },
		{ display: 'Greek Goddesses', value: 'greek_goddesses' },
		{ display: "'Tap to select/Long-press to edit'", value: 'tap' }
	];

	namingNumberingForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.namingNumberingForm = new FormGroup(this.createFormControls());
	}

	createFormControls() {
		const controls = {};

		this.mitchellEwConfig.forEach(item => {
			controls[item.display] = new FormControl(item.value);
		});
		this.tableNamingConfig.forEach(item => {
			controls[item.display] = new FormControl(item.value);
		});
		this.shortenPlayerNames.forEach(item => {
			controls[item.display] = new FormControl(item.value);
		});
		this.defaultNameStyle.forEach(item => {
			controls[item.display] = new FormControl(item.value);
		});
		return controls;
	}

	getFormValues(): void {
		const data = this.namingNumberingForm.value;
		this.namingNumberingEmitter.emit(data);
	}
}
