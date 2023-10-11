import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Components/ Interceptors
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
// import { DialogComponent } from '../shared/dialog/dialog.component';

// Modules
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent],
	imports: [
		CommonModule,
		MaterialModule,
		HttpClientModule,
		ReactiveFormsModule,
		SharedModule
	],
	exports: [LoginComponent, RegisterComponent, ForgotPasswordComponent],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
	]
})
export class AuthModule {}
