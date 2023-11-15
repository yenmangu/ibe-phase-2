import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { AuthGuard } from './shared/services/permissions.service';
// Dev Routes
import { PairsTableComponent } from './admin/games/pairs-table/pairs-table.component';
import { GamesComponent } from './admin/games/games.component';
import { StartingLineupComponent } from './shared/starting-lineup/starting-lineup.component';
import { HandComponent } from './dev/hand/hand.component';

const routes: Routes = [
	{ path: 'dev', component: GamesComponent },
	{ path: '', pathMatch: 'full', redirectTo: '/home' },
	{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: 'admin',
		loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'starting-lineup',
		component: StartingLineupComponent
	},
	{ path: 'dev/hand', component: HandComponent },
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/admin'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
