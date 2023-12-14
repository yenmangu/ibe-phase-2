import {
	OnInit,
	Component,
	Inject,
	ComponentRef,
	Output,
	Input,
	ViewChild,
	ViewContainerRef,
	EventEmitter
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
	selector: 'app-login-dialog',
	templateUrl: './login-dialog.component.html',
	styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
	@ViewChild('loginComponent', { read: ViewContainerRef })
	registerContainer: ViewContainerRef;
	@Input() title: string;
	@Output() dataEmitter: EventEmitter<any> = new EventEmitter<any>();

	authStatus: string = '';
	componentRef: ComponentRef<any>;
	constructor(
		public dialogRef: MatDialogRef<LoginDialogComponent>,
		private vcRef: ViewContainerRef,
		private authService: AuthService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		if (data && data.component) {
			const factory = this.vcRef.createComponent(data.component);
			this.componentRef = factory;
		}
	}

	ngOnInit(): void {
		this.authService.statusSubject$.subscribe(status => {
			this.authStatus = status;
		});
	}

	onLogin() {
		let credentials;
		this.authService.login(credentials).subscribe({
			next: response => {
        
      },
			error: error => {}
		});
	}
}
