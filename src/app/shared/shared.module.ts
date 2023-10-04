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
  VenueTableDialogComponent
	],
	imports: [CommonModule, MaterialModule, FormsModule],
	exports: [HeaderComponent, FooterComponent]
})
export class SharedModule {}
