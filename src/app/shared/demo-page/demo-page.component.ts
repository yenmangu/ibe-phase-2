import { Component } from '@angular/core';
import { CsvService } from '../services/csv.service';

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

	uploadedHeaders: any[] = [];
	selectedMapping: any[] = [];

	constructor(private csvService: CsvService) {}

	onFileListChange(files: any[]) {
		this.selectedFiles = files;
		console.log('File list: ', this.selectedFiles);
	}

	receiveFile(eventData: boolean) {
		this.readyForMapping = eventData;
		this.fileToMap = this.selectedFiles[0];
		console.log(this.readyForMapping);
	}

	simulateFile() {
		this.csvService.getDevCsvData().subscribe({
			next: async data => {
				try {
					const headers = await this.csvService.extractHeaders(data);
					console.log('headers: ', headers);
					if (headers.length > 0) {
						this.uploadedHeaders = headers;
						this.readyForMapping = true;
					} else {
						this.readyForMapping = false;
					}
				} catch (error) {}
			},
			error: error => {
				console.error('error: ', error);
			}
		});
	}

	handleUploadedHeaders(headers: any) {}

	handleImport(mapping: any) {
		console.log(
			'Event Emitter triggered the handleImport method in demo page component with: ',
			mapping
		);

		if (Object.keys(mapping).length > 0) {
			this.selectedMapping = mapping;
			console.log('selected mapping: ', this.selectedMapping);
		}
	}
}
