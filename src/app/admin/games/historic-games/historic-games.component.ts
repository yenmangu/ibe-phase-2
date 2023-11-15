import {
	Component,
	OnInit,
	AfterViewInit,
	ViewChild,
	OnDestroy
} from '@angular/core';
import { HistoricGamesDatabaseService } from '../services/historic-games-database.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { IconRegistryService } from 'src/app/shared/services/icon-registry.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { MatDialog } from '@angular/material/dialog';
import { RestoreDialogComponent } from './restore-dialog/restore-dialog.component';
import { HttpService } from 'src/app/shared/services/http.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
@Component({
	selector: 'app-historic-games',
	templateUrl: './historic-games.component.html',
	styleUrls: ['./historic-games.component.scss']
})
export class HistoricGamesComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	applyMagentaGreyTheme: boolean = true;
	currentPage = 1;
	itemsPerPage = 12;
	totalPages: number = undefined;
	// dataSource = new MatTableDataSource<any>([]);
	dataSource: MatTableDataSource<any>;
	displayedColumns: any[] = ['number', 'name', 'date', 'delete'];
	searchTerm: string = '';
	databaseSubscription = new Subscription();
	isLoading: boolean = true;
	isDBInit: boolean = false;
	IDBStatusSubscription = new Subscription();
	zip: string = '';

	private destroy$ = new Subject<void>();

	constructor(
		private historicGamesService: HistoricGamesDatabaseService,
		private IDBStatus: IndexedDatabaseStatusService,
		private dialog: MatDialog,
		private httpService: HttpService,
		private userDetails: UserDetailsService
	) {}

	ngOnInit(): void {
		console.log('historic games component init');
		this.IDBStatusSubscription = this.IDBStatus.isInitialised$
			.pipe(takeUntil(this.destroy$))
			.subscribe(init => {
				this.isDBInit = init;
			});
		if (this.isDBInit) {
			this.databaseSubscription = this.historicGamesService.dataLoading$.subscribe(
				data => {
					this.dataSource = new MatTableDataSource();

					if (data) {
						console.log('historic data: ', data);
						this.dataSource.data = data.value;
						this.dataSource.paginator = this.paginator;
						this.isLoading = false;
					} else {
						console.log('no data');

						this.dataSource.data = [];
					}
					console.log('historic games component: ', this.dataSource);
				}
			);
		}
		this.fetchData();
	}

	ngAfterViewInit(): void {
		if (this.paginator) {
			this.dataSource.paginator = this.paginator;
		}
	}

	private async fetchData() {
		console.log('historic game component fetch data called');
		try {
			await this.historicGamesService.fetchMainData(
				'historic_game_data',
				'histitem'
			);
		} catch (err) {
			console.error('Error fetching database data: ', err);
		}
	}
	private compare(a: number | string, b: number | string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

	get paginatedData() {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
		const totalPages = Math.ceil(this.dataSource.data.length / this.itemsPerPage);
		this.totalPages = totalPages;
		// console.log('page data: ',this.historicGamesData.slice(startIndex, endIndex))
		return this.dataSource.data.slice(startIndex, endIndex);
	}
	setPage(pageNumber: number) {
		this.currentPage = pageNumber;
	}

	applyFilter(event: Event) {
		console.log('search term: ', event);
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	onDeleteClicked(game: any) {
		// alert(`Game ID ${}`)
	}

	onRowClick(row): void {
		console.log('row: ', row);
		this.zip = row.zipname[0];
	}

	private openDialog() {
		const dialogRef = this.dialog.open(RestoreDialogComponent, {
			width: '300px',
			data: {
				title: 'Restore this game?',
				message:
					'Restoring this game will overwrite the current game, which will be achived and may be restored later',
				zip: this.zip
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result === true) {
				const gameCode = localStorage.getItem('GAME_CODE');
				const dirKeky = localStorage.getItem('DIR_KEY');
				const data = { gameCode, dirKeky, zip: this.zip };

				//
			}
		});
	}

	ngOnDestroy(): void {
		this.IDBStatusSubscription.unsubscribe();
		this.databaseSubscription.unsubscribe();
		this.destroy$.next();
		this.destroy$.complete();
	}
}

// ONLY LOAD COMPONENT WHEN DATABASE HAS INITIATED AND LOADED DATA
