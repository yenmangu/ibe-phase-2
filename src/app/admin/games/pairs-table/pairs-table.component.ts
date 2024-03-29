import {
	Component,
	EventEmitter,
	OnInit,
	OnDestroy,
	Input,
	Output,
	AfterViewInit
	// ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { TablesService } from '../services/tables.service';

import { tag } from 'rxjs-spy/cjs/operators';
@Component({
	selector: 'app-pairs-table',
	templateUrl: './pairs-table.component.html',
	styleUrls: ['./pairs-table.component.scss']
	// changeDetection: ChangeDetectionStrategy.Default
})
export class PairsTableComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() initialTableData: any;
	@Input() loadingStatus: boolean = true;
	@Output() formValuesChanged = new EventEmitter<any>();
	eventName: string = '';
	pairConfig: any = {};
	pairNumbers: any = {};
	tableConfig: any;
	tableConfigOption: string[];
	formData: any = {};
	matchType: string = '';
	matchTypeSubscription: Subscription;
	currentBreakpoint: string = '';
	pairsForm: FormGroup;
	columns: string[] = ['north', 'n/s', 'south', 'east', 'e/w', 'west'];
	isLoading$: boolean = true;
	northSide: [] = [];
	southSide: [] = [];
	eastSide: [] = [];
	westSide: [] = [];
	individualNumbers: any = {};
	nsSitters: any[] = [];
	ewSitters: any[] = [];
	nsLabels: any[] = [];
	ewLabels: any[] = [];

	originalFormValues: any;
	changedFields: { [key: string]: { previousValue: any; newValue: any } } = {};
	tableNumbers: string[];

	breakpoint: string = '';

	private tableConfigSubscription: Subscription;
	private destroy$ = new Subject<void>();
	private fromDataTableData: any = {};

	constructor(
		private fb: FormBuilder,
		private breakpointService: BreakpointService,
		private tablesService: TablesService
	) {
		this.tablesService.tablesConfig$.pipe(tag('pairs-table')).subscribe(config => {
			this.tableConfig = config;
			console.log('tableConfig in component: ', this.tableConfig);

			this.tableConfigOption = Object.keys(config);

			// console.log('pairs-table config: ', this.tableConfig);
		});
		this.isLoading$ = true;
		this.breakpointService.currentBreakpoint$.subscribe(breakpoint => {
			this.currentBreakpoint = breakpoint;
			console.log('current breakpoint: ', this.currentBreakpoint);
		});
	}

	ngOnInit(): void {
		console.log('initialTableData: ', this.initialTableData);

		// console.log('tables: ', this.initialTableData.tables);
		this.matchType = this.initialTableData.matchString;
		this.tableNumbers = Object.keys(this.initialTableData.tableConfig);
		this.fromDataTableData = this.initialTableData.tables;
		this.pairConfig = this.initialTableData.pairConfig;
		// console.log('pair config: ', this.pairConfig);

		this.pairNumbers = this.initialTableData.pairNumbers;
		this.nsSitters = this.initialTableData.sitters.nsSitters;
		this.ewSitters = this.initialTableData.sitters.ewSitters;
		this.nsLabels = this.initialTableData.labels.nsLabels;
		this.ewLabels = this.initialTableData.labels.ewLabels;
		this.pairsForm = this.createNewPairsForm();
		const {
			cardinals: { north, south, east, west }
		} = this.initialTableData;
		this.northSide = north;
		this.southSide = south;
		this.eastSide = east;
		this.westSide = west;
		this.individualNumbers = this.initialTableData.individuals;

		console.log('Sitters Array in  pairsTable: ', this.nsSitters, this.ewSitters);

		// console.log('\n ***************** \n individual numbers: ', this.individualNumbers);

		if (this.pairsForm) {
		} else {
			console.log('no form');
		}

		this.originalFormValues = this.pairsForm.value;
		this.pairsForm.valueChanges.subscribe(changedValues => {
			this.changedFields = {};
			this.formValuesChanged.emit('changed');
			for (const key in changedValues) {
				if (changedValues.hasOwnProperty(key)) {
					if (changedValues[key] !== this.originalFormValues[key]) {
						this.changedFields[key] = {
							previousValue: this.originalFormValues[key],
							newValue: changedValues[key]
						};
					}
				}
			}
		});
	}
	ngAfterViewInit(): void {}
	private createNewPairsForm(): FormGroup {
		const pairsFormControls = {};

		for (const tableNumber in this.fromDataTableData) {
			if (this.fromDataTableData.hasOwnProperty(tableNumber)) {
				const table = this.fromDataTableData[tableNumber];
				const tableControls = this.createTableControls(table, tableNumber);
				pairsFormControls[tableNumber] = this.fb.group(tableControls);
			}
		}

		return (this.pairsForm = this.fb.group(pairsFormControls));
	}

	private createTableControls(
		table: any,
		tableNumber: string
	): { [key: string]: any } {
		const tableControls = {};
		const namesArray = this.initialTableData.tables[tableNumber];
		const initialArray = [
			// 'northIndividual',
			// 'southIndividual',
			'nsPairs',
			'north',
			'south',
			// 'eastIndividual',
			// 'westIndividual',
			'ewPairs',
			'east',
			'west'
		];
		const additionalArray = [
			'venues',
			'ns_stratification',
			'ew_stratification',
			'ns_sitters',
			'ew_sitters',
			'ns_adjustments',
			'ew_adjustments',
			'ns_handicaps',
			'ew_handicaps',
			'ns_labels',
			'ew_labels',
			'ns_abbrev',
			'ew_abbrev',
			'boardCol',
			'time_from',
			'time_to',
			'lunch'
		];

		if (namesArray) {
			// console.log('in names array');
			const index = parseInt(tableNumber, 10) - 1;

			for (const field of initialArray) {
				if (field === 'nsPairs' || field === 'ewPairs') {
					// console.log('tableNumber index: ', tableNumber);

					if (field === 'nsPairs') {
						// console.log('ns pair number: ', this.pairNumbers.northSouth[index]);

						// at table number [i]
						tableControls[field] = this.pairNumbers.northSouth[index];
					} else if (field === 'ewPairs') {
						// console.log('ew pair number: ', this.pairNumbers.eastWest[index]);
						tableControls[field] = this.pairNumbers.eastWest[index];
					}
				} else {
					const controlName = `${field}`;
					const initialValue = this.getInitialValue(namesArray, field);
					// console.log('Initial value: ', initialValue);

					tableControls[field] = [initialValue, Validators.required];
				}
			}
			for (const field of additionalArray) {
				if (
					field === 'ns_sitters' ||
					field === 'ew_sitters' ||
					field === 'ns_labels' ||
					field === 'ew_labels'
				) {
					if (field === 'ns_sitters' && this.nsSitters) {
						tableControls[field] = this.nsSitters[index] || false;
					}
					if (field === 'ew_sitters' && this.ewSitters) {
						tableControls[field] = this.ewSitters[index] || false;
					}
					if (field === 'ns_labels' && this.nsLabels) {
						tableControls[field] = this.nsLabels[index] || '';
					}
					if (field === 'ew_labels' && this.ewLabels) {
						tableControls[field] = this.ewLabels[index] || '';
					}
				} else {
					const controlName = `${field}`;
					tableControls[field] = [null];
				}
			}
		}
		console.log('Table controls after populating: ', tableControls);

		return tableControls;
	}

	private assignPairsNumbers(pairConfig: any): any {}
	private getInitialValue(namesArray: any[], field: string): any {
		return namesArray[
			field === 'north' ? 0 : field === 'south' ? 1 : field === 'east' ? 2 : 3
		];
	}

	getConditionalFormGroup(tableNumber: string): FormGroup {
		// Check if the pairsForm exists
		if (!this.pairsForm) {
			return new FormGroup({});
		}
		const tableFormGroup = this.pairsForm.get(tableNumber) as FormGroup;
		if (!tableFormGroup) {
			return new FormGroup({});
		}
		const conditionalFormGroup = tableFormGroup.get('conditional') as FormGroup;
		if (!conditionalFormGroup) {
			return new FormGroup({});
		}
		return conditionalFormGroup;
	}

	getControls(tableNumber: string) {
		return (this.pairsForm.get(tableNumber) as FormGroup).controls;
	}

	getTables() {
		if (this.pairsForm.valid) {
			console.log(this.pairsForm.value);
		}
	}
	getFormGroup(tableNumber: string): FormGroup {
		return this.pairsForm.get(tableNumber.toString()) as FormGroup;
	}
	getTableNumbers() {
		return Object.keys(this.pairsForm.controls);
	}
	getTableControlName(tableNumber: string, fieldName: string): FormControl<any> {
		return this.pairsForm.get(
			`_${tableNumber.toString()}.${fieldName}`
		) as FormControl<any>;
	}

	getConditionalControl(tableNumber: string, conditional): FormControl {
		return this.pairsForm.get(
			`_${tableNumber.toString()}.${conditional}`
		) as FormControl;
	}

	onSubmit() {
		console.log(this.pairsForm.value);
		if (this.pairsForm.valid) {
		}
	}

	getPairsFormData() {
		if (this.pairsForm.valid) {
			const formData = this.pairsForm.value;
			// console.log('pairs form component form data: ', formData);

			const changedFields = this.changedFields;
			return { formData, changedFields };
		}
		return null;
	}

	getPlayerNumber(players) {}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
