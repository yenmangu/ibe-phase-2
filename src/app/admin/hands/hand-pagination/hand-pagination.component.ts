import { Component, EventEmitter, Output } from '@angular/core';
import { HandService } from '../services/hand.service';

@Component({
	selector: 'app-hand-pagination',
	templateUrl: './hand-pagination.component.html',
	styleUrls: ['./hand-pagination.component.scss']
})
export class HandPaginationComponent {
	applyMagentaGreyTheme = true;

	currentHandPage: number;

	constructor(private handService: HandService) {}

	public navigateToPage(handPage: number): void {
		this.handService.updateCurrentHandPage(handPage);
	}
}
