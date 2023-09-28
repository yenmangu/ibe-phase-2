import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { take, takeUntil, Subject, Subscription } from 'rxjs';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import * as data from '../dev/temp_table.json';
import { SharedGameDataService } from '../services/shared-game-data.service';


@Component({
	selector: 'app-match-tables',
	templateUrl: './match-tables.component.html',
	styleUrls: ['./match-tables.component.scss']
})
export class MatchTablesComponent implements OnInit, OnDestroy {
	@Output() formValuesChanged = new EventEmitter<any>()
	// @Output() formSubmitted = new EventEmitter<any>()
	formData: any ={}


	currentBreakpoint: string = '';
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
	]

	private tableConfigSubscription: Subscription;
	private destroy$ = new Subject<void>();
	constructor(
		private breakpointService: BreakpointService,
		private sharedGamedataService: SharedGameDataService
	) {
		this.tableConfigSubscription =
			this.sharedGamedataService.tableConfigOption$.subscribe(selectedOption => {
				this.updateTableConfig(selectedOption);
			});
	}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
	}

	getEntries(table: any): string[] {
		return [table.n, table.s, table.e, table.w];
	}
	getTableKeys(tableObj: any): string[] {
		return Object.keys(tableObj);
	}
	getRoundKeys(roundConfig: any): string []{
		return Object.keys(roundConfig)
	}

	private updateTableConfig(selectedOption: string) {
		for (const key in this.tablesConfig) {
			if (this.tablesConfig.hasOwnProperty(key)) {
				this.tablesConfig[key] = key === selectedOption;
			}
		}
		console.log(this.tablesConfig);
	}

	onFormValueChange(){
		this.formValuesChanged.emit(this.formData)
	}

	ngOnDestroy(): void {
		this.destroy$.complete();
	}
}
