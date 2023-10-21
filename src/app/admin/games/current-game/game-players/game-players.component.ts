import {
	Component,
	Input,
	OnDestroy,
	OnInit,
	AfterViewInit,
	ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, Subscription, takeLast } from 'rxjs';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { EventDetailModel, EventDetails } from '../../data/event.options';
import { TablesService } from '../../services/tables.service';
import { PairsTableComponent } from '../../pairs-table/pairs-table.component';
import { TeamsTableComponent } from '../../teams-table/teams-table.component';
import { CurrentGamesDatabaseServiceService } from '../../services/current-games-database-service.service';
import { tag } from 'rxjs-spy/operators';
import { ApiDataCoordinationService } from '../../services/api/api-data-coordination.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { DomainService } from 'src/app/shared/services/domain.service';
@Component({
	selector: 'app-game-players',
	templateUrl: './game-players.component.html',
	styleUrls: ['./game-players.component.scss']
})
export class GamePlayersComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() eventName: string;
	@Input() initialTableData: any = undefined;
	@Input() isLoading: boolean = true;
	@ViewChild(PairsTableComponent) pairsForm: PairsTableComponent;
	@ViewChild(TeamsTableComponent) teamsForm: TeamsTableComponent;
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	destroy$ = new Subject<void>();
	eventDetails: EventDetailModel[] = EventDetails;
	tableOption = 'none';
	forwardDate: Date | null;
	gameCode: string = '';
	dirKey: string = '';
	routerLink: string;
	publicLink: string;
	origin: string;

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
		private route: ActivatedRoute,
		private breakpointService: BreakpointService,
		private tablesService: TablesService,
		private fb: FormBuilder,
		private currentGamesDatabase: CurrentGamesDatabaseServiceService,
		private apiCoordination: ApiDataCoordinationService,
		private userDetailService: UserDetailsService,
		private domainService: DomainService
	) {
		this.sharedDataService.selectedMatchType$
			.pipe(takeUntil(this.destroy$), tag('selected match type'))
			.subscribe(value => {
				this.matchType = value;
				// console.log('gamePlayers confirming: ', this.matchType)
			});
	}

	ngOnInit(): void {
		console.log('players-table component init with: ', this.initialTableData);

		this.isLoading = true;
		this.fetchInitialTableData();
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});

		this.userDetailService.gameCode$.subscribe(code => {
			this.gameCode = code;
		});
		this.userDetailService.directorKey$.subscribe(key => {
			this.dirKey = key;
		});
		this.origin = window.location.href;
		// console.log('game-players initialTableData: ', this.initialTableData);
	}

	ngAfterViewInit(): void {}

	fetchInitialTableData(): void {
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


	refresh() {
		this.refreshDB()
			.then(() => {
				this.isLoading = true;
				this.fetchInitialTableData();
				this.cdr.detectChanges();
			})
			.catch(error => {
				console.error(error);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	private async refreshDB(): Promise<void> {
		try {
			// this.isLoading = true;
			await this.dataService.deleteIndexedDBDatabase();
		} catch (error) {
			throw error('error refreshing', error.message);
		}
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
			// console.log('pairs form values: ', JSON.stringify(values, null, 2));
		} else {
			values = this.teamsForm.getTeamFormData();
			// console.log('team form values: ', JSON.stringify(values, null, 2));
		}

		combinedFormData.tableFormData = values;
		// console.log('table form data: ', tableFormData);
		// console.log('combined form data: ', combinedFormData);
		if (this.forwardDate) {
			const day = this.forwardDate.getDate();
			const month = this.forwardDate.toLocaleDateString('default', {
				month: 'short'
			});
			const year = this.forwardDate.getFullYear();
			dateFormData = `${day} ${month} ${year}`;
			// console.log('date form data: ', dateFormData);

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
		// console.log(this.tablesConfig);
	}

	private generatePublicLink() {
		const data: any = {};
		data.gameCode = this.gameCode;

		const {
			playerConfig: { north, south, east, west },
			tables
		} = this.initialTableData;
		// const tablesLength = Object.keys(tables).length
		console.log(tables);

		console.log(north, south, east, west);
		const gameConfig: {
			north: [];
			south: [];
			east: [];
			west: [];
			tables?: number;
			sitters?: [];
			tableConfig: any
		} = {
			north,
			south,
			east,
			west,
			tables: Object.keys(tables).length,
			tableConfig: tables
		};
		console.log('gameConfig: ', gameConfig);
		data.gameConfig = gameConfig;
		console.log(data);

		// const gameConfig =
		this.apiCoordination.setPublicGame(data).subscribe({
			next: data => {
				const {
					savedConfig: { game_id }
				} = data;
				const domain = this.domainService.domainSplitter(this.origin);
				console.log('data response: ', data);

				this.publicLink = `${domain}/starting-lineup?game_code=${this.gameCode}&game_id=${game_id}`;
			},
			error: error => {
				console.error(error);
				this.publicLink = 'Error';
			}
		});
	}

	getPublicLink(): void {
		this.generatePublicLink();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
