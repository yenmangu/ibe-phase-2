import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GamesModule } from './games/games.module';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { GameActionsComponent } from './game-actions/game-actions.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { GamesComponent } from './games/games.component';

// dev
import { PairsTableComponent } from './games/pairs-table/pairs-table.component';
import { CurrentGameComponent } from './games/current-game/current-game.component';
import { HistoricGamesComponent } from './games/historic-games/historic-games.component';
import { PlayerDatabaseComponent } from './games/database-landing/player-database/player-database.component';

const routes: Routes = [
	{
		path: '',
		component: AdminComponent,
		children: [
			{
				path: 'games',
				component: GamesComponent,
				loadChildren: () => import('./games/games.module').then(m => m.GamesModule)
			},
			{ path: 'game-setup', component: GameSetupComponent },
			{ path: 'game-actions', component: GameActionsComponent },
			{ path: 'game-settings', component: GameSettingsComponent },
			{ path: 'account', component: AccountSettingsComponent },
			{ path: 'dashboard', component: DashboardComponent },
			// Additional admin routes
			{ path: '', pathMatch: 'full', redirectTo: 'games' }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule {}
