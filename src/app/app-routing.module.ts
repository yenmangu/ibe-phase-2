import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { AuthGuard } from './shared/services/permissions.service';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/home' },
	{ path: 'home', component: HomeComponent, canActivate:[AuthGuard] },
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
		path: '',
		pathMatch: 'full',
		redirectTo: '/admin'
	},

	// {
	// 	path: 'dashboard',
	// 	loadChildren: () =>
	// 		import('./admin/dashboard/dashboard.module').then(m => m.DashboardModule),
	// 	canActivate: [AuthGuard]
	// }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
