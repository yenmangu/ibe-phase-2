import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

// Components
import { AppComponent } from './app.component';
import { SidenavService } from './shared/services/sidenav.service';

// Custom Modules

import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { StoreModule } from '@ngrx/store';

// Pipes
// import { KeysPipe } from './shared/pipes/keys.pipe';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		MaterialModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		ScrollingModule,
		SharedModule,
		HomeModule,
		ClarityModule,
		StoreModule.forRoot({}, {})
	],
	providers: [
		{ provide: MatDialogModule, useValue: {} },
		{ provide: MatDialogRef, useValue: {} },
		SidenavService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
