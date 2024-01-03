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
	@ViewChild('fileInput') fileInput: ElementRef;
	@Output() upload = new EventEmitter<any>();
	@Output() signalUpload = new EventEmitter<boolean>();
	@Output() signalAgain = new EventEmitter<boolean>();
	@Output() selectedFilesChange = new EventEmitter<any[]>();
	selectedFiles: any[] = [];

	constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

	ngOnInit(): void {
		if (this.selectedFiles.length > 0) {
			console.log('files in the import export component: ', this.selectedFiles);
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
		const input = event.target as HTMLInputElement;
		if (input.files) {
			this.selectedFiles = Array.from(input.files);
			this.selectedFilesChange.emit(this.selectedFiles);
			
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
	}

	clearFiles() {
		this.selectedFiles = [];
	}
}
