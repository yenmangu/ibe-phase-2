import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-current-game',
	templateUrl: './current-game.component.html',
	styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit, OnDestroy {
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	dateSelected: Date | null
	private destroy$ = new Subject<void>();
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

  shouldAlignTabsToStart(): boolean{
    return this.currentBreakpoint !== 'handset'
  }
}
