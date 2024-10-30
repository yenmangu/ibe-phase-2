import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DeviceService {
	constructor() {}

	public isIos(): boolean {
		return /iPad|iPhone|iPod|Macintosh|Mac/.test(navigator.userAgent);
	}
}
