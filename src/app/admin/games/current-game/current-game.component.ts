import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { Subject, Subscription, switchMap, takeUntil, lastValueFrom } from 'rxjs';
import { CurrentEventService } from '../services/current-event.service';
import { DataService } from '../services/data.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ProcessMatchDataService } from '../services/process-match-data.service';
import { SharedGameDataService } from '../services/shared-game-data.service';

@Component({
	selector: 'app-current-game',
	templateUrl: './current-game.component.html',
	styleUrls: ['./current-game.component.scss']
})
export class CurrentGameComponent implements OnInit, OnDestroy {
	@Input() initialTableData: any;
	applyMagentaGreyTheme = true;
	currentBreakpoint: string = '';
	dateSelected: Date | null;
	currentMatchType: string = '';
	private matchTypeSubscription: Subscription | undefined;
	private destroy$ = new Subject<void>();
	constructor(
		private breakpointService: BreakpointService,
		private currentEventService: CurrentEventService,
		private dataService: DataService,
		private sharedDataService: SharedDataService,
		private processMatchDataService: ProcessMatchDataService
	) {}
	async ngOnInit(): Promise<void> {
		this.matchTypeSubscription = this.sharedDataService.selectedMatchType$
			.pipe(
				switchMap(matchType => {
					this.currentMatchType = matchType;
					console.log('matchTpeSubscription in current-game: ', matchType);
					return this.handleMatchTypeChange();
				})
			)
			.subscribe({
				next: async data => {
					if (!data) {
						console.log('No data from http');
						await this.processMatchDataService
							.getInitialTableData()
							.then(result => {
								console.log('Initial Table Data: ', result);
								this.initialTableData = result;
							});
					} else {
						await this.processMatchDataService
							.getInitialTableData()
							.then(result => {
								this.initialTableData = result;
								console.log('current-game initial table data: ',this.initialTableData)
							});
					}
				}
			});
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
	}

	private async handleMatchTypeChange(): Promise<boolean> {
		try {
			const data = await this.callCurrentEventService();
			if (data) {
				await this.processData(data);
				return true;
			} else {
				return false;
			}
			// console.log('New Data Fetched: ', data);
		} catch (err) {
			console.error('Error handling match type change: ', err);
		}
		return false;
	}

	private async callCurrentEventService() {
		try {
			const currentMatch = this.currentMatchType;
			if (!currentMatch) {
				throw new Error('No currentMatch');
			} else {
				const data = await lastValueFrom(
					this.currentEventService.getAndDecompressData(this.currentMatchType)
				);
				if (!data) {
					throw new Error('No Data (lastValue) from currentEventService');
				}

				return data;
			}
		} catch (err) {
			console.error('Error calling curretEventService', err);
			throw err;
		}
	}

	private async processData(data) {
		console.log('processData() called');
		await this.dataService.initialiseDB(data);
		await this.storeInitialData(data);
	}

	async storeInitialData(data) {
		try {
			if (!data) {
				throw new Error('Error calling server');
			}
			const dbResponse = await this.dataService.storeData(data);
			if (!dbResponse) {
				throw new Error('Error calling data service');
			}
		} catch (err) {
			console.error('Error performing high level requestAndStore(): ', err);
		}
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
