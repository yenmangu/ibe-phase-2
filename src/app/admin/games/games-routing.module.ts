import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { CurrentGameComponent } from './current-game/current-game.component';
import { HistoricGamesComponent } from './historic-games/historic-games.component';
import { PlayerDatabaseComponent } from './database-landing/player-database/player-database.component';

const routes: Routes = [
	{
		path: '',
		component: GamesComponent,

		children: [
			{ path: 'current-game', component: CurrentGameComponent },
			{ path: 'historic-games', component: HistoricGamesComponent },
			{ path: 'player-database', component: PlayerDatabaseComponent },
			// { path: '', pathMatch: 'full', redirectTo: 'current-game' }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GamesRoutingModule {}
