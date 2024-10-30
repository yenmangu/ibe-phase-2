import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class HtmlPdfService {
	constructor() {}

	public handleOtherDevice(blob: Blob) {
		const blobUrl = window.URL.createObjectURL(blob);
		window.open(blobUrl);
	}

	public handleIos(blob: Blob, newTab: Window) {
		const reader = new FileReader();
		reader.onload = () => {
			newTab!.document.open();
			newTab!.document.write(reader.result as string);
			newTab!.document.close();
		};
		reader.readAsText(blob);
	}

	public handleDownload(blob: Blob, gameCode: string) {
		const blobUrl = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = blobUrl;
		// commented because we are not doing pdf any more
		// link.download = `${this.gameCode}.${fileType}`;
		link.download = `${gameCode}.html`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(link.href);
	}
}
