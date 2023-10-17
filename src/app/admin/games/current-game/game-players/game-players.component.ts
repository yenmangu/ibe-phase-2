import {
	Component,
	Input,
	OnDestroy,
	OnInit,
	AfterViewInit,
	ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Subject, takeUntil, Subscription, takeLast } from 'rxjs';
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
export class GamePlayersComponent implements OnInit, AfterViewInit, OnDestroy {
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

	compositeForm: FormGroup;

	pairsTableFormData: any = {};
	teamsTableFormData: any = {};
	tableFormData: any = {};

	isTeams: boolean = false;
	isPairs: boolean = false;
	isIndividual: boolean = false;

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
			.pipe(takeUntil(this.destroy$),tag('selected match type'))
			.subscribe(value => {
				this.matchType = value;
				// console.log('gamePlayers confirming: ', this.matchType)
			});
	}

	ngOnInit(): void {
		console.log('players-table component init with: ', this.initialTableData);

		this.isLoading = true
		this.fetchInitialTableData();
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
		// console.log('game-players initialTableData: ', this.initialTableData);
	}

	ngAfterViewInit(): void {}

	fetchInitialTableData(): void {
		this.isLoading = true
		this.currentGamesDatabase
			.fetchAndProcessGameData()
			.pipe(takeUntil(this.destroy$), tag('currentGame fetchProcessData'))
			.subscribe({
				next: data => {
					if (data) {
						// console.log('initialTableData: ', JSON.stringify(data, null, 2));
						this.initialTableData = data;
						const { matchType } = data;
						matchType.pairs
							? (this.matchType = 'pairs')
							: matchType.teams
							? (this.matchType = 'teams')
							: (this.matchType = 'individual');
					} else {
						this.initialTableData = [];
					}
					this.isLoading = false;
				},
				error: err => {
					console.error('Error fetching current game data: ', err);
					this.isLoading = false;
				}
			});
	}

	refresh(): void {
		this.fetchInitialTableData();
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
		let values;
		if (this.eventName !== undefined) {
			combinedFormData.eventName = this.eventName;
		}
		if (this.matchType === 'pairs') {
			values = this.pairsForm.getPairsFormData();
			console.log('pairs form values: ', JSON.stringify(values, null, 2));
		} else {
			values = this.teamsForm.getTeamFormData();
			console.log('team form values: ', JSON.stringify(values, null, 2));
		}

		combinedFormData.tableFormData = values;
		console.log('table form data: ', tableFormData);
		console.log('combined form data: ', combinedFormData);
		if (this.forwardDate) {
			const day = this.forwardDate.getDate();
			const month = this.forwardDate.toLocaleDateString('default', {
				month: 'short'
			});
			const year = this.forwardDate.getFullYear();
			dateFormData = `${day} ${month} ${year}`;
			console.log('date form data: ', dateFormData);

			combinedFormData.dateFormData = dateFormData;
		}

		const { game_code, dir_key } = this.getCredentials();
		console.log('credentials checking: ', game_code, dir_key);
		combinedFormData.table_config = true;

		this.apiCoordination
			.invokeAPICoordination(combinedFormData, game_code, dir_key)
			.pipe(tag('current game form'))
			.subscribe({
				next: response => {
					console.log('response from http services: ', response);
				},
				error: error => {
					console.error('error in the response from http service: ', error);
				}
			});
	}

	private getCredentials(): any {
		const game_code = localStorage.getItem('GAME_CODE');
		const dir_key = localStorage.getItem('DIR_KEY');
		return { game_code, dir_key };
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
