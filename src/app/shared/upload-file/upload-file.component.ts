import {
	Component,
	Input,
	OnInit,
	ElementRef,
	ViewChild,
	AfterViewInit,
	Output,
	EventEmitter,
	Inject
} from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-upload-file',
	templateUrl: './upload-file.component.html',
	styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit, AfterViewInit {
	@Input() data: any;
	@Input() fileType: any;
	@Input() isLoading: boolean = false;
	@Input() uploadSuccess: boolean = false;
	@ViewChild('dragBox') dragBox: ElementRef;
	@ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
	@Output() upload = new EventEmitter<any>();
	@Output() signalUpload = new EventEmitter<boolean>();
	@Output() signalAgain = new EventEmitter<boolean>();
	@Output() selectedFilesChange = new EventEmitter<File[]>();
	@Output() cancelSignal = new EventEmitter<boolean | null>();
	@Output() errorSignal = new EventEmitter<any>();
	selectedFiles: File[] = [];

	constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

	ngOnInit(): void {
		if (this.selectedFiles.length > 0) {
			console.log('files in the import export component: ', this.selectedFiles);
		}
		if (this.fileInput) {
			if (typeof this.fileType === 'string' && this.fileType === 'csv') {
				console.log('Setting file type attribute');

				this.renderer.setAttribute(
					this.fileInput.nativeElement,
					'accept',
					this.fileType
				);
			}
		}
	}

	ngAfterViewInit(): void {
		// this.trackSelectedFiles();
	}

	customFileClick() {
		this.fileInput.nativeElement.click();
	}

	onUpload() {
		console.log('onUpload invoked');
		this.emitFiles(this.selectedFiles);
		this.signalUpload.emit(true);
	}

	onUploadMore() {
		this.uploadSuccess = false;
		this.signalAgain.emit(true);
		this.selectedFiles = [];
	}

	onChange(event: Event) {
		// console.log(event);
		let fileErrObject: any = {};
		const failedFiles: File[] = [];
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const filesArray: File[] = Array.from(input.files);
			filesArray.forEach(file => {
				const fName = file.name;
				const fExtension = fName.slice(((fName.lastIndexOf('.') - 1) >>> 0) + 2);
				if (
					this.fileType &&
					typeof this.fileType === 'string' &&
					this.fileType !== fExtension
				) {
					failedFiles.push(file);
					fileErrObject.message = 'Wrong file type';
				} else {
					this.selectedFiles.push(file);
				}
			});
		} else {
			fileErrObject.message = 'No files detected';
			fileErrObject.files = [];
		}
		if (this.selectedFiles && this.selectedFiles.length > 0) {
			this.selectedFilesChange.emit(this.selectedFiles);
		} else {
			console.log('Error: ', fileErrObject);

			fileErrObject.files = failedFiles;
			this.errorSignal.emit(fileErrObject);
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

	private trackSelectedFiles() {
		this.selectedFilesChange.subscribe((newFiles: []) => {
			if (newFiles.length === 0) {
				this.renderer.removeClass(this.dragBox.nativeElement, 'drag-over');
			} else {
				this.renderer.addClass(this.dragBox.nativeElement, 'with-files');
			}
		});
	}

	private emitFiles(fileArray) {
		console.log('emitFiles invoked with: ', fileArray);

		this.upload.emit(fileArray);
		this.selectedFilesChange.emit(fileArray);
	}

	clearFiles() {
		this.selectedFiles = [];
		this.cancelSignal.emit(true);
	}
}
