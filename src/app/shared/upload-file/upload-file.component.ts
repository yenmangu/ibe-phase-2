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
	@Input() data: any
	@Input() fileType: any
	@ViewChild('dragBox') dragBox: ElementRef;
	@ViewChild('fileInput') fileInput: ElementRef;
	@Output() upload = new EventEmitter<any>();
	@Output() signalUpload = new EventEmitter<boolean>();
	selectedFiles: any[] = [];

	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2,

	) {}

	ngOnInit(): void {}

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

	onChange(event: Event) {
		// console.log(event);
		const input = event.target as HTMLInputElement;
		if (input.files) {
			this.selectedFiles = Array.from(input.files);
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

	private get selectedFilesChange() {
		return new Observable(observer => {
			Object.defineProperty(this, 'selectedFiles', {
				get: () => this.selectedFiles,
				set: value => {
					this.selectedFiles = value;
					observer.next(value);
				}
			});
		});
	}

	private emitFiles(fileArray) {
		console.log('emitFiles invoked with: ', fileArray);

		this.upload.emit(fileArray);
	}
}
