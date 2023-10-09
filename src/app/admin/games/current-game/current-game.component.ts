import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { Subject, Subscription, switchMap, takeUntil, lastValueFrom } from 'rxjs';
import { CurrentEventService } from '../services/current-event.service';
import { DataService } from '../services/data.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ProcessMatchDataService } from '../services/process-match-data.service';
import { SharedGameDataService } from '../services/shared-game-data.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';

@Component({
	selector: 'app-current-game',
	templateUrl: './current-game.component.html',
	styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit, OnDestroy {
	@Input() initialTableData: any;
	isLoading: boolean = true;
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	dateSelected: Date | null;
	currentMatchType: string = '';
	eventName: string = '';
	private matchTypeSubscription: Subscription | undefined;
	private dataLoadedSubscription: Subscription
	private responseSubscription: Subscription
	private destroy$ = new Subject<void>();
	constructor(
		private breakpointService: BreakpointService,
		private currentEventService: CurrentEventService,
		private dataService: DataService,
		private sharedDataService: SharedDataService,
		private processMatchDataService: ProcessMatchDataService,
		private sharedGameDataService: SharedGameDataService,
		private authService: AuthService,
		private indexedDatabaseStatus: IndexedDatabaseStatusService
	) {}
	async ngOnInit(): Promise<void> {
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
			this.dataLoadedSubscription = this.sharedGameDataService.dataStored$.subscribe({
				next: (dataStored) => {
					if(dataStored){
					}
				}
			})
	}



	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		if (this.matchTypeSubscription) {
			this.dataService.destroy$.complete();
		}
	}

	shouldAlignTabsToStart(): boolean {
		return this.currentBreakpoint !== 'handset';
	}
}
