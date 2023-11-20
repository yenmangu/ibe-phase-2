import { Component, Input, OnInit } from '@angular/core';
import { HandService } from 'src/app/admin/hands/services/hand.service';
@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() totalPages: number
	applyMagentaGreyTheme = true;

	currentHandPage: number;
	constructor(private handService: HandService) {}

	ngOnInit(): void {
		this.handService.currentHandPage$.subscribe(page => {
			this.currentHandPage = page;
		});
		
	}

	public navigateToPage(handPage: number): void {
		this.handService.updateCurrentHandPage(handPage);
	}
}
