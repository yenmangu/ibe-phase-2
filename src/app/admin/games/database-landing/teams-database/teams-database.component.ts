import {
	Component,
	Input,
	OnInit,
	DoCheck,
	OnDestroy,
	AfterViewInit,
	ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-teams-database',
	templateUrl: './teams-database.component.html',
	styleUrls: ['./teams-database.component.scss']
})
export class TeamsDatabaseComponent implements OnInit, AfterViewInit, DoCheck {
	@Input() teamsArray: any[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	applyMagentaGreyTheme = true;
	isLoading: boolean = true;

	dataSource = new MatTableDataSource<any>();
	tabChangeSubscription = new Subscription();
	tabSelected: boolean = false;
	displayedColumns: string[] = ['number', 'team', 'lastUsed', 'added', 'delete'];
	searchTerm: string = '';

	ngOnInit(): void {
		this.isLoading = true;
		this.dataSource = new MatTableDataSource(this.teamsArray);
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
}
