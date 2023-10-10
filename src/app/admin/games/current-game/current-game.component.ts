import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { Subject, Subscription, switchMap, takeUntil, lastValueFrom } from 'rxjs';
import { CurrentEventService } from '../services/current-event.service';
import { DataService } from '../services/data.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ProcessMatchDataService } from '../services/process-match-data.service';
import { SharedGameDataService } from '../services/shared-game-data.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NgxMaterialTimepickerHoursFace } from 'ngx-material-timepicker/src/app/material-timepicker/components/timepicker-hours-face/ngx-material-timepicker-hours-face';

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
	private matchTypeSubscription: Subscription | undefined;
	private responseSubscription: Subscription;
	private destroy$ = new Subject<void>();
	constructor(
		private breakpointService: BreakpointService,
		private currentEventService: CurrentEventService,
		private dataService: DataService,
		private sharedDataService: SharedDataService,
		private processMatchDataService: ProcessMatchDataService,
		private sharedGameDataService: SharedGameDataService,
		private authService: AuthService
	) {}

	ngOnInit(): void {}
	ngOnDestroy(): void {}

	shouldAlignTabsToStart(): boolean {
		return this.currentBreakpoint !== 'handset';
	}
}
