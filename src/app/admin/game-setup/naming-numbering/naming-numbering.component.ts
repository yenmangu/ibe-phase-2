import {
	Component,
	Output,
	EventEmitter,
	OnInit,
	Input,
	OnDestroy
} from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'app-naming-numbering',
	templateUrl: './naming-numbering.component.html',
	styleUrls: ['./naming-numbering.component.scss']
})
export class NamingNumberingComponent implements OnInit, OnDestroy {
	@Input() namingNumberingSettings: any;
	@Input() successMessage: boolean;
	@Output() namingNumberingEmitter: EventEmitter<any> = new EventEmitter<any>();

	mitchellEwConfig = [
		{ display: 'Add at least ten', value: 'add_10' },
		{ display: 'Add at least twenty', value: 'add_20' },
		{ display: 'Take table number', value: 'table_number' },
		{ display: 'Follow on from N/S', value: 'follow_ns' }
	];
	tableNamingConfig = [
		{ display: '1A-8A, 1B-8B etc', value: 'a' },
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
	clicked: boolean = false;

	buttonShowSuccess: boolean = false


	constructor(private fb: FormBuilder) {
		this.namingNumberingForm = new FormGroup(this.createFormControls());
	}

	ngOnInit(): void {
		// console.log('namsets: ', this.namingNumberingSettings);
		if (
			this.namingNumberingForm &&
			!this.checkEmpty(this.namingNumberingSettings)
		) {
			// this.namingNumberingForm.setValue(this.namingNumberingSettings);
			this.populateForm();
		}

		this.namingNumberingForm.valueChanges.subscribe(value => {
			if (value) {
				this.clicked = true;
				this.buttonShowSuccess = false;
				console.log('form clicked: ', this.clicked);
			}
		});
	}

	getButtonMessage():boolean{
		if(!this.clicked && this.successMessage){
			return true
		} else {
			return false
		}
	}


	checkEmpty(obj) {
		for (var i in obj) return false;
		return true;
	}

	createFormControls() {
		const controls = {};

		console.log();

		return {
			mitchellEWNumbers: new FormControl(this.mitchellEwConfig[0].value),
			tableNaming: new FormControl(this.tableNamingConfig[0].value),
			shortenPlayerNames: new FormControl(this.shortenPlayerNames[0].value),
			defaultNameStyle: new FormControl(this.defaultNameStyle[0].value)
		};
	}

	populateForm(): void {
		if (this.namingNumberingSettings && this.namingNumberingForm) {
			const {
				mitchellEWNumbers,
				tableNaming,
				shortenPlayerNames,
				defaultNameStyle
			} = this.namingNumberingSettings;
			console.log('naming numbering settings: ', this.namingNumberingSettings);

			this.namingNumberingForm
				.get('mitchellEWNumbers')
				.setValue(mitchellEWNumbers || this.mitchellEwConfig[0].value);
			this.namingNumberingForm
				.get('tableNaming')
				.setValue(tableNaming || this.tableNamingConfig[0].value);
			this.namingNumberingForm
				.get('shortenPlayerNames')
				.setValue(shortenPlayerNames || this.shortenPlayerNames[0].value);
			this.namingNumberingForm
				.get('defaultNameStyle')
				.setValue(defaultNameStyle || this.defaultNameStyle[3].value);
		}
	}

	getNamingNumberingValues(): void {
		const data = {
			formName: 'namingNumbering',
			xmlElement: 'namsets',
			formData: this.namingNumberingForm.value
		};
		// const data = this.namingNumberingForm.value;
		// console.log('naming numbering values: ', this.namingNumberingForm.value);
		this.namingNumberingEmitter.emit(data);
		this.clicked = false;

	}
	ngOnDestroy(): void {
		this.successMessage = false;
	}
}
