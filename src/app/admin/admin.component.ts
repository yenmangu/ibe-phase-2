import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared/services/shared-data.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
	gameCode: string = '';
	dirKey: string = '';
	dirKeySubscription = new Subscription();
	gameCodeSubscription = new Subscription();

	constructor(private sharedDataService: SharedDataService) {
		// console.log('admin loaded');
	}
	ngOnInit(): void {
		console.log('admin init');

		// Check if gameCode observable is empty and update it from local storage if needed
		// Subscribe to the game code observable
		this.sharedDataService.getGameCode().subscribe(gameCode => {
			this.gameCode = gameCode || localStorage.getItem('GAME_CODE') || '';
		});

		// Subscribe to the dir key observable
		this.sharedDataService.getDirKey().subscribe(dirKey => {
			this.dirKey = dirKey || localStorage.getItem('DIR_KEY') || '';
		});

		// Other initialization logic for the AdminComponent
	}
}
