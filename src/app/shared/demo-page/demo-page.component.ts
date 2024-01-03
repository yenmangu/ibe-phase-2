import { Component } from '@angular/core';

@Component({
	selector: 'app-demo-page',
	templateUrl: './demo-page.component.html',
	styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent {
	selectedFiles: any[] = [];

	onFileListChange(files: any[]) {
		this.selectedFiles = files;
		console.log('File list: ', this.selectedFiles);
	}
}
