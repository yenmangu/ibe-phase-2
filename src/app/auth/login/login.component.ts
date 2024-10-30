import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { AuthService } from '../services/auth.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
	loginForm: FormGroup;
	hide = true;
	hidePassword: boolean = true;
	loginClicked: boolean = false;

	private statusSubscription: Subscription;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private dialogService: DialogService,
		private authService: AuthService,
		private sharedDataService: SharedDataService,
		private userDetailsService: UserDetailsService,
		private IDBStatus: IndexedDatabaseStatusService
	) {}

	ngOnInit(): void {
		this.loginClicked = false;
		this.loginForm = this.fb.group({
			gameCode: ['', Validators.required],
			key: ['', Validators.required]
		});
	}

	onSubmit(): void {
		// const formData = { ...this.loginForm.value };
		setTimeout(() => {
			this.loginClicked = true;
		}, 50);
		const gameCode = this.loginForm.get('gameCode').value;
		const dirKey = this.loginForm.get('key').value;
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
				if (response === false) {
					console.log('in "response === false" path');
					this.loginClicked = false;
					this.handleLoginFailure();
				} else if (response) {
					this.handleResponse(response, gameCode, dirKey);
					this.dialogService.closeAllDialogs();
					this.IDBStatus.resetProgress();
					this.router.navigate(['/admin']);
				}
			},
			error: error => {
				console.error('Error: ', error);
			}
		});
	}

	private handleResponse(response, gameCode, dirKey) {
		this.setStorage(response, gameCode, dirKey);
		this.updateDetails(response, gameCode, dirKey);
	}

	private handleLoginFailure() {
		this.statusSubscription = this.authService.statusSubject$.subscribe(status => {
			this.dialogService.closeAllDialogs(); // close any open dialogs
			console.log('Status before conditional branches: ', status);
			if (!status) {
				console.log('No status from login');

				this.dialogService.newOpenDialog('generalFail');
				console.log('General Fail');
			} else if (status === 'NO_USER') {
				console.log('No User');

				this.dialogService.newOpenDialog('userFail');
			} else if (status === 'PASS_ERROR') {
				console.log('Pass error');

				this.dialogService.newOpenDialog('passFail');
			}
		});
	}

	private setStorage(response, gameCode, dirKey): void {
		localStorage.setItem('LOGGED_IN', 'true');
		localStorage.setItem('GAME_CODE', gameCode);
		localStorage.setItem('DIR_KEY', dirKey);
		localStorage.setItem('EMAIL', response.directorEmail);
	}

	private updateDetails(response, gameCode, dirKey): void {
		this.userDetailsService.updateEmail(response.directorEmail);
		this.userDetailsService.updateGameCode(gameCode);
		this.userDetailsService.updateDirectorKey(dirKey);
		this.userDetailsService.updateLoggedIn(true);
	}

	openFailDialog() {}

	openRegistrationSuccessDialog() {
		return this.dialogService.newOpenDialog('registrationSuccess');
	}

	toggleVisibility() {
		this.hidePassword = !this.hidePassword;
	}

	ngOnDestroy(): void {
		this.loginClicked = false;
		if (this.statusSubscription) {
			this.statusSubscription.unsubscribe();
		}
	}
}
