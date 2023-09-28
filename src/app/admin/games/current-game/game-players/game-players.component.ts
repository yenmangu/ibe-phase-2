import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { EventDetailModel, EventDetails } from '../../data/event.options';
import { SharedGameDataService } from '../../services/shared-game-data.service';

@Component({
	selector: 'app-game-players',
	templateUrl: './game-players.component.html',
	styleUrls: ['./game-players.component.scss']
})
export class GamePlayersComponent implements OnInit, OnDestroy {
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	destroy$ = new Subject<void>();
	eventDetails: EventDetailModel[] = EventDetails;
	tableOption = 'none';

	tableFormValues: any = {};

	constructor(
		private breakpointService: BreakpointService,
		private sharedGameDataService: SharedGameDataService,
		private fb: FormBuilder
	) {}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
	}

	onOptionSelected(selctedOption: string) {
		this.tableOption = selctedOption;
		this.sharedGameDataService.setTableConfigOption(selctedOption);
	}

	onTableValueChanged(formData: any) {
		this.tableFormValues = formData;
	}

	onSaveClick() {
		console.log('Form Data in parent Component: ', this.tableFormValues);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
