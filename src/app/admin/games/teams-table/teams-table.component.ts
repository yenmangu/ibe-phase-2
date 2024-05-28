import {
	Component,
	EventEmitter,
	Output,
	Input,
	OnInit,
	OnDestroy,
	AfterViewInit,
	ChangeDetectorRef
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
import { TeamsService } from '../services/teams.service';

@Component({
	selector: 'app-teams-table',
	templateUrl: './teams-table.component.html',
	styleUrls: ['./teams-table.component.scss']
})
export class TeamsTableComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() initialTableData: any;
	@Input() loadingStatus: boolean = true;
	@Output() teamFormData: EventEmitter<any> = new EventEmitter<any>();
	@Output() startView: EventEmitter<boolean> = new EventEmitter<boolean>();
	teamsForm: FormGroup;
	pairConfig: any = {};
	tableConfig: any;
	tableConfiguration: string[];
	formData: any = {};
	matchType: string;
	currentBreakpoint: string = '';
	teamsPerSide: number = null;
	pairNumbers: any = {};
	currentShownCols: number;
	sideLabels: FormArray;
	numberOfSides: number;
	sideTeamMap: any = {};
	// northSide: any[] = [];
	// southSide: any[] = [];
	// eastSide: any[] = [];
	// westSide: any[] = [];
	sitters: any[] = [];
	stratification: any[] = [];
	labels: any = [];
	abbreviations: any[] = [];
	boardCols: any[] = [];
	tables: { north: string[]; south: string[]; east: string[]; west: string[] };

	teamOrder: boolean = true;
	// ewSitters: any[] = [];

	originalFormValues: any;
	changedFields: { [key: string]: { previousValue: any; newValue: any } } = {};

	columns: string[] = ['north', 'n/s', 'south', 'east', 'e/w', 'west'];
	tableNumbers: string[];
	isLoading$: boolean = true;
	nsStartOrder: number[] = [];
	ewStartOrder: number[] = [];
	totalTables: number;
	public cardinalObject: { north: any[]; south: any[]; east: any[]; west: any[] };

	private arraysData: any = {};

	public disableControls: boolean | null | undefined = false;

	constructor(
		private fb: FormBuilder,

		private tablesService: TablesService,
		private teamsService: TeamsService
	) {
		this.tablesService.tablesConfig$
			// .pipe(tag('team tables config'))
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
			const { sideTeamMap, teams, sidesOf, teamNumbers } = this.initialTableData;
			this.sideTeamMap = sideTeamMap;
			console.log(
				'Initial table data in teams tables component: ',
				this.initialTableData
			);
			this.tableNumbers = Object.keys(teams);
			// console.log('Table numbers in teams.component: ', this.tableNumbers);

			this.pairConfig = this.initialTableData.pairConfig;
			this.pairNumbers = this.initialTableData.pairNumbers;
			this.teamsPerSide = teams.length / sideTeamMap.totalSides;
			this.numberOfSides = sideTeamMap.totalSides;
			// console.log('total sides: ', sideTeamMap.totalSides);
			this.sitters = this.initialTableData.sitters.ewSitters;
			this.labels = this.initialTableData.labels.ewLabels;
			this.stratification = this.initialTableData.stratification.ewStratification;
			this.abbreviations = this.initialTableData.abbreviations.ewAbbreviations;
			this.boardCols = this.initialTableData.boardCols;
			this.tables = this.teamsService.generateTables(teams, teamNumbers);
			this.nsStartOrder = this.initialTableData.nsStartOrder;
			this.ewStartOrder = this.initialTableData.ewStartOrder;
			this.totalTables = Number(this.initialTableData.totalTables);
			// this.createSideLabelsFormArray(this.numberOfSides);
			this.arraysData = this.teamsService.generateArrays(
				teams,
				false,
				this.initialTableData.totalTeams,
				this.initialTableData.pairConfig,
				teamNumbers
			);
			if (
				this.arraysData &&
				(this.arraysData !== undefined || this.arraysData !== null)
			) {
				// console.log('Generating team form:');

				this.teamsForm = this.createNewTeamsForm();
			}
			this.teamsService.generateTableConfig(
				this.initialTableData.teams,
				this.nsStartOrder,
				this.ewStartOrder,
				this.totalTables
			);
		}
		const cardinalObject = this.teamsService.builCardinals(
			this.initialTableData.teamArray
		);
		// this.structureCardinals(cardinalObject);
		if (this.teamsForm) {
			console.log('teams form: ', this.teamsForm);
		}
		this.originalFormValues = this.teamsForm.value;
		this.teamsForm.valueChanges.subscribe(changedValues => {
			console.log('changed value: ', changedValues);
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

	// structureCardinals(cardinalObject) {
	// 	console.log('resturcturing cardinals');

	// 	const { north, south, east, west } = cardinalObject;
	// 	this.northSide = north;
	// 	this.southSide = south;
	// 	this.eastSide = east;
	// 	this.westSide = west;
	// }

	onSwitchOrder(): void {
		console.log('Switching order: ', this.teamOrder);

		this.teamOrder = !this.teamOrder;
		if (!this.teamOrder) {
			this.startView.emit(true);
			this.toggleInputs(true);
		} else {
			this.startView.emit(false);
			this.toggleInputs(false);
		}
		const { orderArray, ewStartOrder } = this.getOrderArray(
			this.teamOrder ? 'team' : 'start'
		);
		const sortedArr = this.changeArrayOrder(orderArray);
		if (this.teamOrder) {
			this.getArrays(orderArray);
		} else {
			this.getArrays(orderArray, ewStartOrder);
		}
		this.createNewTeamsForm();
		// this.structureCardinals(cardinalObject);
	}

	toggleInputs(disabled: boolean): void {
		this.switchDisableControls(disabled);
	}

	private switchDisableControls(disable: boolean): void {
		if (disable) {
			this.disableControls = true;
		} else {
			// Must use 'null' as using [attr.*] must take a non truthy value to re enable
			this.disableControls = null;
		}
	}

	/*
	 *
	 *
	 *
	 *
	 */

	private getOrderArray(order: 'team' | 'start') {
		const { nsStartOrder, teamNumbers, ewStartOrder } = this.initialTableData;
		let orderArray: any[] = [];
		order === 'team' ? (orderArray = teamNumbers) : (orderArray = nsStartOrder);
		return { orderArray, ewStartOrder };
	}

	private getArrays(orderArray: number[], ewStartOrder?: number[]) {
		let startOrder: boolean = false;
		if (!this.teamOrder) {
			startOrder = true;
		}
		this.arraysData = this.teamsService.generateArrays(
			this.initialTableData.teams,
			startOrder,
			this.initialTableData.totalTeams,
			this.initialTableData.pairConfig,
			orderArray,
			ewStartOrder
		);
	}

	changeArrayOrder(orderArray: number[]) {
		const { teamArray } = this.initialTableData;
		// console.log('teamArray before orderTeamArray: ', teamArray);
		const sortedArr = this.teamsService.orderTeamArray(teamArray, orderArray);

		return sortedArr;
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
		if (this.arraysData) {
			const arrayKeys = Object.keys(this.arraysData);
			// console.log('ArrayKeys: ', arrayKeys);

			arrayKeys.forEach((key, index) => {
				// console.log(`index: ${index}\nkey in question: ${key}`);

				if (this.arraysData.hasOwnProperty(key)) {
					const table = this.arraysData[key];
					const tableControls = this.createTableControls(table, Number(key));
					// const tableControls = this.createTableControl(table);
					teamsFormControls[key] = this.fb.group(tableControls);
				}
			});
		}

		return (this.teamsForm = this.fb.group(teamsFormControls));
	}

	private createTableControls(
		table: any,
		arrayNumber: number
	): { [key: string]: any } {
		// console.log('Array number in createTableControls: ', arrayNumber);

		const tableControls = {};
		const namesArray = this.arraysData[arrayNumber];
		const teamsArray = this.initialTableData.teams;
		// console.log('teams array: ', teamsArray);

		const initialArray = [
			// 'nsPairs',
			'north',
			'south',
			// 'ewPairs',
			'east',
			'west'
		];
		const additionalArray = [
			'team_name',
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
			const index = arrayNumber - 1;
			console.log('Index used in createTablesControls: ', index);

			for (const field of initialArray) {
				// if (field === 'nsPairs' || field === 'ewPairs') {
				// 	if (field === 'nsPairs') {
				// 		tableControls[field] = this.pairNumbers.northSouth[index];
				// 	}
				// 	if (field === 'ewPairs') {
				// 		tableControls[field] = this.pairNumbers.eastWest[index];
				// 	}
				// } else {
				const controlName = `${field}`;
				const initialValue = this.getInitialValue(namesArray, field);
				console.log('field: ', field, '    initial value: ', initialValue);

				tableControls[field] = [initialValue, Validators.required];
				// }
			}
			for (const field of additionalArray) {
				if (field === 'ns_sitters' || field === 'ew_sitters') {
					// console.log('in sitters: ');

					if (field === 'ns_sitters') {
						// console.log('index: ', index);

						tableControls[field] = null;
						// console.log('tableControl for ns_sitters: ', tableControls[field]);
					}
					if (field === 'ew_sitters' && this.sitters) {
						// console.log('index: ', index);
						tableControls[field] = this.sitters[index] || false;
						console.log('Sitters table control: ', tableControls[field]);

						// console.log('tableControl for ew_sitters: ', tableControls[field]);
					}
				} else if (field === 'ns_labels' || field === 'ew_labels') {
					if (field === 'ns_labels') {
						tableControls[field] = null;
					}
					if (field === 'ew_labels') {
						tableControls[field] = this.labels[index];
					}
					console.log('Labels tables controls: ', tableControls[field]);
				} else if (field === 'ew_stratification') {
					tableControls[field] = this.stratification[index];
					console.log('Stratification table control: ', tableControls[field]);
				} else if (field === 'ew_abbrev') {
					tableControls[field] = this.abbreviations[index];
				} else {
					const controlName = `${field}`;
					// const initialValue = this.getInitialValue(namesArray, field);
					tableControls[field] = null;
				}
			}

			const teamIndex = arrayNumber - 1;
			const teamName = this.initialTableData.teams[teamIndex + 1]?.teamName || '';
			tableControls['team_name'] = [teamName];
		}

		return tableControls;
	}

	private getAdditionalValue(array: any[], field: string) {
		return array;
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
			const changedFields = this.changedFields;
			return { formData, changedFields, teams: true };
		}
		return null;
	}

	ngOnDestroy(): void {}
}
