import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { AuthService } from '../services/auth.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private dialogService: DialogService,
		private authService: AuthService,
		private sharedDataService: SharedDataService
	) {}

	ngOnInit(): void {
		this.loginForm = this.fb.group({
			gameCode: ['', Validators.required],
			key: ['', Validators.required]
		});
	}

	onSubmit(): void {
		// const formData = { ...this.loginForm.value };
		const formData = {
			type: 'slot',
			username: this.loginForm.get('gameCode').value,
			password: this.loginForm.get('key').value
		};
		formData.type = 'slot';
		console.log('formData : ', formData);
		console.log('Submit Button Clicked');
		this.authService.login(formData).subscribe({
			next: response => {
				console.log('response from authService: ', response);
				this.sharedDataService.updateUserData(
					response.directorSlot,
					response.directorEmail
				);
				this.router.navigate(['/admin'])
				this.dialogService.closeDialog();
			}
		});
	}

	openRegistrationSuccessDialog() {
		return this.dialogService.openDialog('registrationSuccess');
	}
}
