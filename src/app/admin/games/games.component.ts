import { Component, OnInit, OnDestroy } from '@angular/core';
import {
	Subscription,
	catchError,
	lastValueFrom,
	mergeMap,
	switchMap,
	tap
} from 'rxjs';
import { CurrentEventService } from './services/current-event.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { DataService } from './services/data.service';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit, OnDestroy {
	currentMatch: string = '';
	private subscription: Subscription;
	private matchTypeSubscription: Subscription | undefined;
	constructor(
		private currentEventService: CurrentEventService,
		private sharedDataService: SharedDataService,
		private dataService: DataService
	) {}

	async ngOnInit(): Promise<void> {
		this.matchTypeSubscription = this.sharedDataService.selectedMatchType$
			.pipe(
				switchMap(matchType => {
					this.currentMatch = matchType;
					return this.callCurrentEventService();
				})
			)
			.subscribe({
				next: data => {
					console.log('New Data Fetched: ', data);
				}
			});

		this.sharedDataService.selectedMatchType$.subscribe(matchType => {
			this.currentMatch = matchType;
			console.log(matchType);
		});
		await this.dataService.initialiseDB();
		await this.requestAndStoreData();

		// this.currentEventService.getDummyXmlData()
	}

	async requestAndStoreData() {
		try {
			const result = await this.callCurrentEventService();
			if (!result) {
				throw new Error('Error calling server');
			}
			const dbResponse = await this.initiateDataService(result);
			if (!dbResponse) {
				throw new Error('Error calling data service');
			}
		} catch (err) {
			console.error('Error performing high level requestAndStore(): ', err);
		}
	}

	private async callCurrentEventService() {
		try {
			const currentMatch = this.currentMatch;
			if (!currentMatch) {
				throw new Error('No currentMatch');
			} else {
				const data = await lastValueFrom(
					this.currentEventService.getAndDecompressData(this.currentMatch)
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

	private async initiateDataService(data) {
		try {
			if (!data) {
				throw new Error('No Data in initiateDataService function');
			}
			const result = await this.dataService.newEntryPoint(data);
			if (!result) {
				throw new Error('No result from this.dataService.entryPoint function');
			}
			console.log('result from newEntryPoint(): ', result);
			return result;
		} catch (err) {
			console.error('Error initiating DataService', err);
			throw err;
		}
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		if (this.matchTypeSubscription) {
			this.matchTypeSubscription.unsubscribe();
		}
		this.dataService.destroy$.complete();
	}
}
