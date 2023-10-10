import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	Input,
	ChangeDetectorRef
} from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { Subject, Subscription, switchMap, takeUntil, lastValueFrom } from 'rxjs';
import { CurrentEventService } from '../services/current-event.service';
import { DataService } from '../services/data.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ProcessMatchDataService } from '../services/process-match-data.service';
import { SharedGameDataService } from '../services/shared-game-data.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { CurrentGamesDatabaseService } from '../services/current-games-database.service';import { NgxMaterialTimepickerHoursFace } from 'ngx-material-timepicker/src/app/material-timepicker/components/timepicker-hours-face/ngx-material-timepicker-hours-face';

@Component({
	selector: 'app-current-game',
	templateUrl: './current-game.component.html',
	styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() initialTableData: any = undefined;
	isLoading: boolean = true;
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	dateSelected: Date | null;
	currentMatchType: string = '';
	eventName: string = '';
	currentGameSubscription = new Subscription();
	dataStored: boolean = false;
	private matchTypeSubscription: Subscription | undefined;
	private dataLoadedSubscription: Subscription;
	private responseSubscription: Subscription;
	private destroy$ = new Subject<void>();
	constructor(
		private breakpointService: BreakpointService,
		private currentEventService: CurrentEventService,
		private dataService: DataService,
		private sharedDataService: SharedDataService,
		private processMatchDataService: ProcessMatchDataService,
		private sharedGameDataService: SharedGameDataService,
		private authService: AuthService,
		private indexedDatabaseStatus: IndexedDatabaseStatusService,
		private currentGamesDatabaseService: CurrentGamesDatabaseService,
		private changeDetectorRef: ChangeDetectorRef
	) {}
	async ngOnInit(): Promise<void> {
		console.log('current game component init');

		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
		this.dataLoadedSubscription = this.sharedGameDataService.dataStored$.subscribe(
			value => {
				if (value) {
					this.dataStored = value;
					console.log('data is loaded? ', value);
				}
				this.matchTypeSubscription =
					this.sharedDataService.selectedMatchType$.subscribe(matchtype => {
						this.currentMatchType = matchtype;
						console.log(
							'match type in current-games-component: ',
							this.currentMatchType
						);
					});
			}
		);
		this.currentGameSubscription =
			this.currentGamesDatabaseService.currentDataLoading$.subscribe(data => {
				if (data) {
					this.initialTableData = data;
					console.log('initial table data in the current game component: ', data);
				} else if (data === null) {
					this.initialTableData = [];
					console.log('no data in the current game db');
				}
			});
		await this.fetchData();
	}

	async ngAfterViewInit(): Promise<void> {
		this.changeDetectorRef.detectChanges();
	}

	private async fetchData() {
		try {
			await this.currentGamesDatabaseService.fetchCurrentData();
		} catch (err) {
			console.error('error fetching database data: ', err);
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		if (this.matchTypeSubscription) {
			this.dataService.destroy$.complete();
		}
		this.dataLoadedSubscription.unsubscribe();
		this.currentGameSubscription.unsubscribe();
	}

	shouldAlignTabsToStart(): boolean {
		return this.currentBreakpoint !== 'handset';
	}
}
