import {
	AfterViewInit,
	Component,
	DoCheck,
	OnDestroy,
	OnInit,
	ViewChild,
	Input,
	Output,
	EventEmitter,
	ElementRef
} from '@angular/core';
import { Subscription, Subject, startWith } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { HistoricGamesDatabaseService } from '../../services/historic-games-database.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Player } from '../../../../shared/data/interfaces/player-data';
import { EmitDataDirective } from 'src/app/shared/directives/emit-data.directive'; // import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { DialogRef } from '@angular/cdk/dialog';
import { CurrentEventService } from '../../services/current-event.service';
import { SharedGameDataService } from '../../services/shared-game-data.service';

@Component({
	selector: 'app-player-database',
	templateUrl: './player-database.component.html',
	styleUrls: ['./player-database.component.scss']
})
export class PlayerDatabaseComponent
	implements OnInit, AfterViewInit, DoCheck, OnDestroy
{
	@ViewChild(MatTable) table: MatTable<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('input', { read: ElementRef }) input: ElementRef;

	private storeName: string = 'player';
	private playerDataSubject = new Subject<Player[]>();
	playerData$ = this.playerDataSubject.asObservable();

	private dataSubscription: Subscription;
	applyIbescoreTheme = true;
	applyMagentaGreyTheme = true;
	filteredData: any[] = [];

	playerArray: Player[] = [];
	pageEvent: PageEvent;
	pageIndex: number;
	pageSize: number;
	length: number;

	itemsPerPage = 12;
	currentPage = 1;
	totalPages: number | undefined;
	playerDatabaseSubscription: Subscription;
	isLoading: boolean = true;
	displayedColumns: string[] = [
		'n',
		'name',
		'email',
		'telephone',
		'id',
		'lastplay',
		'adddate',
		'delete'
	];

	updatedData: any[] = [];

	sortedData: any[];
	dataSource = new MatTableDataSource<any>();
	// dataSource = new MatTableDataSource<any>();
	tabChangeSubscription = new Subscription();
	tabSelected: boolean = false;
	selectedRowData: Player | undefined;
	updatedDataSubscription: Subscription;
	searchTerm: string;
	lasUpdatedData: any;
	currentRemoteDBRevision: string = '';

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
		this.playerData$.pipe().subscribe(data => {
			this.playerArray = data;
			// console.log(this.playerArray);
			this.initDataSource();
			this.isLoading = false;
		});
		this.fetchInitialData();

		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirkey = localStorage.getItem('DIR_KEY');
		this.fetchCurrentRevision();
	}

	ngAfterViewInit(): void {
		if (this.table) {
			this.table.updateStickyHeaderRowStyles();
		}
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

	async fetchCurrentRevision() {
		console.log('fetch current revision initialised');

		this.currentEventService
			.getLiveData(this.gameCode, this.dirkey)
			.subscribe(data => {
				this.currentRemoteDBRevision = data.currentDBRevision;
				console.log(
					'--------------\nCurrent remote db revision: ',
					this.currentRemoteDBRevision
				);

				this.sharedGameData.databaseRevisionSubject.next(
					this.currentRemoteDBRevision
				);
			});
	}

	async fetchInitialData() {
		try {
			console.log(this.storeName);
			const playerData = await this.historicDatabaseService.fetchHistoricData(
				'player'
			);
			this.playerDataSubject.next(playerData);
		} catch (err) {
			console.error('Error fetching initial: ', err);
		}
	}

	private sortArray(data) {
		return data.sort((a, b) => +b.key - +a.key);
	}

	private initDataSource(): void {
		this.sortArray(this.playerArray);
		const updatedData = this.playerArray.map(item => {
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

		// console.log('dataSource.data: ', this.dataSource.data);

		// console.log('new datasource: ', this.dataSource.data);
	}
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
			.trim()
			.toLowerCase();

		this.dataSource.filter = filterValue;
		this.searchTerm = filterValue;
		console.log('filterValue: ', filterValue);
	}

	private refresh() {
		this.fetchInitialData();
		// console.log('updated data source: ', this.playerArray);
		this.dataSource.data = this.playerArray;
		if (this.paginator && this.sort) {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
		this.table.renderRows();
	}

	private emitInitial() {
		const storeName = 'players';
		console.log('child component emitting: ', storeName);
	}

	getIds(IdArray): string[] {
		if (IdArray) {
			const result = [];
			IdArray.forEach(element => {
				result.push(`${element.$.type}: ${element.$.code}`);
			});
			return result;
		} else {
			return [''];
		}
	}

	onPlayerAdd(): void {
		const searchTerm = this.searchTerm ? this.searchTerm : '';
		this.openTableEditDialogWithCallback(undefined, searchTerm);
		console.log('searchTerm: ', searchTerm);
	}

	onRowClick(rowData): void {
		const selectedKey = rowData.newKey;
		console.log('selectedKey: ', selectedKey);
		console.log('rowData: ', rowData);

		const selectedData = this.playerArray.find(item => item.key === selectedKey);
		this.selectedRowData = selectedData;
		// this.selectedRowData = rowData;
		console.log('selected found data: ', selectedData);

		this.openTableEditDialogWithCallback(this.selectedRowData, undefined);
	}

	private openTableEditDialogWithCallback(
		data?: Player,
		searchTerm?: string
	): void {
		const dialogRef = this.dialogService.openTableEditDialog(
			'player',
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
				await this.historicDatabaseService.updateByType('player', data);

				this.refresh();
			}
		} catch (err) {
			console.error('error updating', err);
		}
	}

	private isDataEqual(existingData: any, newData: any): boolean {
		return JSON.stringify(existingData) === JSON.stringify(newData);
	}

	ngDoCheck(): void {}

	onDelete(row) {
		this.delete(row);
	}
	clearFilter(input: HTMLInputElement): void {
		this.dataSource.filter = '';
		input.value = '';
		this.searchTerm = undefined;
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
	ngOnDestroy(): void {
		// this.dataSubscription.unsubscribe();
		this.updatedDataSubscription.unsubscribe();
	}
}
