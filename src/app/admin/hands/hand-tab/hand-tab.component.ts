import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HandService } from '../services/hand.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-hand-tab',
	templateUrl: './hand-tab.component.html',
	styleUrls: ['./hand-tab.component.scss']
})
export class HandTabComponent implements OnInit, OnChanges {
	currentHandPage: number = 1;
	currentHandData: string[] = [];

	constructor(private handService: HandService) {}

	ngOnInit(): void {
		this.handService.currentHandPage$.subscribe(async page => {
			console.log('page changed to: ', page);

			this.currentHandPage = page;
			await this.fetchHandData(page);
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if ('currentHandPage' in changes) {
			const newPageValue = changes.currentHandPage.currentValue;
			console.log('pageValue: ', newPageValue);

			this.fetchHandData(newPageValue);
		}
	}

	handleHandPageChange(page: number): void {
		this.currentHandPage = page;
		// this.fetchHandData();
	}

	async fetchHandData(pageValue) {
		try {
			this.currentHandData = await this.handService.processCurrentHand(pageValue);
			console.log('current hand data: ', this.currentHandData);
		} catch (error) {
			console.error('Error displaying handData: ', error);
			this.showError(error);
		}
	}

	showError(error) {}

	onUploadNew() {}
	onDownloadCurrent() {}
	onDeletCurrent() {}
	onHide() {}
}
