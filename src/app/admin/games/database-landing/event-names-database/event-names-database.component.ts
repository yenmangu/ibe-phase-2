import {
	Component,
	OnInit,
	AfterViewChecked,
	DoCheck,
	OnDestroy,
	ViewChild,
	Input,
	AfterViewInit
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { HistoricGamesDatabaseService } from '../../services/historic-games-database.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
	selector: 'app-event-names-database',
	templateUrl: './event-names-database.component.html',
	styleUrls: ['./event-names-database.component.scss']
})
export class EventNamesDatabaseComponent
	implements OnInit, AfterViewInit, DoCheck, AfterViewChecked, OnDestroy
{
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@Input() eventArray: any[] = [];

	applyMagentaGreyTheme = true;
	isLoading: boolean = true;
	eventDatabase: any = {};
	databaseSubscription: Subscription = new Subscription();
	dataSource = new MatTableDataSource<any>();
	tabChangeSubscription: Subscription = new Subscription();
	tabSelected: boolean = false;
	displayedColumns: string[] = ['number', 'event', 'lastUsed', 'added', 'delete'];
	searchTerm: string = '';

	constructor(
		private historicDatabaseService: HistoricGamesDatabaseService,
		private sharedDataService: SharedDataService
	) {}

	ngOnInit(): void {
		this.isLoading = true;
		this.dataSource = new MatTableDataSource(this.eventArray);
		this.dataSource.paginator = this.paginator;
		console.log('event-names data source: ', this.dataSource.data);
	}

	ngAfterViewInit(): void {
		if (this.paginator) {
			this.dataSource.paginator = this.paginator;
		}
	}

	ngDoCheck(): void {
		this.checkIsLoading();
	}

	ngAfterViewChecked(): void {}

	private compare(a: number | string, b: number | string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

	checkIsLoading() {
		if (this.tabSelected && this.dataSource.data.length < 1) {
			this.isLoading = true;
		}
	}
	applyFilter(event: Event) {
		console.log('search term: ', event);
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy(): void {
		this.databaseSubscription.unsubscribe();
	}
}
