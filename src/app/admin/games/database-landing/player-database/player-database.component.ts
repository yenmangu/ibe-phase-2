import {
	AfterViewInit,
	Component,
	DoCheck,
	OnDestroy,
	OnInit,
	ViewChild,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { HistoricGamesDatabaseService } from '../../services/historic-games-database.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Player } from '../../../../shared/data/interfaces/player-data';
import { EmitDataDirective } from 'src/app/shared/directives/emit-data.directive'; // import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
	selector: 'app-player-database',
	templateUrl: './player-database.component.html',
	styleUrls: ['./player-database.component.scss']
})
export class PlayerDatabaseComponent
	implements OnInit, AfterViewInit, DoCheck, OnDestroy
{
	@Input() playersArray: Player[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	private storeName: string = 'player';
	private playerDataSubject = new Subject<Player[]>();
	playerData$ = this.playerDataSubject.asObservable();

	private dataSubscription: Subscription;
	applyIbescoreTheme = true;
	applyMagentaGreyTheme = true;
	playerDatabase: any = {};

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
		'phone',
		'id',
		'adddate',
		'delete'
	];
	sortedData: any[];
	dataSource = new MatTableDataSource<any>();
	tabChangeSubscription = new Subscription();
	tabSelected: boolean = false;
	selectedRowData: Player | undefined;

	constructor(
		private playerDatabaseService: HistoricGamesDatabaseService,
		private sharedDataService: SharedDataService,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.isLoading = true;
		this.playerDatabaseSubscription =
			this.playerDatabaseService.dataLoading$.subscribe(data => {
				if (data) {
					console.log('player db subscription data: ', data);
					this.playerDatabase = data.value[0];
					// console.log('Player database games component data: ', this.playerDatabase);
					const dataArray = this.playerDatabase.item;
					this.dataSource = new MatTableDataSource(dataArray);
					this.dataSource.paginator = this.paginator;

					setTimeout(() => {
						if (this.sort) {
							this.dataSource.sort = this.sort;
						}
					});

					this.isLoading = false;
				}
			});
		this.tabChangeSubscription = this.sharedDataService.tabChange$.subscribe(
			data => {
				if (data === 2) {
					this.tabSelected = true;
				}
			}
		);
	}

	ngAfterViewInit(): void {
		this.loadDatabaseData();
		if (this.paginator) {
			this.dataSource.paginator = this.paginator;
			this.dataSource.paginator.firstPage();
		}

		// Initial loading
		this.totalPages = Math.ceil(this.dataSource.data.length / this.itemsPerPage);
	}

	ngDoCheck(): void {
		this.checkIsLoading();
	}

	async loadDatabaseData(): Promise<void> {
		if (!this.paginator) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}
		try {
			await this.playerDatabaseService.fetchMainData('player_db', 'root');
		} catch (err) {
			console.error('Error fetching data in playerDB component: ', err);
		}
	}

	sortData(sort: Sort) {
		const data = this.dataSource.data.slice();
		if (!sort.active || sort.direction === '') {
			this.sortedData = data;
			return;
		}
		this.sortedData = data.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'number':
					return this.compare(a.number, b.number, isAsc);
				case 'playerName':
					return this.compare(a.playerName, b.playerName, isAsc);
				case 'email':
					return this.compare(a.email, b.email, isAsc);
				case 'addDate':
					return this.compare(a.addDate, b.addDate, isAsc);
				default:
					return 0;
			}
		});
	}
	private compare(a: number | string, b: number | string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
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

	applyFilter(event: Event) {
		console.log('search term: ', event);
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	checkIsLoading() {
		if (this.tabSelected && this.dataSource.data.length < 1) {
			this.isLoading = true;
		}
	}
	onRowClick(rowData: Player): void {
		this.selectedRowData = rowData;
		console.log('selected row data: ', rowData);
		this.dialogService.openTableEditDialog(rowData);
	}

	onPlayerAdd(): void {
		this.dialogService.openTableEditDialog();
	}

	onNameClick(player: any): void {
		alert(`player ${player.name}`);
	}

	deleteRow(player: any): void {
		alert(`player ${player?.name} delete clicked`);
	}

	onSave() {}

	private sendToParent(data: any) {
		this.dataUpdated.emit(data);
	}

	ngOnDestroy(): void {
		// this.playerDatabaseService.dataLoadingSubject.complete();
		this.playerDatabaseSubscription.unsubscribe();
	}
}
