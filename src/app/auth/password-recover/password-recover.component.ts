import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
	selector: 'app-password-recover',
	templateUrl: './password-recover.component.html',
	styleUrls: ['./password-recover.component.scss']
})
export class PasswordRecoverComponent {
	applyMagentaGreyTheme = true;
	email: string;
	directorKeyForm: FormGroup;
	success: boolean = false;
	responseFail: boolean = false;
	responseMessage: string = '';
	constructor(
		private fb: FormBuilder,
		private httpService: HttpService,
		private dialogService: DialogService
	) {
		this.directorKeyForm = this.fb.group({
			gameCode: ['', [Validators.required]],
			emailField: ['', [Validators.required, Validators.email]]
		});
	}

	onSubmit(): void {
    if (this.directorKeyForm.valid) {
      const formData = this.directorKeyForm.value;
      console.log('form: ', formData);
			const originalForm = { ...formData };
			this.httpService.requestPassword(formData).subscribe({
				next: response => {
					if (response.success) {
						this.success = true;
					} else {
						this.responseMessage = response.message;
						this.responseFail = true;
					}
				},
				error: error => {
					console.error('Error requesting new director key: ', error);
					this.directorKeyForm.setValue(originalForm);
				}
			});
		}
	}
  onClose(){
    this.dialogService.closeDialog()
  }
}
