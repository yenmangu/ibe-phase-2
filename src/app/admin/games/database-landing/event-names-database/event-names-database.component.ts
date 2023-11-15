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
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { EventInterface } from 'src/app/shared/data/interfaces/event-data';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HistoricGamesDatabaseService } from '../../services/historic-games-database.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { CurrentEventService } from '../../services/current-event.service';
import { SharedGameDataService } from '../../services/shared-game-data.service';
@Component({
	selector: 'app-event-names-database',
	templateUrl: './event-names-database.component.html',
	styleUrls: ['./event-names-database.component.scss']
})
export class EventNamesDatabaseComponent
	implements OnInit, AfterViewInit, DoCheck, AfterViewChecked, OnDestroy
{
	@ViewChild(MatTable) table: MatTable<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	eventArray: EventInterface[] = [];
	private eventDataSubject = new Subject<EventInterface[]>();
	eventData$ = this.eventDataSubject.asObservable();

	applyMagentaGreyTheme = true;
	applyGreenGreyTheme = true;
	storeName = 'event';
	// private playerDataSubject = new Subject<EventInterface>();
	// playerData$ = this.playerDataSubject.asObservable();

	isLoading: boolean = true;
	updatedDataSubscription: Subscription;
	databaseSubscription: Subscription = new Subscription();
	dataSource = new MatTableDataSource<any>();
	tabChangeSubscription: Subscription = new Subscription();
	tabSelected: boolean = false;
	displayedColumns: string[] = ['number', 'event', 'lastUsed', 'added', 'delete'];
	searchTerm: string | undefined;
	selectedRowData: EventInterface | undefined;
	currentRemoteDBRevision: string = '';

	updatedData: any[] = [];
	sortedData: any[];
	gameCode: string = '';
	dirkey: string = '';

	constructor(
		private historicDatabaseService: HistoricGamesDatabaseService,
		private sharedDataService: SharedDataService,
		private dialogService: DialogService,
		private currentEventService: CurrentEventService,
		private sharedGameData: SharedGameDataService
	) {}

	ngOnInit(): void {
		this.isLoading = true;
		console.log('child component init');
		this.emitInitial();
		this.eventData$.subscribe(data => {
			this.eventArray = data;
			console.log('event names: ', this.eventArray);
			this.initDataSource();
			this.isLoading = false;
		});
		this.fetchInitialData();
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirkey = localStorage.getItem('DIR_KEY');
	}

	private emitInitial() {
		const storeName = 'event';
		console.log('child component emitting: ', storeName);
	}

	ngAfterViewInit(): void {
		if (this.paginator && this.sort) {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
		this.updatedDataSubscription = this.historicDatabaseService
			.getDataUpdated$()
			.subscribe({
				next: value => {
					if (value) {
						this.refresh();
						this.table.renderRows();
					}
				}
			});
	}

	ngDoCheck(): void {
		this.checkIsLoading();
	}

	ngAfterViewChecked(): void {}

	async fetchCurrentRevision() {
		console.log('fetch current revision initialised');

		this.currentEventService
			.getLiveData(this.gameCode, this.dirkey)
			.subscribe(data => {
				console.log('live data raw: ', data);
				this.currentRemoteDBRevision = data.currentDBRevision;
				this.sharedGameData.databaseRevisionSubject.next(
					this.currentRemoteDBRevision
				);
			});
	}

	async fetchInitialData() {
		try {
			console.log(this.storeName);
			const eventData = await this.historicDatabaseService.fetchHistoricData(
				'event'
			);
			this.eventDataSubject.next(eventData);
		} catch (err) {
			console.error('Error fetching initial: ', err);
		}
	}

	private sortArray(data) {
		return data.sort((a, b) => +b.key - +a.key);
	}

	private initDataSource(): void {
		this.sortArray(this.eventArray);
		const updatedData = this.eventArray.map(item => {
			return {
				...item,
				value: {
					newKey: item.key,
					...item.value
				}
			};
		});
		const mappedDataSource = updatedData.map(item => item.value);
		this.dataSource.data = mappedDataSource;
	}

	private compare(a: number | string, b: number | string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

	private async refresh() {
		await this.fetchInitialData();
		// console.log('updated data source: ', this.eventArray);
		this.dataSource.data = this.eventArray;
		if (this.paginator && this.sort) {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
		// this.table.renderRows();
	}

	private async delete(data) {
		try {
			if (!data) {
				throw new Error('No data in private delete function in component');
			}
			await this.historicDatabaseService.deleteRow(data);
			this.refresh();
		} catch (err) {
			console.error('error deleting: ', err);
		}
	}

	onEventAdd(): void {
		const searchTerm = this.searchTerm ? this.searchTerm : '';
		console.log('db component search term: ', searchTerm);
		this.openTableEditDialogWithCallback(undefined, searchTerm);
	}
	onRowClick(rowData: any): void {
		const selectedKey = rowData.newKey;

		const selectedData = this.eventArray.find(item => item.key === selectedKey);
		this.selectedRowData = selectedData;
		this.openTableEditDialogWithCallback(selectedData, undefined);
	}

	private openTableEditDialogWithCallback(
		data?: EventInterface,
		searchTerm?: string
	): void {
		const dialogRef = this.dialogService.openTableEditDialog(
			'event',
			data ? data : undefined,
			searchTerm ? searchTerm : undefined
		);

		dialogRef.afterClosed().subscribe({
			next: async result => {
				if (result) {
					console.log('dialog call back data: ', result);
					await this.handleDataUpdate(result);
					this.fetchCurrentRevision();
					this.table.renderRows();
				}
			}
		});
	}

	private async handleDataUpdate(data) {
		try {
			console.log('data to update: ', data);
			if (data) {
				await this.historicDatabaseService.updateByType('event', data);

				await this.refresh();
			}
		} catch (err) {
			console.error('error updating', err);
		}
	}

	clearFilter(input: HTMLInputElement): void {
		this.dataSource.filter = '';
		input.value = '';
		this.searchTerm = undefined;
	}

	checkIsLoading() {
		if (this.tabSelected && this.dataSource.data.length < 1) {
			this.isLoading = true;
		}
	}
	applyFilter(event: Event) {
		console.log('search term: ', event);
		const filterValue = (event.target as HTMLInputElement).value;
		console.log('filter: ', this.dataSource.filter);
		this.dataSource.filter = filterValue.trim().toLowerCase();
		this.searchTerm = filterValue.trim().toLowerCase();
	}

	onDelete(row) {
		// alert(`${row.value.name} clicked`);
		this.delete(row);
	}

	ngOnDestroy(): void {
		this.databaseSubscription.unsubscribe();
	}
}
