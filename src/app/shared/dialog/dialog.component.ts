import { Dialog } from '@angular/cdk/dialog';
import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	ViewContainerRef,
	OnInit,
	Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { DialogService } from '../services/dialog.service';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
	@ViewChild('registerComponent', { read: ViewContainerRef })
	registerContainer: ViewContainerRef;

	@Input() title: string;
	@Output() confirm = new EventEmitter<void>();
	@Output() cancel = new EventEmitter<void>();
	constructor(
		public dialogRef: MatDialogRef<DialogComponent>,
		private dialog: MatDialog,
		private dialogService: DialogService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.

	}

	onConfirm(): void {
		this.confirm.emit();
		this.dialogRef.close();
	}

	emitSuccess(): void {
		this.dialogRef.close('success')
	}

	onCancel(): void {
		this.cancel.emit();
		this.dialogRef.close();
	}
}
