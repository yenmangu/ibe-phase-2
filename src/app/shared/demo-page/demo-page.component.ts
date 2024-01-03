import { Component } from '@angular/core';

@Component({
	selector: 'app-demo-page',
	templateUrl: './demo-page.component.html',
	styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent {
	selectedFiles: any[] = [];
	uploaded: boolean = false;
	fileToMap: any | null = null;
	readyForMapping: boolean = true;

	onFileListChange(files: any[]) {
		this.selectedFiles = files;
		console.log('File list: ', this.selectedFiles);
	}

	receiveFile(eventData: boolean) {
		this.readyForMapping = eventData;
		this.fileToMap = this.selectedFiles[0];
		console.log(this.readyForMapping);
	}
}
