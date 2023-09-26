import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { EventDetailModel, EventDetails } from '../../data/event.options';

@Component({
	selector: 'app-game-players',
	templateUrl: './game-players.component.html',
	styleUrls: ['./game-players.component.scss']
})
export class GamePlayersComponent implements OnInit, OnDestroy {
  applyMagentaGreyTheme = true
	currentBreakpoint: string = '';
	destroy$ = new Subject<void>();
	eventDetails: EventDetailModel[] = EventDetails;

  

	constructor(private breakpointService: BreakpointService) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
