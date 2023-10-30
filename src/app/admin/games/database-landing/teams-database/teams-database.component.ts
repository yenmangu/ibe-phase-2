import {
	Component,
	OnInit,
	DoCheck,
	OnDestroy,
	AfterViewInit,
	ViewChild,
	ChangeDetectorRef
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription, Subject } from 'rxjs';
import { Team } from 'src/app/shared/data/interfaces/team-data';
import { HistoricGamesDatabaseService } from '../../services/historic-games-database.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { TitleStrategy } from '@angular/router';

@Component({
	selector: 'app-teams-database',
	templateUrl: './teams-database.component.html',
	styleUrls: ['./teams-database.component.scss']
})
export class TeamsDatabaseComponent
	implements OnInit, AfterViewInit, DoCheck, OnDestroy
{
	@ViewChild(MatTable) table: MatTable<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	applyMagentaGreyTheme = true;

	teamArray: Team[] = [];
	private teamDataSubject = new Subject<Team[]>();
	teamData$ = this.teamDataSubject.asObservable();

	storeName = 'team';
	isLoading: boolean = true;
	updateDataSubscription: Subscription;
	dataSource = new MatTableDataSource<any>();
	tabChangeSubscription = new Subscription();
	tabSelected: boolean = false;
	displayedColumns: string[] = ['number', 'team', 'lastUsed', 'added', 'delete'];
	searchTerm: string = '';
	selectedRowData: Team | undefined;
	constructor(
		private historicDatabaseService: HistoricGamesDatabaseService,
		private dialogService: DialogService,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.isLoading = true;
		this.teamData$.subscribe(data => {
			this.teamArray = data;
			console.log('team data: ', this.teamArray);
			this.initDataSource();
			this.isLoading = false;
		});
		this.fetchInitialData();
	}

	ngAfterViewInit(): void {
		if (this.paginator && this.sort) {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
		this.updateDataSubscription = this.historicDatabaseService
			.getDataUpdated$()
			.subscribe({
				next: value => {
					if (value) {
						this.refresh();
					}
				}
			});
	}

	ngDoCheck(): void {
		this.checkIsLoading();
	}

	async fetchInitialData() {
		try {
			console.log(this.storeName);
			const teamData = await this.historicDatabaseService.fetchHistoricData(
				'team'
			);
			this.teamDataSubject.next(teamData);
		} catch (err) {
			console.error('Error fetching initial: ', err);
		}
	}

	onTeamAdd(): void {
		const searchTerm = this.searchTerm ? this.searchTerm : '';
		console.log('db component search term: ', searchTerm);
		this.openTableEditDialogWithCallback(undefined, searchTerm);
	}

	onRowClick(rowData: Team): void {
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

	applyFilter(event: Event) {
		console.log('search term: ', event);
		const filterValue = (event.target as HTMLInputElement).value;
		console.log('filter: ', this.dataSource.filter);
		this.dataSource.filter = filterValue.trim().toLowerCase();
		this.searchTerm = filterValue.trim().toLowerCase();
	}

	checkIsLoading() {
		if (this.tabSelected && this.dataSource.data.length < 1) {
			this.isLoading = true;
		}
	}

	private initDataSource(): void {
		this.dataSource.data = this.teamArray;
	}

	private refresh() {
		this.fetchInitialData();
		this.dataSource.data = this.teamArray;
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
			await this.historicDatabaseService.deleteRow(data);
			this.refresh();
		} catch (err) {
			console.error('error deleting: ', err);
		}
	}

	private openTableEditDialogWithCallback(data?: Team, searchTerm?: string): void {
		console.log('open table dialog with callback invoked');
		const dialogRef = this.dialogService.openTableEditDialog(
			'team',
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
				await this.historicDatabaseService.updateByType('team', data);

				this.refresh();
			}
		} catch (err) {
			console.error('error updating', err);
		}
	}

	ngOnDestroy(): void {}
}
