import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { GamesRoutingModule } from './games-routing.module';

import { GamesComponent } from './games.component';
import { CurrentGameComponent } from './current-game/current-game.component';
import { HistoricGamesComponent } from './historic-games/historic-games.component';
import { PlayerDatabaseComponent } from './player-database/player-database.component';

@NgModule({
	declarations: [
		GamesComponent,
		CurrentGameComponent,
		HistoricGamesComponent,
		PlayerDatabaseComponent
	],
	imports: [
		CommonModule,
		GamesRoutingModule,
		MatTabsModule,
		MatTableModule,
		MatInputModule,
		MatFormFieldModule
	]
})
export class GamesModule {}
