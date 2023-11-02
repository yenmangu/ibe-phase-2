import { Component } from '@angular/core';
import { ApiDataCoordinationService } from '../games/services/api/api-data-coordination.service';

@Component({
	selector: 'app-upload-download',
	templateUrl: './upload-download.component.html',
	styleUrls: ['./upload-download.component.scss']
})
export class UploadDownloadComponent {
	private apiDataCoordination: ApiDataCoordinationService;
	onChange(event): void {}

	onDrag(event): void {}

	getCurrent() {
   
  }
}
