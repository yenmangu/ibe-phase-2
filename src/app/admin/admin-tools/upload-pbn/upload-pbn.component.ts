import { HttpResponse } from '@angular/common/http';
import {
	Component,
	Input,
	OnInit,
	ElementRef,
	TemplateRef,
	ViewChild,
	AfterViewInit,
	Output,
	EventEmitter
} from '@angular/core';
import { Renderer2 } from '@angular/core';
import { AdminToolsService } from 'src/app/shared/services/admin-tools.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ResponseData } from 'src/app/shared/services/admin-tools.service';

@Component({
	selector: 'app-upload-pbn',
	templateUrl: './upload-pbn.component.html',
	styleUrls: ['./upload-pbn.component.scss']
})
export class UploadPbnComponent implements OnInit {
	@ViewChild('dragBox') dragBox: ElementRef;
	@ViewChild('fileInput') fileInput: ElementRef;
	@ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
	selectedFiles: any[] = [];
	filename: string;
	success: boolean | null = null;

	constructor(
		private renderer: Renderer2,
		private adminToolsService: AdminToolsService,
		private snackbar: MatSnackBar
	) {}

	ngOnInit(): void {}

	// customFileClick() {
	// 	this.clearFiles();
	// 	this.fileInput.nativeElement.click();
	// }

	onChange(event: Event) {
		// console.log(event);
		const input = event.target as HTMLInputElement;
		if (input.files) {
			console.log('Selected Files from onChange (input.files[]): ', input.files);

			this.selectedFiles = Array.from(input.files);
			console.log('this selected file (input.files[0])', this.selectedFiles);
		}
	}

	onDragOver(event: DragEvent) {
		// console.log(event);
		event.preventDefault();

		this.renderer.addClass(this.dragBox.nativeElement, 'drag-over');
		// console.log('drag over');
	}
	onDragLeave(event: DragEvent) {
		this.renderer.removeClass(this.dragBox.nativeElement, 'drag-over');
		// console.log('drag leave');
	}

	onDrop(event: DragEvent): void {
		event.preventDefault();
		this.renderer.removeClass(this.dragBox.nativeElement, 'drag-over');
		if (event.dataTransfer.files) {
			this.selectedFiles = Array.from(event.dataTransfer.files);
		}
	}

	clearFiles() {
		this.selectedFiles.length = 0;
		if (this.snackbar) {
			this.snackbar.dismiss();
		}
	}

	onUpload() {
		if (this.selectedFiles) {
			this.success = false;
			const pbnFile = this.selectedFiles[0];
			console.log('Selected File from onUpload: ', pbnFile);
			const formData = new FormData();
			formData.append('file', pbnFile);

			this.adminToolsService.uploadPbn(formData).subscribe({
				next: (response: ResponseData) => {
					if (response) {
						console.log('Mapped response: ', response);

						const filename = response.headers.get('x-filename');
						const blob = new Blob([response.blob], {
							type: 'application/octet-stream'
						});
						const blobUrl = window.URL.createObjectURL(blob);
						const link = document.createElement('a');
						link.href = blobUrl;
						link.download = filename;
						document.body.appendChild(link);
						link.click();
						window.URL.revokeObjectURL(blobUrl);
						document.body.removeChild(link);
						this.clearFiles();
						this.success = true;
					}
				},
				error: error => {
					this.snackbar.openFromTemplate(this.errorTemplate);
				}
			});
		}
	}

	dismiss() {
		this.snackbar.dismiss();
	}

	dismissSuccess() {
		this.success = null;
	}
}
