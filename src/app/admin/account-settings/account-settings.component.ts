import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
	ValidationErrors,
	ValidatorFn
} from '@angular/forms';
import { Subject, takeUntil, pipe, take } from 'rxjs';
import { tag } from 'rxjs-spy/cjs/operators';
import { BreakpointService } from 'src/app/shared/services/breakpoint.service';
import { ApiDataCoordinationService } from '../games/services/api/api-data-coordination.service';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { AuthService } from 'src/app/auth/services/auth.service';

function keyMatchValidator(): ValidatorFn {
	return (group: FormGroup): ValidationErrors | null => {
		const newKey = group.get('newKey').value;
		const confirmKey = group.get('confirmKey').value;

		if (confirmKey !== newKey) {
			return { keyMismatch: true };
		} else {
			return null;
		}
	};
}

@Component({
	selector: 'app-account-settings',
	templateUrl: './account-settings.component.html',
	styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
	emailForm: FormGroup;
	directorKeyForm: FormGroup;
	currentBreakpoint: string;
	destroy$: Subject<void> = new Subject<void>();
	gameCode: string;
	directorKey: string;

	successMessage: boolean;
	emailClicked: boolean = false;
	updateDirectorKeyClicked: boolean = false;

	constructor(
		private fb: FormBuilder,
		private breakpointService: BreakpointService,
		private apiData: ApiDataCoordinationService,
		private userDetails: UserDetailsService,
		private dialogService: DialogService,
		private authService: AuthService
	) {
		this.emailForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]]
		});
		this.directorKeyForm = this.fb.group(
			{
				newKey: ['', [Validators.required, Validators.minLength(4)]],
				confirmKey: ['', [Validators.required, Validators.minLength(4)]]
			},
			{ validators: keyMatchValidator() }
		);
	}
	ngOnInit(): void {
		this.breakpointService.currentBreakpoint$
			.pipe(takeUntil(this.destroy$))
			.subscribe(bp => {
				this.currentBreakpoint = bp;
			});
		this.userDetails.gameCode$
			.pipe(takeUntil(this.destroy$))
			.subscribe(gameCode => (this.gameCode = gameCode));
		this.userDetails.directorKey$
			.pipe(takeUntil(this.destroy$))
			.subscribe(key => (this.directorKey = key));
	}
	getEmail() {
		const formData = this.emailForm.value;
		const data = {
			email: formData.email
		};
		const { email } = data;
		return this.apiData
			.changeEmail(data)
			.pipe(tag('email-response'))
			.subscribe({
				next: response => {
					if (response.success && response.updated) {
						this.successMessage = true;
						this.dialogService
							.openDialog(
								'emailUpdateSuccess',
								undefined,
								email,
								undefined,
								undefined
							)
							.afterClosed()
							.subscribe(response => {
								if (response) {
									this.emailForm.reset();
								}
							});
					}
				},
				error: error => {
					const originalData = { ...this.emailForm.value };
					this.dialogService
						.openDialog('errorUpdatingEmail', error, email, undefined, originalData)
						.afterClosed()
						.subscribe(() => {
							this.emailForm.setValue(originalData);
						});
				}
			});
	}

	getNewDirectorKey() {
		const formData = this.directorKeyForm.value;
		const data = {
			gameCode: this.gameCode,
			currentKey: this.directorKey,
			newKey: formData.newKey
		};
		const { newKey } = data;

		return this.apiData
			.updatePassword(data)
			.pipe(tag('password-response'))
			.subscribe({
				next: response => {
					console.log('repsonse data: ', response);
					if (response.success && response.updated) {
						this.successMessage = true;
						this.dialogService
							.openDialog(
								'keyUpdateSuccess',
								undefined,
								undefined,
								newKey,
								undefined
							)
							.afterClosed()
							.subscribe(result => {
								if (result) {
									this.directorKeyForm.reset();
									const details = { newKey };
									this.authService.updateUserDetails(details);
								}
							});
					}
				},
				error: error => {
					const originalData = { ...this.directorKeyForm.value };
					this.dialogService
						.openDialog('errorUpdatingKey', error, undefined, newKey, originalData)
						.afterClosed()
						.subscribe(() => {
							this.directorKeyForm.setValue(originalData);
						});
				}
			});
	}

	onTabChange(event: MatTabChangeEvent) {}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
