import {
	Component,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
	Input
} from '@angular/core';
import { take, takeUntil, Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import * as data from '../dev/temp_table.json';
import { SharedGameDataService } from '../services/shared-game-data.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { CurrentEventService } from '../services/current-event.service';
import { ProcessMatchDataService } from '../services/process-match-data.service';

@Component({
	selector: 'app-match-tables',
	templateUrl: './match-tables.component.html',
	styleUrls: ['./match-tables.component.scss']
})
export class MatchTablesComponent implements OnInit, OnDestroy {
	@Input() initialTableData: any;
	@Output() formValuesChanged = new EventEmitter<any>();
	// @Output() formSubmitted = new EventEmitter<any>()
	formData: any = {};
	matchType: string = '';
	matchTypeSubscription: Subscription;

	currentBreakpoint: string = '';

	// Dev Data ////////////////////////////////////
	table_data: any = (data as any).default;

	tablesConfig: any = {
		venues: false,
		stratification: false,
		sitters: false,
		adjustments: false,
		handicaps: false,
		labels: false,
		abbrev: false,
		boardCol: false,
		timesLunch: false
	};
	roundConfig: any = {
		round_1: {
			round_number: 1,
			timings: '',
			lunch: true
		},

		round_2: {
			round_number: 2,
			timings: '',
			lunch: true
		},
		round_3: {
			round_number: 3,
			timings: '',
			lunch: true
		},
		round_4: {
			round_number: 4,
			timings: '',
			lunch: true
		},
		round_5: {
			round_number: 5,
			timings: '',
			lunch: true
		},
		round_6: {
			round_number: 6,
			timings: '',
			lunch: true
		},
		round_7: {
			round_number: 7,
			timings: '',
			lunch: true
		},
		round_8: {
			round_number: 8,
			timings: '',
			lunch: true
		},
		round_9: {
			round_number: 9,
			timings: '',
			lunch: true
		}
	};

	config: any = {
		columnWidth: {
			_1: 'auto',
			_2: 'auto',
			_3: 'auto',
			_4: 'auto',
			_5: 'auto',
			_6: 'auto'
		}
	};

	public currentDisplayedData: string[] = [
		'table_number',
		'north',
		'n/s',
		'south',
		'east',
		'e/w',
		'west'
	];

	// Live Properties /////////////////////////////

	pairsForm: FormGroup;
	teamsForm: FormGroup;
	pairsInputColumns: { name: string; fields: { label: string; name: string }[] }[] =
		[];
	teamsInputColumns: { name: string; fields: { label: string; name: string }[] }[] =
		[];

	//
	private tableConfigSubscription: Subscription;
	private destroy$ = new Subject<void>();
	constructor(
		private fb: FormBuilder,
		private breakpointService: BreakpointService,
		private sharedGamedataService: SharedGameDataService,
		private sharedDataService: SharedDataService,
		private processMatchData: ProcessMatchDataService
	) {
		this.tableConfigSubscription =
			this.sharedGamedataService.tableConfigOption$.subscribe(selectedOption => {
				this.updateTableConfig(selectedOption);
			});
		this.matchTypeSubscription = this.sharedDataService.selectedMatchType$
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: matchType => {
					this.matchType = matchType;
					console.log('confirming: ', this.matchType);
				}
			});

		console.log('', this.matchType);
	}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
		// Form management
		this.teamsForm = this.fb.group({
			teams: this.fb.array([])
		});

		const teamsFormArray = this.teamsForm.get('teams') as FormArray;
		// 	const numberOfTeams =

		// 	for (let i = 0; i < number)
		// }

		console.log('match tables initial table data: ', this.initialTableData);
		// this.processMatchData.getNames()
	}

	getEntries(table: any): string[] {
		return [table.n, table.s, table.e, table.w];
	}
	getTableKeys(tableObj: any): string[] {
	
		return Object.keys(tableObj);
	}
	getRoundKeys(roundConfig: any): string[] {
		return Object.keys(roundConfig);
	}

	private updateTableConfig(selectedOption: string) {
		for (const key in this.tablesConfig) {
			if (this.tablesConfig.hasOwnProperty(key)) {
				this.tablesConfig[key] = key === selectedOption;
			}
		}
		console.log(this.tablesConfig);
	}

	onPairsFormValueChange() {
		this.formValuesChanged.emit(this.formData);
	}
	onTeamsFormValueChange() {
		this.formValuesChanged.emit(this.formData);
	}

	ngOnDestroy(): void {
		this.destroy$.complete();
	}
}
