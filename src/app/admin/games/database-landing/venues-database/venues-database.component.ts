import {
	Component,
	OnInit,
	DoCheck,
	OnDestroy,
	ViewChild,
	AfterViewInit
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription, Subject } from 'rxjs';
import { Venue } from 'src/app/shared/data/interfaces/venue-data';
import { HistoricGamesDatabaseService } from '../../services/historic-games-database.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { MatSort } from '@angular/material/sort';
import { CurrentEventService } from '../../services/current-event.service';
import { SharedGameDataService } from '../../services/shared-game-data.service';
@Component({
	selector: 'app-venues-database',
	templateUrl: './venues-database.component.html',
	styleUrls: ['./venues-database.component.scss']
})
export class VenuesDatabaseComponent
	implements OnInit, AfterViewInit, DoCheck, OnDestroy
{
	@ViewChild(MatTable) table: MatTable<Venue>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	applyMagentaGreyTheme = true;
	applyIbescoreTheme = true;

	venueArray: Venue[] = [];
	updatedData: any[] = [];

	sortedData: any[];

	private venueDataSubject = new Subject<Venue[]>();
	public venueData$ = this.venueDataSubject.asObservable();

	storeName: 'loc';
	isLoading: boolean = true;
	updateDataSubscription = new Subscription();

	dataSource = new MatTableDataSource<any>();
	tabChangeSubscription = new Subscription();
	tabSelected: boolean = false;
	displayedColumns: string[] = ['number', 'venue', 'lastUsed', 'added', 'delete'];
	selectedRowData: Venue | undefined;
	searchTerm: string = '';
	currentRemoteDBRevision: string = '';

	gameCode: string = '';
	dirkey: string = '';
	constructor(
		private historicGamesDatabaseService: HistoricGamesDatabaseService,
		private dialogService: DialogService,
		private currentEventService: CurrentEventService,
		private sharedGameData: SharedGameDataService
	) {}

	ngOnInit(): void {
		this.isLoading = true;
		this.venueData$.subscribe(data => {
			this.venueArray = data;
			console.log('venue array: ', this.venueArray);
			this.initDataSource();
			this.isLoading = false;
		});
		this.fetchInitialData();
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirkey = localStorage.getItem('DIR_KEY');
	}

	ngAfterViewInit(): void {
		if (this.paginator) {
			this.dataSource.paginator = this.paginator;
		}
	}

	ngDoCheck(): void {
		this.checkIsLoading();
	}

	applyFilter(event: Event) {
		console.log('search term: ', event);
		const filterValue = (event.target as HTMLInputElement).value;
		console.log('filter: ', this.dataSource.filter);
		this.dataSource.filter = filterValue.trim().toLowerCase();
		this.searchTerm = filterValue.trim().toLowerCase();
	}

	async fetchInitialData(): Promise<boolean> {
		try {
			console.log(this.storeName);
			const venueData = await this.historicGamesDatabaseService.fetchHistoricData(
				'loc'
			);
			if (venueData) {
				this.venueDataSubject.next(venueData);
				return true;
			}
			return false;
		} catch (err) {
			console.error('Error fetching initial: ', err);
			return false;
		}
	}
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

	onVenueAdd(): void {
		const searchTerm = this.searchTerm ? this.searchTerm : '';
		console.log('db component search term: ', searchTerm);
		this.openTableEditDialogWithCallback(undefined, searchTerm);
	}

	onRowClick(rowData: any): void {
		console.log('row clicked');
		const selectedKey = rowData.newKey;
		const selectedData = this.venueArray.find(item => item.key === selectedKey);
		this.selectedRowData = selectedData;
		this.openTableEditDialogWithCallback(selectedData, undefined);
	}

	clearFilter(input: HTMLInputElement): void {
		this.dataSource.filter = '';
		input.value = '';
		this.searchTerm = undefined;
	}

	onDelete(row) {
		// alert(`${row.value.name} clicked`);
		this.delete(row);
	}
	private sortArray(data) {
		return data.sort((a, b) => +b.key - +a.key);
	}

	private initDataSource(): void {
		this.sortArray(this.venueArray);

		const updatedData = this.venueArray.map(item => {
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

		this.dataSource.data = mappedDataSource;
	}

	private refresh() {
		const result = this.fetchInitialData();
		if (result) {
			this.dataSource.data = this.venueArray;
			if (this.paginator && this.sort) {
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			}
			if (this.dataSource.data.length > 0) {
				this.table.renderRows();
			}
		}
	}

	private async delete(data) {
		try {
			if (!data) {
				throw new Error('No data in private delete function in component');
			}
			await this.historicGamesDatabaseService.deleteRow(data);
			this.refresh();
		} catch (err) {
			console.error('error deleting: ', err);
		}
	}

	private openTableEditDialogWithCallback(data?: Venue, searchTerm?: string): void {
		console.log('open table dialog with callback invoked');
		const dialogRef = this.dialogService.openTableEditDialog(
			'venue',
			data ? data : undefined,
			searchTerm ? searchTerm : undefined
		);
		dialogRef.afterClosed().subscribe({
			next: result => {
				if (result) {
					console.log('dialog call back data: ', result);
					this.handleDataUpdate(result);
					this.table.renderRows();
					this.fetchCurrentRevision();
				}
			}
		});
	}

	private async handleDataUpdate(data) {
		try {
			console.log('data to update: ', data);
			if (data) {
				await this.historicGamesDatabaseService.updateByType('loc', data);

				this.refresh();
			}
		} catch (err) {
			console.error('error updating', err);
		}
	}
	private checkIsLoading() {
		if (this.tabSelected && this.dataSource.data.length < 1) {
			this.isLoading = true;
		}
	}

	ngOnDestroy(): void {}
}
