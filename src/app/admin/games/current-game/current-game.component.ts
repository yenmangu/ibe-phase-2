import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { Subject, Subscription, switchMap, takeUntil, lastValueFrom } from 'rxjs';
// import { CurrentEventService } from '../services/current-event.service';
// import { DataService } from '../services/data.service';
// import { SharedDataService } from 'src/app/shared/services/shared-data.service';
// import { ProcessMatchDataService } from '../services/process-match-data.service';
// import { SharedGameDataService } from '../services/shared-game-data.service';
// import { AuthService } from 'src/app/auth/services/auth.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { tag } from 'rxjs-spy/cjs/operators';

@Component({
	selector: 'app-current-game',
	templateUrl: './current-game.component.html',
	styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit, OnDestroy {
	isLoading: boolean = true;
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	dateSelected: Date | null;
	currentMatchType: string = '';
	eventName: string = '';
	IDB_DataStatus: boolean = false;
	private IDBStatusSubscription: Subscription;
	private matchTypeSubscription: Subscription | undefined;
	private responseSubscription: Subscription;
	private destroy$ = new Subject<void>();
	constructor(
		private breakpointService: BreakpointService,
		// private currentEventService: CurrentEventService,
		// private dataService: DataService,
		// private sharedDataService: SharedDataService,
		// private processMatchDataService: ProcessMatchDataService,
		// private sharedGameDataService: SharedGameDataService,
		// private authService: AuthService,
		private IDBStatusService: IndexedDatabaseStatusService
	) {}

	ngOnInit(): void {
		this.IDBStatusSubscription = this.IDBStatusService.dataFinished$
			.pipe(tag('idb-data-loaded'))
			.subscribe(status => {
				this.IDB_DataStatus = status;
			});
	}
	ngOnDestroy(): void {
		if (this.IDBStatusSubscription) {
			this.IDBStatusSubscription.unsubscribe();
		}
	}

	shouldAlignTabsToStart(): boolean {
		return this.currentBreakpoint !== 'handset';
	}
}
