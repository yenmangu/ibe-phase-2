import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
// Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

//  Custom
import { NavigationComponent } from './navigation/navigation.component';
import { AdminComponent } from './admin.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { GamesModule } from './games/games.module';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { BoardsScoringComponent } from './game-setup/boards-scoring/boards-scoring.component';
import { FormControlPipe } from '../form-control.pipe';
import { PlayerIdentificationComponent } from './game-setup/player-identification/player-identification.component';
import { AppInterfaceComponent } from './game-setup/app-interface/app-interface.component';
import { NamingNumberingComponent } from './game-setup/naming-numbering/naming-numbering.component';
import { UploadDownloadComponent } from './upload-download/upload-download.component';
import { SharedModule } from '../shared/shared.module';
import { adminReducer } from '../admin-state/admin.reducer';
import { HandRecordsLandingComponent } from './hands/hand-records-landing/hand-records-landing.component';
import { HandTabComponent } from './hands/hand-tab/hand-tab.component';
import { HandActionsComponent } from './hands/hand-actions/hand-actions.component';
import { DeleteDialogComponent } from './hands/delete-dialog/delete-dialog.component';
import { ReportingComponent } from './reporting/reporting.component';
import { AdminToolsComponent } from './admin-tools/admin-tools.component';
import { HtmlPdfDialogComponent } from './reporting/html-pdf-dialog/html-pdf-dialog.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { EbuXmlDialogComponent } from './reporting/ebu-xml-dialog/ebu-xml-dialog.component';
import { UploadPbnComponent } from './admin-tools/upload-pbn/upload-pbn.component';
@NgModule({
	declarations: [
		NavigationComponent,
		AdminComponent,
		AccountSettingsComponent,
		GameSetupComponent,
		BoardsScoringComponent,
		PlayerIdentificationComponent,
		FormControlPipe,
		AppInterfaceComponent,
		NamingNumberingComponent,
		UploadDownloadComponent,
		HandRecordsLandingComponent,
		HandTabComponent,
		HandActionsComponent,
		DeleteDialogComponent,
		ReportingComponent,
		AdminToolsComponent,
		HtmlPdfDialogComponent,
		WelcomeScreenComponent,
		EbuXmlDialogComponent,
		UploadPbnComponent
	],
	imports: [
		CommonModule,
		AdminRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModule,
		StoreModule.forFeature('admin', adminReducer),
		// Material
		MatSidenavModule,
		MatButtonModule,
		MatIconModule,
		MatTabsModule,
		MatTableModule,
		MatRadioModule,
		MatSortModule,
		MatFormFieldModule,
		MatCheckboxModule,
		MatSelectModule,
		MatInputModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatDialogModule,

		// Custom
		DashboardModule,
		GamesModule
	],
	exports: [],
	providers: [
		{ provide: MatDialogModule, useValue: {} },
		{ provide: MatDialogRef, useValue: {} }
	]
})
export class AdminModule {}
