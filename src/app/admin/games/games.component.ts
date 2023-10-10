import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit, OnDestroy {
	constructor(private sharedDataService: SharedDataService) {}

	ngOnInit(): void {}
	onTabChange(event: MatTabChangeEvent): void {
		const selectedTabIndex = event.index;
		const selectedTabLabel = event.tab.textLabel;
		this.sharedDataService.updateTabChange(selectedTabIndex);

		// Now you have the index and label of the selected tab
		console.log(`Selected Tab Index: ${selectedTabIndex}`);
		console.log(`Selected Tab Label: ${selectedTabLabel}`);

		// You can use these values as needed in your component logic
	}
	ngOnDestroy(): void {}
}
