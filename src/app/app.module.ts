import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';

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
		HomeModule
	],
	providers: [
		{ provide: MatDialogModule, useValue: {} },
		{ provide: MatDialogRef, useValue: {} }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
