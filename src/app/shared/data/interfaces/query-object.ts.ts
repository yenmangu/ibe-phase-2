import { UserActions } from './user-action';

export interface QueryObject {
	actionHistory: UserActions;
	dateRange: string;
	deviceColours: DeviceColours;
	deviceHistory: DeviceHistoryArray;
	historyArray: HistoyArray;
	metaData: Meta;
}

export interface DeviceColour {
	[key: string]: string;
}
export type DeviceColours = DeviceColour[];

export interface DeviceHistory {
	[key: string]: string[];
}

export interface DeviceHistoryItem {
	uuid: string;
	data: string[];
}
export type DeviceHistoryArray = DeviceHistoryItem[];

export interface HistoryItem {
	id: string;
	actions: string[];
}

export type HistoyArray = HistoryItem[];

export interface Meta {
	cursecs: string;
	firstsecs: string;
	sf: string;
}
