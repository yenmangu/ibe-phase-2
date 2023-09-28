import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

// Components
import { AppComponent } from './app.component';
import { SidenavService } from './shared/services/sidenav.service';

// Custom Modules

import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		MaterialModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		SharedModule,
		HomeModule,
		ClarityModule
	],
	providers: [
		{ provide: MatDialogModule, useValue: {} },
		{ provide: MatDialogRef, useValue: {} },
		SidenavService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
