import { Component, OnInit, OnDestroy } from '@angular/core';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit, OnDestroy {
	constructor(private sharedDataService: SharedDataService) {}

	async ngOnInit(): Promise<void> {}

	ngOnDestroy(): void {}
}
