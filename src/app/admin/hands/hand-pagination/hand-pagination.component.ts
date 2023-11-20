import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { HandService } from '../services/hand.service';

@Component({
	selector: 'app-hand-pagination',
	templateUrl: './hand-pagination.component.html',
	styleUrls: ['./hand-pagination.component.scss']
})
export class HandPaginationComponent implements OnInit {
	@Input() totalPages: number;
	applyMagentaGreyTheme = true;
	disabled: boolean = false;

	currentHandPage: number;

	constructor(private handService: HandService) {}

	ngOnInit(): void {
		this.handService.currentHandPage$.subscribe(
			handPage => (this.currentHandPage = handPage)
		);
	}

	public navigateToPage(handPage: number): void {
		this.handService.updateCurrentHandPage(handPage);
	}
}
