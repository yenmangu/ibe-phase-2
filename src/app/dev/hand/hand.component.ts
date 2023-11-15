import { Component, OnInit } from '@angular/core';
import { HandService } from 'src/app/admin/hands/services/hand.service';

@Component({
	selector: 'app-hand',
	templateUrl: './hand.component.html',
	styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {
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
}
