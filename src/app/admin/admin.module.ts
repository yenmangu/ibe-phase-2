import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
// Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
//  Custom
import { NavigationComponent } from './navigation/navigation.component';
import { AdminComponent } from './admin.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { GameActionsComponent } from './game-actions/game-actions.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { GamesModule } from './games/games.module';

@NgModule({
	declarations: [
		NavigationComponent,
		AdminComponent,
		GameSetupComponent,
		GameSettingsComponent,
		GameActionsComponent,
		AccountSettingsComponent,
	],
	imports: [
		CommonModule,
		AdminRoutingModule,
		ReactiveFormsModule,
		// Material
		MatSidenavModule,
		MatButtonModule,
		MatIconModule,
		MatTabsModule,
		MatTableModule,
		MatRadioModule,
		// Custom
		DashboardModule,
		GamesModule
	]
})
export class AdminModule {}
