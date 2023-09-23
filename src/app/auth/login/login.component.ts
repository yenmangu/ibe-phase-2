import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;

	constructor(private fb: FormBuilder, private dialogService: DialogService) {
		// this.loginForm = this.fb.group({});
	}

	ngOnInit(): void {
		this.loginForm = this.fb.group({
			gameCode: ['', Validators.required],
			key: ['', Validators.required]
		});
	}

  

	onSubmit(): void {
		console.log('Submit Button Clicked');
	}

	openRegistrationSuccessDialog() {
		const dialogRef = this.dialogService.openDialog('registrationSuccess');
		dialogRef.afterClosed().subscribe(result => {
			if (result === 'success') {
				// handle success
			}
		});
	}
}
