import {
	Component,
	EventEmitter,
	Output,
	Input,
	OnInit,
	OnDestroy,
	AfterViewInit
} from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
	FormArray
} from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { tag } from 'rxjs-spy/cjs/operators';
import { TablesService } from '../services/tables.service';

@Component({
	selector: 'app-teams-table',
	templateUrl: './teams-table.component.html',
	styleUrls: ['./teams-table.component.scss']
})
export class TeamsTableComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() initialTableData: any;
	@Input() loadingStatus: boolean = true;
	@Output() teamFormData: EventEmitter<any> = new EventEmitter<any>();
	teamsForm: FormGroup;
	tableConfig: any;
	tableConfiguration: string[];
	formData: any = {};
	matchType: string;
	currentBreakpoint: string = '';
	teamsPerSide: number = null;
	currentShownCols: number;
	sideLabels: FormArray;
	numberOfSides: number;
	sideTeamMap: any = {};

	originalFormValues: any;
	changedFields: { [key: string]: { previousValue: any; newValue: any } } = {};

	columns: string[] = ['north', 'n/s', 'south', 'east', 'e/w', 'west'];
	tableNumbers: string[];
	isLoading$: boolean = true;

	private tableData: any = {};

	constructor(
		private fb: FormBuilder,

		private tablesService: TablesService
	) {
		this.tablesService.tablesConfig$
			.pipe(tag('team tables config'))
			.subscribe(config => {
				this.tableConfig = config;
				this.tableConfiguration = Object.keys(this.tableConfig);
				this.currentShownCols = this.tableConfiguration.some(
					key => this.tableConfig[key]
				)
					? 8
					: 7;
			});
		this.sideLabels = this.fb.array([]);
	}

	ngOnInit(): void {
		if (this.initialTableData) {
			const { tables, sideTeamMap, teams, sidesOf } = this.initialTableData;
			this.sideTeamMap = sideTeamMap;
			console.log('tables: ', this.initialTableData.tables);
			this.tableNumbers = Object.keys(this.initialTableData.tables);
			this.tableData = this.initialTableData.tables;
			this.teamsPerSide = teams.length / sideTeamMap.totalSides;
			this.numberOfSides = sideTeamMap.totalSides;
			console.log('total sides: ', sideTeamMap.totalSides);
			// this.createSideLabelsFormArray(this.numberOfSides);
			this.teamsForm = this.createNewTeamsForm();
		}
		if (this.teamsForm) {
			console.log('teams form: ', this.teamsForm);
		}
		this.originalFormValues = this.teamsForm.value;
		this.teamsForm.valueChanges.subscribe(changedValues => {
			console.log('changed value: ', changedValues)
			this.changedFields = {};
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

	ngAfterViewInit(): void {
		console.log('teams form: ', this.teamsForm);
	}

	private createNewTeamsForm(): FormGroup {
		const teamsFormControls: any = {
			// sideLabels: this.sideLabels
		};
		for (let i = 0; i < this.numberOfSides; i++) {
			const controlName = 'sideLabel' + (i + 1);
			teamsFormControls[controlName] = new FormControl(
				this.sideTeamMap[i + 1].name
			);
		}
		for (const tableNumber in this.tableData) {
			if (this.tableData.hasOwnProperty(tableNumber)) {
				const table = this.tableData[tableNumber];
				const tableControls = this.createTableControls(table, tableNumber);
				// const tableControls = this.createTableControl(table);
				teamsFormControls[tableNumber] = this.fb.group(tableControls);
			}
		}
		return (this.teamsForm = this.fb.group(teamsFormControls));
	}

	private createTableControls(
		table: any,
		tableNumber: string
	): { [key: string]: any } {
		const tableControls = {};
		const namesArray = this.initialTableData.tables[tableNumber];
		const teamsArray = this.initialTableData.teams;
		const initialArray = ['north', 'south', 'east', 'west'];
		const additionalArray = [
			'team_name',
			'venues',
			'ns_stratification',
			'ew_stratification',
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
			for (const field of initialArray) {
				const controlName = `${field}`;
				const initialValue = this.getInitialValue(namesArray, field);
				tableControls[field] = [initialValue, Validators.required];
			}
			// for (const field of teamsArray) {
			// 	if (field !== 'team_name') {
			// 		const controlName = `${field}`;
			// 		tableControls[field] = [null];
			// 	}
			// }
			for (const field of additionalArray) {
				const controlName = `${field}`;
				tableControls[field] = [null];
			}
			const teamIndex = Number(tableNumber) - 1;
			const teamName = this.initialTableData.teamConfig[teamIndex]?.teamName || '';
			tableControls['team_name'] = [teamName];
		}

		return tableControls;
	}

	private getInitialValue(namesArray: any[], field: string) {
		return namesArray[
			field === 'north' ? 0 : field === 'south' ? 1 : field === 'east' ? 2 : 3
		];
	}

	getConditionalFormGroup(tableNumber: string): FormGroup {
		if (!this.teamsForm) {
			return new FormGroup({});
		}
		const tableFormGroup = this.teamsForm.get(tableNumber) as FormGroup;
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
		return (this.teamsForm.get(tableNumber) as FormGroup).controls;
	}
	getSideLabelControl(index: number): string {
		return 'sideLabel' + (index / this.teamsPerSide + 1);
	}

	getTables() {
		if (this.teamsForm.valid) {
			console.log(this.teamsForm.value);
		}
	}

	getTableNumbers() {
		// return Object.keys(this.teamsForm.controls);
		return Object.keys(this.initialTableData.tables).length;
	}

	getTableControlName(tableNumber: string, fieldName: string): FormControl<any> {
		return this.teamsForm.get(
			`_${tableNumber.toString()}.${fieldName}`
		) as FormControl;
	}

	getConditionalControl(tableNumber: string, conditional): FormControl {
		return this.teamsForm.get(
			`_${tableNumber.toString()}.${conditional}`
		) as FormControl;
	}

	onSubmit() {
		console.log(this.teamsForm.value);
	}

	getFormGroup(tableNumber: string): FormGroup {
		return this.teamsForm.get(tableNumber.toString()) as FormGroup;
	}

	getTeamFormData() {
		if (this.teamsForm.valid) {
			const formData = this.teamsForm.value;
			const changedFields = this.changedFields
			return { formData, changedFields };
		}
		return null;
	}

	ngOnDestroy(): void {}
}
