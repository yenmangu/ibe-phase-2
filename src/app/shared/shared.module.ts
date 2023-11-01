import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Material
// import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from '../material/material.module';

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
		DownloadFileComponent
	],
	imports: [CommonModule, MaterialModule, FormsModule],
	exports: [
		HeaderComponent,
		FooterComponent,
		UploadFileComponent,
		DownloadFileComponent,
		UserDetailsComponent
	]
})
export class SharedModule {}
