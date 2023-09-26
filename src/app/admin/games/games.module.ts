import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

import { GamesRoutingModule } from './games-routing.module';

import { GamesComponent } from './games.component';
import { CurrentGameComponent } from './current-game/current-game.component';
import { HistoricGamesComponent } from './historic-games/historic-games.component';
import { PlayerDatabaseComponent } from './player-database/player-database.component';
import { GameActionsComponent } from './current-game/game-actions/game-actions.component';
import { GamePlayersComponent } from './current-game/game-players/game-players.component';

@NgModule({
	declarations: [
		GamesComponent,
		CurrentGameComponent,
		HistoricGamesComponent,
		PlayerDatabaseComponent,
		GameActionsComponent,
		GamePlayersComponent
	],
	imports: [
		CommonModule,
		GamesRoutingModule,
		FormsModule,
		MatTabsModule,
		MatTableModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatCardModule,
		MatDatepickerModule,
		MatSelectModule
	]
})
export class GamesModule {}
