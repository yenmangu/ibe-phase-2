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
import { HistoricGamesDialogComponent } from './historic-games-dialog/historic-games-dialog.component';
import { HttpService } from 'src/app/shared/services/http.service';
import { SharedGameDataService } from '../services/shared-game-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { HistoricGame } from 'src/app/shared/data/interfaces/historic-game';
import { CustomSnackbarComponent } from 'src/app/shared/custom-snackbar/custom-snackbar.component';

@Component({
	selector: 'app-historic-games',
	templateUrl: './historic-games.component.html',
	styleUrls: ['./historic-games.component.scss']
})
export class HistoricGamesComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	applyMagentaGreyTheme: boolean = true;
	// currentPage = 1;
	// itemsPerPage = 12;
	// totalPages: number = undefined;
	// // dataSource = new MatTableDataSource<any>([]);
	// dataSource: MatTableDataSource<any>;
	// originalData: any[];
	// displayedColumns: any[] = ['number', 'name', 'date', 'delete'];
	// searchTerm: string = '';
	// databaseSubscription = new Subscription();
	// isLoading: boolean = true;
	// isDBInit: boolean = false;
	// IDBStatusSubscription = new Subscription();

	// New props

	historicArray: HistoricGame[] = [];
	private historicSubject = new Subject<HistoricGame[]>();
	historicData$ = this.historicSubject.asObservable();

	isLoading: boolean = true;
	updateDataSubscription: Subscription;
	dataSource = new MatTableDataSource<any>();
	displayedColumns: string[] = ['number', 'name', 'date', 'delete'];
	searchTerm: string = '';
	selectedRowData: HistoricGame | undefined;
	updatedData: any[] = [];
	sortedData: any[] = [];
	zip: string = '';
	gameCode: string = '';
	dirKey: string = '';
	storeName: string = 'historic_game_data';
	storeKey: string = 'histitem';
	deleteHovered: boolean = false;
	rowHovered: boolean = false;

	private destroy$ = new Subject<void>();

	constructor(
		private historicDatabaseService: HistoricGamesDatabaseService,
		private dialog: MatDialog,
		private httpService: HttpService,
		private sharedGameDataService: SharedGameDataService,
		private snackbar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.isLoading = true;
		this.historicData$.pipe(takeUntil(this.destroy$)).subscribe(data => {
			console.log('Raw data from historicData$: ', data);

			this.historicArray = data;
			this.initDataSource();
			this.isLoading = false;
		});
		this.fetchInitialData();
		this.gameCode = localStorage.getItem('GAME_CODE');
		this.dirKey = localStorage.getItem('DIR_KEY');
	}

	ngAfterViewInit(): void {
		this.refreshSortPaginator();
		this.updateDataSubscription = this.historicDatabaseService
			.getDataUpdated$()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: value => {
					if (value) {
						this.refresh();
					}
				},
				error: error => {
					console.error('Error updating data: ', error);
				}
			});
	}

	private checkIsLoading() {
		if (this.dataSource.data.length < 1) {
			this.isLoading = true;
		}
	}

	private async fetchInitialData() {
		try {
			if (this.storeName && this.storeKey) {
				this.historicSubject.next(
					await this.historicDatabaseService.fetchHistoricData(
						this.storeName,
						this.storeKey
					)
				);
			}
		} catch (error) {
			console.error('Error fetching initial data: ', error);
		}
	}

	refreshSortPaginator() {
		if (this.paginator && this.sort) {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}
	}

	refreshDataSource() {
		this.dataSource.data = this.historicArray;
	}

	private initDataSource() {
		this.sortArray(this.historicArray);
		const updatedData = this.historicArray.map(item => {
			return {
				...item,
				value: {
					key: item.key,
					...item.value
				}
			};
		});
		this.dataSource.data = this.remapData(updatedData);
	}

	private remapData(data: any[]) {
		return data.map(item => ({
			number: Number(item['$'].n),
			name: item.ename[0],
			date: item.edate[0],
			zipname: item.zipname[0],
			deleteHovered: false
		}));
	}

	private sortArray(data) {
		return data.sort((a, b) => +b.key - +a.key);
	}

	private async refresh() {
		try {
			this.fetchInitialData();
			this.refreshDataSource();
			this.refreshSortPaginator();
		} catch (error) {
			console.error('Error refreshing data source: ', error);
		}
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	// findRowData(clickedRow) {
	// 	return this.historicArray.find(
	// 		item => item.value.zipname === clickedRow.zipname
	// 	);
	// }

	onDeleteClicked(event: Event, row: any) {
		event.stopPropagation();
		console.log('Game event: ', row);
		this.zip = row.zipname;
		const config = {
			delete: true,
			title: 'Delete this game from history?',
			message:
				'Deleting this game will permanently remove this game from the history and can never be restored again. Are you sure you wish to continue?',
			button: 'Delete'
		};

		this.openDialog(config);
	}

	onRowClick(row): void {
		// console.log('row: ', row);
		this.zip = row.zipname;
		const config = {
			restore: true,
			title: 'Restore this game?',
			message:
				'Restoring this game will overwrite the current game, which will be achived and may be restored later',
			button: 'Restore'
		};
		this.openDialog(config);
	}

	private openDialog(config) {
		const dialogRef = this.dialog.open(HistoricGamesDialogComponent, {
			width: '300px',
			data: {
				title: config.title,
				message: config.message,
				button: config.button,
				zip: this.zip,
				gameCode: this.gameCode,
				dirKey: this.dirKey
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result === true) {
				// console.log('dialog response: ', result);

				const payload = {
					gameCode: this.gameCode,
					dirKey: this.dirKey,
					zipName: this.zip
				};
				if (config.restore && config.restore === true) {
					this.httpService.restoreHistoricGame(payload).subscribe({
						next: response => {
							console.log('response from api: ', response);
							if (response.result.success) {
								console.log('Success restoring game');
								this.openSuccessSnackbar('restore');
							}
						},
						error: error => {
							console.log('error from api: ', error);
							this.snackbar.open(
								'Error restoring game, please try again, or try restoring a different game',
								'Dismiss'
							);
						}
					});
				}
				if (config.delete && config.delete === true) {
					console.log('Delete');
					console.log('Payload: ', payload);

					this.httpService.deleteHistoricGame(payload).subscribe({
						next: response => {
							console.log('Response from delete request: ', response);
							if (response.result.success) {
								this.openSuccessSnackbar('delete');
							}
							if (response.result.success === false) {
								const error = response.result?.error ?? 'Unknown Error';
								this.snackbar.openFromComponent(CustomSnackbarComponent, {
									data: {
										message: 'Error deleting game from history.',
										error: this.getReadableError(error)
									}
								});
							}
						},
						error: error => {
							console.error('Error deleting: ', error);
							const serverError = error.error?.result?.error ?? 'Unknown Error';
							this.snackbar.openFromComponent(CustomSnackbarComponent, {
								data: {
									message: 'Error deleting game from history.',
									error: this.getReadableError(serverError)
								}
							});
						}
					});
				}
			}
		});
	}

	private openSuccessSnackbar(type: 'delete' | 'restore') {
		const verb = type === 'delete' ? 'deleting' : 'restoring';
		this.snackbar
			.open(
				`Success ${verb} game from history. Dismiss to refresh the database.`,
				'Dismiss'
			)
			.afterDismissed()
			.subscribe(result => {
				// console.log('Result from afterDismissed: ', result);
				result.dismissedByAction
					? this.sharedGameDataService.triggerRefreshDatabase()
					: console.error('An Error Occurred with snackbar');
			});
	}

	deleteHover(game) {
		game.deleteHovered = !game.deleteHovered;
	}

	rowHover(row) {}

	getReadableError(errorCode) {
		let errorString: string = '';
		switch (errorCode) {
			case 'noolddir':
				errorString = 'Game code exists but does not have archived game directory';
				break;
			case 'nozipname':
				errorString = 'No game zipname provided';
				break;
			case 'notinoldlist':
				errorString = 'Zipname provided does not exist';
				break;
			case 'nozipfile':
				errorString = 'Game archive file does not exist. (Nothing to download).';
				break;
			case 'nogamedir':
				errorString = 'Game code provided does not exist';
				break;
			default:
				errorString = 'Unspecified error.';
		}
		return errorString;
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}

// ONLY LOAD COMPONENT WHEN DATABASE HAS INITIATED AND LOADED DATA
