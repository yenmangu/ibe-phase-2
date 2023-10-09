import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { HistoricGamesDatabaseService } from '../services/historic-games-database.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
	selector: 'app-database-landing',
	templateUrl: './database-landing.component.html',
	styleUrls: ['./database-landing.component.scss']
})
export class DatabaseLandingComponent implements OnInit, OnDestroy {
	currentBreakpointSubscription: Subscription;
	applyMagentaGreyTheme = true;
	currentBreakpoint = '';
	gamesDatabase: any = {};
	playersArray: any[] = [];
	teamsArray: any[] = [];
	venuesArray: any[] = [];
	eventsArray: any[] = [];

	dataArray: any[] = [];

	playersReady = false;
	teamsReady = false;
	eventsReady = false;
	venuesReady = false;

	storeName: string = '';

	tempDialogData: any = {};
	searchTerm: string = '';
	tabChangeSubscription = new Subscription();
	tabSelected: boolean = false;
	databaseSubscription: Subscription = new Subscription();
	private dataUpdateSubscription: Subscription = new Subscription();
	private dataSubscription: Subscription;
	constructor(
		private breakpointService: BreakpointService,
		private historicDatabaseService: HistoricGamesDatabaseService,
		private sharedDataService: SharedDataService,
		private dialogService: DialogService,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.dataSubscription = this.historicDatabaseService.fetchedData$.subscribe({
			next: data => {
				// console.log('data from observable: ', data);
				this.dataArray = data;
				// console.log(this.dataArray);
			}
		});

		this.loadDatabaseData();

		this.dataUpdateSubscription = this.historicDatabaseService
			.getDataUpdated$()
			.subscribe(data => {
				if (data) {
				}
			});
	}

	async loadDatabaseData(): Promise<any> {
		try {
			console.log('loadDatabase called');
			const dbData = await this.historicDatabaseService.fetchMainData(
				'player_db',
				'root'
			);
			if (dbData) {
				return dbData;
			}
		} catch (err) {
			console.error('Error fetching data in db-landing component: ', err);
		}
	}

	handleDataUpdate(event) {}

	private compare(a: number | string, b: number | string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

	onFetchInitial(storeName: string) {
		console.log('fetch intial received in the parent for store name: ', storeName);

		if (storeName) {
			this.updateProperty(storeName);
		}
		this.fetchInitialData(this.storeName);
	}

	async fetchInitialData(storeName: string) {
		try {
			await this.historicDatabaseService.fetchHistoricData(this.storeName);
		} catch (err) {
			console.error('Error fetching initial: ', err);
		}
	}

	private updateProperty(storeName: string) {
		switch (storeName) {
			case 'players':
				this.playersReady = true;
				this.storeName = 'players';
				break;
			case 'teams':
				this.teamsReady = true;
				this.storeName = 'teams';
				break;
			case 'events':
				this.eventsReady = true;
				this.storeName = 'events';
				break;
			case 'venues':
				this.venuesReady = true;
				this.storeName = 'venues';
				break;
		}
	}

// To be implemented at a later date

	// onClickOptions(){
	// 	const dialogRef = this.dialogService.openDatabaseOptionsDialog(this.tempDialogData)
	// 	dialogRef.afterClosed().subscribe({
	// 		next: (data) => {
	// 			console.log(data)
	// 		}
	// 	})
	// }

	ngOnDestroy(): void {
		this.dataSubscription.unsubscribe();
	}
}
