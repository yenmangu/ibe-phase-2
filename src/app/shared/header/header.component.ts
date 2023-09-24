import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	constructor(private authService: AuthService) {}

	isLoggedIn(): boolean {
		return this.authService.authStatus;
	}

	forgotPassword(): void {
		console.log('Forgot password clicked');
	}
}
