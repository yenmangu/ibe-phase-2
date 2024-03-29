import {
	OnInit,
	OnDestroy,
	Component,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	ViewContainerRef,
	Inject,
	ComponentRef
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UploadFileComponent } from '../upload-file/upload-file.component';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {
	@ViewChild('registerComponent', { read: ViewContainerRef })
	registerContainer: ViewContainerRef;
	@ViewChild('uploadFileComponent') uploadFileComponent: UploadFileComponent;

	componentRef: ComponentRef<any>;

	@Input() title: string;
	@Output() confirm = new EventEmitter<void>();
	@Output() cancel = new EventEmitter<void>();
	@Output() dataEmitter: EventEmitter<any> = new EventEmitter<any>();

	files: any[] = [];
	constructor(
		public dialogRef: MatDialogRef<DialogComponent>,
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
		console.log('Data in dialog: ', this.data);
	}

	onConfirm(): void {
		this.confirm.emit();
		this.dialogRef.close();
	}

	emitSuccess(): void {
		this.dialogRef.close('success');
	}

	sendDataToComponent(data: any) {
		this.dataEmitter.emit(data);
	}

	onCancel(): void {
		if (this.componentRef) {
			this.componentRef.destroy();
		}
		this.cancel.emit();
		this.dialogRef.close();
	}

	ngOnDestroy(): void {}
}
