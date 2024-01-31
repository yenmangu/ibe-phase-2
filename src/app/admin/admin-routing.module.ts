import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { GamesComponent } from './games/games.component';
import { HandRecordsLandingComponent } from './hands/hand-records-landing/hand-records-landing.component';
import { HistoricGamesComponent } from './games/historic-games/historic-games.component';
import { ReportingComponent } from './reporting/reporting.component'; // dev
import { DatabaseLandingComponent } from './games/database-landing/database-landing.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { LinExtractionComponent } from '../shared/lin-extraction/lin-extraction.component';
import { AdminToolsComponent } from './admin-tools/admin-tools.component';
const routes: Routes = [
	{
		path: '',
		component: AdminComponent,
		children: [
			{
				path: 'welcome-members',
				component: WelcomeScreenComponent,
				data: { menuLabel: 'Members Area' }
			},
			{
				path: 'games',
				component: GamesComponent,
				data: { menuLabel: 'Game In Progress' },
				loadChildren: () => import('./games/games.module').then(m => m.GamesModule)
			},
			{
				path: 'game-setup',
				component: GameSetupComponent,
				data: { menuLabel: 'Game Code Settings' }
			},
			{
				path: 'hand-records',
				component: HandRecordsLandingComponent,
				data: { menuLabel: 'Hand Records' }
			},
			{
				path: 'reporting',
				component: ReportingComponent,
				data: { menuLabel: 'Reporting' }
			},
			{
				path: 'historic-games',
				component: HistoricGamesComponent,
				data: { menuLabel: 'Historic Games' }
			},
			{
				path: 'account',
				component: AccountSettingsComponent,
				data: { menuLabel: 'Account Settings' }
			},
			{
				path: 'player-database',
				component: DatabaseLandingComponent,
				data: { menuLabel: 'Player Database' }
			},
			{
				path: 'admin-tools',
				component: AdminToolsComponent,
				data: { menuLabel: 'Admin Tools' }
			},
			{ path: 'dashboard', component: DashboardComponent },
			// Additional admin routes
			{ path: '', pathMatch: 'full', redirectTo: 'welcome-members' }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule {}
