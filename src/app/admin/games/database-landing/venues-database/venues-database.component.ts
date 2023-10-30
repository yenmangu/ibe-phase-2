import {
	Component,
	Input,
	OnInit,
	DoCheck,
	OnDestroy,
	ViewChild,
	AfterViewInit
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-venues-database',
	templateUrl: './venues-database.component.html',
	styleUrls: ['./venues-database.component.scss']
})
export class VenuesDatabaseComponent
	implements OnInit, AfterViewInit, DoCheck, OnDestroy
{
	@Input() venuesArray: any = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	applyMagentaGreyTheme = true;
	applyIbescoreTheme = true;

	venueArray: Venue[] = [];

	private venueDataSubject = new Subject<Venue[]>();
	public venueData$ = this.venueDataSubject.asObservable();

	storeName: 'loc';
	isLoading: boolean = true;

	dataSource = new MatTableDataSource<any>();
	tabChangeSubscription = new Subscription();
	tabSelected: boolean = false;
	displayedColumns: string[] = ['number', 'venue', 'lastUsed', 'added', 'delete'];
	searchTerm: string = '';

	ngOnInit(): void {
		this.isLoading = true;
		this.venueData$.subscribe(data => {
			this.venueArray = data;
			console.log('venue array: ', this.venueArray);
			this.initDataSource();
			this.isLoading = false;
		});
		this.fetchInitialData();
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

	async fetchInitialData() {
		try {
			console.log(this.storeName);
			const venueData = await this.historicGamesDatabaseService.fetchHistoricData(
				'loc'
			);
			this.venueDataSubject.next(venueData);
		} catch (err) {
			console.error('Error fetching initial: ', err);
		}
	}

	onVenueAdd(): void {
		const searchTerm = this.searchTerm ? this.searchTerm : '';
		console.log('db component search term: ', searchTerm);
		this.openTableEditDialogWithCallback(undefined, searchTerm);
	}

	onRowClick(rowData: Venue): void {
		console.log('row clicked');
		this.selectedRowData = rowData;
		this.openTableEditDialogWithCallback(rowData, undefined);
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


	private initDataSource(): void {
		this.dataSource.data = this.venueArray;
	}

	private refresh() {
		this.fetchInitialData();
		this.dataSource.data = this.venueArray;
		if (this.paginator && this.sort) {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
		this.table.renderRows();
		this.changeDetectorRef.detectChanges();
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


	applyFilter(event: Event) {
		console.log('search term: ', event);
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy(): void {}
}
