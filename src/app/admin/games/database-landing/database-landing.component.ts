import {
	AfterViewInit,
	Component,
	DoCheck,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { HistoricGamesDatabaseService } from '../services/historic-games-database.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';

@Component({
	selector: 'app-database-landing',
	templateUrl: './database-landing.component.html',
	styleUrls: ['./database-landing.component.scss']
})
export class DatabaseLandingComponent implements OnInit, AfterViewInit, OnDestroy {
	currentBreakpointSubscription: Subscription;
	currentBreakpoint = '';
	gamesDatabase: any = {};
	playersArray: any[] = [];
	teamsArray: any[] = [];
	venuesArray: any[] = [];
	eventArray: any[] = [];

	searchTerm: string = '';
	tabChangeSubscription = new Subscription();
	tabSelected: boolean = false;
	databaseSubscription: Subscription = new Subscription();
	constructor(
		private historicDatabaseService: HistoricGamesDatabaseService,
		private sharedDataService: SharedDataService
	) {}

	ngOnInit(): void {
		this.databaseSubscription = this.historicDatabaseService.dataLoading$.subscribe(
			data => {
				if (data) this.gamesDatabase = data.value[0];
				if (this.gamesDatabase && this.gamesDatabase.item) {
					const dataArray: any[] = this.gamesDatabase.item;
					// console.log('main data array', data.value[0].item);

					dataArray.forEach((item: any) => {
						if (item.$.type && item.$.type === 'player') {
							this.playersArray.push(item);
						}
						if (item.$.type && item.$.type === 'team') {
							this.teamsArray.push(item);
						}
						if (item.$.type && item.$.type === 'loc') {
							this.venuesArray.push(item);
						}
						if (item.$.type && item.$.type === 'event') {
							this.eventArray.push(item);
						}
					});
				}
				console.log('db landing player array: ', this.playersArray);
				console.log('db landing team array: ', this.teamsArray);
				console.log('db landing location array: ', this.venuesArray);
				console.log('db landing event array: ', this.eventArray);
			}
		);
		this.loadDatabaseData();
	}

	ngDoCheck(): void {}

	ngAfterViewInit(): void {
		// this.loadDatabaseData();
	}
	ngAfterViewChecked(): void {}

	async loadDatabaseData(): Promise<void> {
		try {
			await this.historicDatabaseService.fetchMainData(
				'historic_game_data',
				'histitem'
			);
		} catch (err) {
			console.error('Error fetching data in eventNames component: ', err);
		}
	}

	private compare(a: number | string, b: number | string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

	onDataReceived(data: any) {
		console.log('data receieved from child component: ', data);
	}

	ngOnDestroy(): void {}
}
