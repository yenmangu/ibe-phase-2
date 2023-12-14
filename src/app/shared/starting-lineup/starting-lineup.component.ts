import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
	nsPairs: any = {};
	ewPairs: any = {};
	eventName: string = '';
	pairConfig: any;
	pairNumbers: any;
	matchType: string;
	teamConfig: any = {};
	individualNumbers: any = {};

	currentBreakpoint = '';

	constructor(
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
			// prettier-ignore
			if (data) {
				this.startingLineupData = data;
				console.log('starting line up: ', data);

				// this.tablesArray = data.foundGameConfig.tableConfig;
				const {
					foundGameConfig: {
						north,
						south,
						east,
						west,
						eventName,
						pairNumbers,
						pairConfig,
						matchType,
						teamConfig,
						individuals
					}
				} = this.startingLineupData;
				console.log('match type: ', matchType);
				this.matchType = matchType;
				this.north = north;
				this.south = south;
				this.east = east;
				this.west = west;
				this.eventName = eventName,
				this.pairConfig = pairConfig,
				this.pairNumbers = pairNumbers;
				this.teamConfig = teamConfig;
				this.individualNumbers = individuals
			}
			console.log(this.tablesArray);

			console.log('data: ', this.startingLineupData);
		});
	}
}
