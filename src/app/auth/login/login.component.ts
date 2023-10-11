import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { AuthService } from '../services/auth.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { IndexedDatabaseStatusService } from 'src/app/shared/services/indexed-database-status.service';
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
		private sharedDataService: SharedDataService,
		private userDetailsService: UserDetailsService,
		private IDBStatus: IndexedDatabaseStatusService
	) {}

	ngOnInit(): void {
		this.loginForm = this.fb.group({
			gameCode: ['', Validators.required],
			key: ['', Validators.required]
		});
	}

	onSubmit(): void {
		// const formData = { ...this.loginForm.value };
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
				console.log('response from authService: ', response);
				// this.sharedDataService.updateUserData(
				// 	response.directorSlot,
				// 	dirKey,
				// 	response.directorEmail
				// );
				this.userDetailsService.updateEmail(response.directorEmail);
				this.userDetailsService.updateGameCode(gameCode);
				this.userDetailsService.updateDirectorKey(dirKey);
				this.userDetailsService.updateLoggedIn(true);
				localStorage.setItem('LOGGED_IN', 'true');
				localStorage.setItem('GAME_CODE', gameCode);
				localStorage.setItem('DIR_KEY', dirKey);
				localStorage.setItem('EMAIL', response.directorEmail);
				this.IDBStatus.resetProgress();
				this.router.navigate(['/admin']);
				this.dialogService.closeDialog();
			}
		});
	}

	openRegistrationSuccessDialog() {
		return this.dialogService.openDialog('registrationSuccess');
	}
}

// this.sharedDataService.emailSubject.next(response.directorEmail);
// this.sharedDataService.gameCodeSubject.next(gameCode);
// this.sharedDataService.dirKeySubject.next(dirKey);
