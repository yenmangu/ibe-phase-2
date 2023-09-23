import { Component } from '@angular/core';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	constructor(
		private authService: AuthService,
		private dialogService: DialogService
	) {}

	isLoggedIn(): boolean {
		return this.authService.authStatus;
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
				console.log(result);
			});
		}
	}
}
