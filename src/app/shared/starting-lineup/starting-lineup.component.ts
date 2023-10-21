import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedGameDataService } from 'src/app/admin/games/services/shared-game-data.service';
import { ApiDataCoordinationService } from 'src/app/admin/games/services/api/api-data-coordination.service';
import { BreakpointService } from '../services/breakpoint.service';
@Component({
	selector: 'app-starting-lineup',
	templateUrl: './starting-lineup.component.html',
	styleUrls: ['./starting-lineup.component.scss']
})
export class StartingLineupComponent implements OnInit {
	startingLineupData;
	gameId: string = '';
	gameCode: string = '';
	tablesArray: [] = [];
	north: [] = [];
	south: [] = [];
	east: [] = [];
	west: [] = [];

	currentBreakpoint = '';

	constructor(
		private sharedGameData: SharedGameDataService,
		private route: ActivatedRoute,
		private apiCoordinationService: ApiDataCoordinationService,
		private breakpointService: BreakpointService
	) {}

	ngOnInit(): void {
		this.route.queryParams.subscribe(async params => {
			this.gameId = params['game_id'];
			this.gameCode = params['game_code'];
		});
		const data = { gameCode: this.gameCode, gameId: this.gameId };

		this.getPublicData(data);
		this.breakpointService.currentBreakpoint$.subscribe(
			breakpoint => (this.currentBreakpoint = breakpoint)
		);
	}

	getPublicData(data) {
		this.apiCoordinationService.getPublicGame(data).subscribe(data => {
			if (data) {
				this.startingLineupData = data;
				// this.tablesArray = data.foundGameConfig.tableConfig;
				const {
					foundGameConfig: { north, south, east, west }
				} = this.startingLineupData;
				this.north = north;
				this.south = south;
				this.east = east;
				this.west = west;
			}
			console.log(this.tablesArray);

			console.log('data: ', this.startingLineupData);
		});
	}
}
