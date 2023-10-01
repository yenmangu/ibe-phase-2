import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// Material
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

// Clarity


import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { CurrentGameComponent } from './current-game/current-game.component';
import { HistoricGamesComponent } from './historic-games/historic-games.component';
import { PlayerDatabaseComponent } from './player-database/player-database.component';
import { GameActionsComponent } from './current-game/game-actions/game-actions.component';
import { GamePlayersComponent } from './current-game/game-players/game-players.component';

// Pipes

import { KeysPipe } from 'src/app/shared/pipes/keys.pipe';

import { DataService } from './services/data.service';
import { MatchTablesComponent } from './match-tables/match-tables.component';
import { TeamTablesComponent } from './team-tables/team-tables.component';
import { PairsTableComponent } from './pairs-table/pairs-table.component';
@NgModule({
	declarations: [
		GamesComponent,
		CurrentGameComponent,
		HistoricGamesComponent,
		PlayerDatabaseComponent,
		GameActionsComponent,
		GamePlayersComponent,
		MatchTablesComponent,
		TeamTablesComponent,
		PairsTableComponent,
		KeysPipe
	],
	imports: [
		CommonModule,
		GamesRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		// Material
		MatTabsModule,
		MatTableModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatCardModule,
		MatDatepickerModule,
		MatSelectModule,
		// Clarity
	
	],
	providers: [DataService]
})
export class GamesModule {}
