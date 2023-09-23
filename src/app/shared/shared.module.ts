import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
// import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialModule } from '../material/material.module';


// Components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DialogComponent } from './dialog/dialog.component';

// Modules

@NgModule({
	declarations: [HeaderComponent, FooterComponent, DialogComponent],
	imports: [CommonModule,  MaterialModule],
	exports: [HeaderComponent, FooterComponent]
})
export class SharedModule {}
