import { Component } from '@angular/core';
import { WebhookService } from '../services/webhook.service';

@Component({
	selector: 'app-lin-extraction',
	templateUrl: './lin-extraction.component.html',
	styleUrls: ['./lin-extraction.component.scss']
})
export class LinExtractionComponent {
	linString: string = '';
	constructor(private webhook: WebhookService) {}

	triggerSheetWebhook() {
		if (this.linString) {
			this.webhook.sendWebhookRequest(this.linString).subscribe({
				next: response => {},
				error: error => {}
			});
		}
	}
}
