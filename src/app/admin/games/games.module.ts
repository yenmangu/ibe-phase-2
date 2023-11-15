import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';

// CDK
import { CdkColumnDef } from '@angular/cdk/table';
// Other UI Modules
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

// Clarity

import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { CurrentGameComponent } from './current-game/current-game.component';
import { HistoricGamesComponent } from './historic-games/historic-games.component';
import { PlayerDatabaseComponent } from './database-landing/player-database/player-database.component';
import { GameActionsComponent } from './current-game/game-actions/game-actions.component';
import { GameSettingsComponent } from '../game-settings/game-settings.component';

// Pipes

import { KeysPipe } from 'src/app/shared/pipes/keys.pipe';
import { DataService } from './services/data.service';
import { MatchTablesComponent } from './match-tables/match-tables.component';
import { GamePlayersComponent } from './current-game/game-players/game-players.component';
import { PairsTableComponent } from './pairs-table/pairs-table.component';
import { TeamsTableComponent } from './teams-table/teams-table.component';
import { TeamsDatabaseComponent } from './database-landing/teams-database/teams-database.component';
import { VenuesDatabaseComponent } from './database-landing/venues-database/venues-database.component';
import { EventNamesDatabaseComponent } from './database-landing/event-names-database/event-names-database.component';
import { DatabaseLandingComponent } from './database-landing/database-landing.component';
import { AdvancedOptionsDialogComponent } from './database-landing/advanced-options-dialog/advanced-options-dialog.component';
import { HandPaginationComponent } from '../hands/hand-pagination/hand-pagination.component';
import { HandDisplayComponent } from '../hands/hand-display/hand-display.component';
import { PdfGenerationComponent } from './current-game/game-players/pdf-generation/pdf-generation.component';
import { CreateGameComponent } from './current-game/game-players/create-game/create-game.component';
import { RestoreDialogComponent } from './historic-games/restore-dialog/restore-dialog.component';

@NgModule({
	declarations: [
		GamesComponent,
		CurrentGameComponent,
		HistoricGamesComponent,
		PlayerDatabaseComponent,
		GameActionsComponent,
		GameSettingsComponent,
		GamePlayersComponent,
		TeamsTableComponent,
		MatchTablesComponent,
		PairsTableComponent,
		KeysPipe,
		TeamsTableComponent,
		TeamsDatabaseComponent,
		VenuesDatabaseComponent,
		EventNamesDatabaseComponent,
		DatabaseLandingComponent,
		AdvancedOptionsDialogComponent,
		HandPaginationComponent,
		HandDisplayComponent,
		PdfGenerationComponent,
		CreateGameComponent,
		RestoreDialogComponent
	],
	imports: [
		CommonModule,
		ScrollingModule,
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
		MatProgressSpinnerModule,
		MatIconModule,
		MatSortModule,
		MatPaginatorModule,
		MatCheckboxModule,
		MatProgressBarModule,
		MatDialogModule,
		// Other UI
		NgxMaterialTimepickerModule
		// Clarity
	],
	exports: [HandDisplayComponent, HandPaginationComponent],
	providers: [DataService, CdkColumnDef, DatePipe]
})
export class GamesModule {}
