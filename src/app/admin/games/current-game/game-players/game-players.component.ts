import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Subject, takeUntil, Subscription } from 'rxjs';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { EventDetailModel, EventDetails } from '../../data/event.options';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { TablesService } from '../../services/tables.service';

@Component({
	selector: 'app-game-players',
	templateUrl: './game-players.component.html',
	styleUrls: ['./game-players.component.scss']
})
export class GamePlayersComponent implements OnInit, OnDestroy {
	@Input() initialTableData: any
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	destroy$ = new Subject<void>();
	eventDetails: EventDetailModel[] = EventDetails;
	tableOption = 'none';

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

	pairsTableFormValues: any = {};
	teamsTableFormValues: any = {};

	constructor(
		private breakpointService: BreakpointService,
		private sharedDataService: SharedDataService,
		private tablesService: TablesService,
		private fb: FormBuilder
	) {
		this.sharedDataService.selectedMatchType$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.matchType = value;
				// console.log('gamePlayers confirming: ', this.matchType)
			});
	}

	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
			console.log('game-players initialTableData: ', this.initialTableData)
	}

	onOptionSelected(selctedOption: string) {
		this.tableOption = selctedOption;
		this.tablesService.updateTableConfig(selctedOption);
	}

	onPairsTableValueChanged(formData: any) {
		this.pairsTableFormValues = formData;
	}
	onTeamTableValueChanged(formData: any) {
		this.teamsTableFormValues = formData;
	}

	onSaveClick() {
		console.log('Form Data in parent Component: ', this.pairsTableFormValues);
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
