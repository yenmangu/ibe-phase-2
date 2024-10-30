import { Injectable } from '@angular/core';
import { DeviceColours } from 'src/app/shared/data/interfaces/query-object.ts';
import { UserAction } from 'src/app/shared/data/interfaces/user-action';
@Injectable({
	providedIn: 'root'
})
export class UserActionsTableControlService {
	testDevList: any = {
		'5ea6786d-3167-4b17-9173-c92a1b48e4fc': '#890f04',
		'afe83a54-68a0-4cb5-a31b-731131f1c6f8': '#018933',
		'B457D3B5-98F2-444F-AD05-68A102C11267': '#07918c',
		'22BADCFF-E91C-4BFB-8F03-A48BCAE6B269': '#980dc6',
		'06428aeb-a326-467c-b7d3-4a7682344b5f': '#530975',
		'03A0993F-41BF-4BC1-B17E-F0339CBF35A1': '#ce8d00'
	};

	constructor() {}

	public populateFilter(deviceList): string[] {
		return Object.keys(deviceList);
	}

	public filterResults(
		actionHistory: UserAction[],
		filterId: string = ''
	): UserAction[] {
		console.log('Total: ', actionHistory.length);
		if (!filterId) {
			console.log('No Filter Id');
			return actionHistory;
		} else {
			console.log('FilterId present: ', filterId);
			const matches = actionHistory.some(action => action.deviceId === filterId);
			if (matches) {
				const found = actionHistory.filter(action => action.deviceId === filterId);
				console.log(found.length, 'matches found with filterId: ', filterId);
				console.log('Found: ', found);
				return found;
			}
			return actionHistory;
		}
	}

	public getColours(deviceColours: DeviceColours, deviceId: string) {
		if (deviceColours[deviceId]) {
			return deviceColours[deviceId];
		} else {
			return '#000000';
		}
	}

	public testMethod(): void {
		console.log('Test Method: ', this.populateFilter(this.testDevList));
	}
}
