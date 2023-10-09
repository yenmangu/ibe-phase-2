import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { Subject, Subscription, switchMap, takeUntil, lastValueFrom } from 'rxjs';
import { CurrentEventService } from '../services/current-event.service';
import { DataService } from '../services/data.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ProcessMatchDataService } from '../services/process-match-data.service';
import { SharedGameDataService } from '../services/shared-game-data.service';
import { AuthService } from 'src/app/auth/services/auth.service';

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
	private responseSubscription: Subscription
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
	async ngOnInit(): Promise<void> {

		this.responseSubscription = this.authService.responseJSON$.pipe(

		).subscribe({
			next: async (json)=> {
				if(json){
					await this.processData(json)
				}
			}
		})
		// this.matchTypeSubscription = this.sharedDataService.selectedMatchType$
		// 	.pipe(
		// 		switchMap(matchType => {
		// 			this.currentMatchType = matchType;
		// 			console.log('matchTpeSubscription in current-game: ', matchType);
		// 			return this.handleMatchTypeChange();
		// 		})
		// 	)
		// 	.subscribe({
		// 		next: async data => {
		// 			if (!data) {
		// 				console.log('No data from http');
		// 				this.isLoading = true;
		// 				await this.processMatchDataService
		// 					.getInitialTableData()
		// 					.then(result => {
		// 						// console.log('Initial Table Data: ', result);
		// 						this.initialTableData = result;
		// 					});
		// 			} else {
		// 				await this.processMatchDataService
		// 					.getInitialTableData()
		// 					.then(result => {
		// 						this.initialTableData = result;
		// 						this.sharedGameDataService.setLoadingStatus(false);
		// 						this.sharedGameDataService.tableLoading$.subscribe(status => {
		// 							this.isLoading = status;
		// 						});
		// 						// console.log('current-game initial table data: ',this.initialTableData)
		// 					})
		// 					.finally(() => {
		// 						this.isLoading = false;
		// 					});
		// 			}
		// 		}
		// 	});
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(value => {
				this.currentBreakpoint = value;
			});
	}

	private async handleMatchTypeChange(): Promise<boolean> {
		try {
			this.sharedGameDataService.setLoadingStatus(true);
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
		console.log('processData() called with data: ', data);
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
			this.sharedGameDataService.setLoadingStatus(false);
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
