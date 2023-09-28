export interface EventDetailModel {
	option: string;
	value: string;
	data: any;
}

export const EventDetails: EventDetailModel[] = [
	{ option: 'Venues', value: 'venues', data: '' },
	{ option: 'Stratification', value: 'stratification', data: '' },
	{ option: 'Sitters', value: 'sitters', data: '' },
	{ option: 'Adjustments', value: 'adjustments', data: '' },
	{ option: 'Handicaps', value: 'handicaps', data: '' },
	{ option: 'Labels', value: 'labels', data: '' },
	{ option: 'Abbreviations', value: 'abbrev', data: '' },
	{ option: 'Board Colours', value: 'boardCol', data: '' },
	{ option: 'Times + Lunch', value: 'timesLunch', data: '' }
];
