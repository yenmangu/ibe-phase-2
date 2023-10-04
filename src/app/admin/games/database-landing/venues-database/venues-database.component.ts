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
	isLoading: boolean = true;

	dataSource = new MatTableDataSource<any>();
	tabChangeSubscription = new Subscription();
	tabSelected: boolean = false;
	displayedColumns: string[] = ['number', 'venue', 'lastUsed', 'added', 'delete'];
	searchTerm: string = '';

	ngOnInit(): void {
		this.isLoading = true;
		this.dataSource = new MatTableDataSource(this.venuesArray);
		this.dataSource.paginator = this.paginator;
	}

	ngAfterViewInit(): void {
		if (this.paginator) {
			this.dataSource.paginator = this.paginator;
		}
	}

	ngDoCheck(): void {
		this.checkIsLoading();
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
