import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Material
// import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from '../material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

// Components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DialogComponent } from './dialog/dialog.component';
import { EmitDataDirective } from './directives/emit-data.directive';
import { PlayerTableDialogComponent } from './player-table-dialog/player-table-dialog.component';
import { TeamTableDialogComponent } from './team-table-dialog/team-table-dialog.component';
import { EventTableDialogComponent } from './event-table-dialog/event-table-dialog.component';
import { VenueTableDialogComponent } from './venue-table-dialog/venue-table-dialog.component';
import { UserDetailsComponent } from './header/user-details/user-details.component';
import { StartingLineupComponent } from './starting-lineup/starting-lineup.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { DownloadFileComponent } from './download-file/download-file.component';
import { BboUploadComponent } from './bbo-upload/bbo-upload.component';
import { UsebioComponent } from './usebio/usebio.component';
import { DeleteRowDialogComponent } from './delete-row-dialog/delete-row-dialog.component';

// Modules

@NgModule({
	declarations: [
		HeaderComponent,
		FooterComponent,
		DialogComponent,
		EmitDataDirective,
		PlayerTableDialogComponent,
		TeamTableDialogComponent,
		EventTableDialogComponent,
		VenueTableDialogComponent,
		UserDetailsComponent,
		StartingLineupComponent,
		UploadFileComponent,
		DownloadFileComponent,
  BboUploadComponent,
  UsebioComponent,
  DeleteRowDialogComponent
	],
	imports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		MatFormFieldModule,
		MatDialogModule
	],
	exports: [
		HeaderComponent,
		FooterComponent,
		UploadFileComponent,
		DownloadFileComponent,
		UserDetailsComponent
	],
	providers: [
		{ provide: MatDialogModule, useValue: {} },
		{ provide: MatDialogRef, useValue: {} }
	]
})
export class SharedModule {}
