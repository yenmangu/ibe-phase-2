import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Material
import { MaterialModule } from '../material/material.module';
// Components
import { HomeComponent } from './home/home.component';

// Modules
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';

@NgModule({
	declarations: [HomeComponent],
	imports: [CommonModule, MaterialModule, SharedModule, AuthModule, RouterModule],
	exports: [HomeComponent]
})
export class HomeModule {}
