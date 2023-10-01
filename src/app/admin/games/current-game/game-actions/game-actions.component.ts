import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';

@Component({
	selector: 'app-game-actions',
	templateUrl: './game-actions.component.html',
	styleUrls: ['./game-actions.component.scss']
})
export class GameActionsComponent implements OnInit, OnDestroy {
	dateSelected: Date | null;
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	private destroy$ = new Subject<void>();



	constructor(private breakpointService: BreakpointService) {}
	ngOnInit(): void {
		// this.breakpoint$.subscribe(() => this.breakpointChanged());
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
        // console.log(this.currentBreakpoint)
			});
	}
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
