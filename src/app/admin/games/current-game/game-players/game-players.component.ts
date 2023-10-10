import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Subject, takeUntil, Subscription } from 'rxjs';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { EventDetailModel, EventDetails } from '../../data/event.options';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { TablesService } from '../../services/tables.service';
import { CurrentGamesDatabaseService } from '../../services/current-games-database.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { SharedGameDataService } from '../../services/shared-game-data.service';
import { PairsTableComponent } from '../../pairs-table/pairs-table.component';
import { TeamsTableComponent } from '../../teams-table/teams-table.component';
import { DataService } from '../../services/data.service';
import { ProcessMatchDataService } from '../../services/process-match-data.service';
import { CurrentEventService } from '../../services/current-event.service';
@Component({
	selector: 'app-game-players',
	templateUrl: './game-players.component.html',
	styleUrls: ['./game-players.component.scss']
})
export class GamePlayersComponent implements OnInit, OnDestroy {
	@Input() eventName: string;
	@Input() initialTableData: any = undefined
	@Input() isLoading: boolean = true;
	@ViewChild(PairsTableComponent) pairsForm: PairsTableComponent;
	@ViewChild(TeamsTableComponent) teamsForm: TeamsTableComponent;
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	destroy$ = new Subject<void>();
	eventDetails: EventDetailModel[] = EventDetails;
	tableOption = 'none';
	forwardDate: Date | null;

	matchTypeSubscription: Subscription;
	matchType: string = '';

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

	pairsTableFormData: any = {};
	teamsTableFormData: any = {};
	tableFormData: any = {};

	constructor(
		private breakpointService: BreakpointService,
		private sharedDataService: SharedDataService,
		private tablesService: TablesService,
		private sharedGameDataService: SharedGameDataService,
		private fb: FormBuilder,
		private currentEventService: CurrentEventService,
		private dataService: DataService,
		private processMatchDataService: ProcessMatchDataService,
		private indexedDatabaseStatus: IndexedDatabaseStatusService,
		private currentGamesDatabaseService: CurrentGamesDatabaseService
	) {
		this.sharedDataService.selectedMatchType$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.matchType = value;
				// console.log('gamePlayers confirming: ', this.matchType)
			});
	}

	ngOnInit(): void {
		console.log('players-table component init with: ', this.initialTableData);

		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
		// console.log('game-players initialTableData: ', this.initialTableData);
	}

	onOptionSelected(selctedOption: string) {
		this.tableOption = selctedOption;
		this.tablesService.updateTableConfig(selctedOption);
	}

	onPairsTableValueChanged(formData: any) {
		this.pairsTableFormData = formData;
	}
	onTeamTableValueChanged(formData: any) {
		this.teamsTableFormData = formData;
	}

	captureFormData() {
		let tableFormData: any = {};
		let dateFormData: any | null = {};
		let combinedFormData: any = {};
		if (this.eventName !== undefined) {
			combinedFormData.eventName = this.eventName;
		}
		if (this.matchType === 'pairs') {
			tableFormData = this.pairsForm.getPairsFormData();
		} else {
			tableFormData = this.teamsForm.getTeamFormData();
		}
		combinedFormData.tableFormData = tableFormData;
		if (this.forwardDate) {
			const day = this.forwardDate.getDate();
			const month = this.forwardDate.toLocaleDateString('default', {
				month: 'short'
			});
			const year = this.forwardDate.getFullYear();
			dateFormData = `${day} ${month} ${year}`;
			combinedFormData.dateFormData = dateFormData;
		}

		console.log(
			'Form Data in child Component: ',
			tableFormData ? tableFormData : 'No Table Form Data'
		);
		console.log(
			'Form Data in parent Component: ',
			dateFormData ? dateFormData : 'No Date Form Data'
		);
		console.log('Combined Form Data: ', combinedFormData);
	}

	private updateTableConfig(selectedOption: string) {
		for (const key in this.tablesConfig) {
			if (this.tablesConfig.hasOwnProperty(key)) {
				this.tablesConfig[key] = key === selectedOption;
			}
		}
		console.log(this.tablesConfig);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
