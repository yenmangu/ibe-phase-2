import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	isAuthenticated: boolean = false;
	constructor(
		private authService: AuthService,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.authService.isAuthedSubject$.subscribe(authStatus => {
			this.isAuthenticated = authStatus;
		});
	}

	isLoggedIn(): boolean {
		return this.isAuthenticated;
	}

	// openDialog(type: string) : void {}

	openDialog(type: string) {
		const dialogRef = this.dialogService.openDialog('loginRegisterDialog');
		if (type === 'login') {
			// login
			dialogRef.componentInstance.data = {
				message: 'Please Log In Below',
				gameCode: '',
				loginForm: LoginComponent
			};
		}
		if (type === 'register') {
			// register
			dialogRef.componentInstance.data = {
				title: 'Register',
				message: 'Please Register Below',
				gameCode: '',
				registerForm: RegisterComponent
			};
			dialogRef.afterClosed().subscribe(result => {
				console.log('dialog result: ', result);
			});
		}
	}
}
