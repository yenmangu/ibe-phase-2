import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HistoricGamesDatabaseService } from '../services/historic-games-database.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { IconRegistryService } from 'src/app/shared/services/icon-registry.service';

@Component({
	selector: 'app-historic-games',
	templateUrl: './historic-games.component.html',
	styleUrls: ['./historic-games.component.scss']
})
export class HistoricGamesComponent implements OnInit, AfterViewInit {
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

	constructor(private historicGamesService: HistoricGamesDatabaseService) {}

	ngOnInit(): void {
		this.databaseSubscription = this.historicGamesService.dataLoading$.subscribe(
			data => {
				if (data) {
					console.log('data: ', data);
					this.dataSource = new MatTableDataSource(data.value);
					this.dataSource.paginator = this.paginator
				}
				console.log('historic games component: ', this.dataSource);
			}
		);
		this.fetchData();
	}

	ngAfterViewInit(): void {
		if (this.paginator) {
			this.dataSource.paginator = this.paginator;
		}
	}

	private async fetchData() {
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
}

// ONLY LOAD COMPONENT WHEN DATABASE HAS INITIATED AND LOADED DATA
