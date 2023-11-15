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
import { Observable, catchError, throwError } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameActionsHttpService } from 'src/app/shared/services/game-actions-http.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
	selector: 'app-usebio',
	templateUrl: './usebio.component.html',
	styleUrls: ['./usebio.component.scss']
})
export class UsebioComponent implements OnInit, AfterViewInit {
	@ViewChild('dragBox') dragBox: ElementRef;
	@ViewChild('fileInput') fileInput: ElementRef;
	@Output() uploadFiles = new EventEmitter<any>();
	@Output() signalUpload = new EventEmitter<boolean>();
	selectedFiles: any[] = [];
	private formData = new FormData();
	uploading: boolean = false;
	errorMessage: string = '';
	uploadSuccess: boolean | null = null;

	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2,
		private gameActionsHttp: GameActionsHttpService,
		private dialogRef: MatDialogRef<UsebioComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any
	) {}

	ngOnInit(): void {
		if (this.uploadSuccess !== null && this.uploading !== false) {
			this.uploadSuccess = null;
			this.uploading = false;
		}
	}

	ngAfterViewInit(): void {}

	customFileClick() {
		this.fileInput.nativeElement.click();
	}

	onUpload() {
		const formData = new FormData();
		const gameCode = this.dialogData.gameCode;
		this.selectedFiles.forEach(file => [formData.append('file', file, file.name)]);
		this.uploading = true;
		this.gameActionsHttp
			.importUSEBIO(formData, gameCode)
			.pipe(
				catchError(err => {
          this.uploadSuccess = false
          this.uploading = false
					const status = err.status;
					console.error('error status: ', status);
					this.errorMessage = err.statusText;
					return throwError(() => err);
				})
			)
			.subscribe(response => {
				console.log('result from bbo upload: ', response.result);
				if (response.result.success === true) {
					this.uploading = false;
					this.uploadSuccess = true;
				} else {
					console.log('response: ', response);
					this.errorMessage = response.result.errAttribute;
				}
				// if (response.status === 500) {
				// 	this.uploading = false;
				// 	this.uploadSuccess = false;
				// }
			});
	}

	closeDialog() {
		this.dialogRef.close();
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
}
