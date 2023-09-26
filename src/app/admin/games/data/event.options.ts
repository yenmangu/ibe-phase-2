export interface EventDetailModel {
	option: string;
	value: string;
	data: any;
}

export const EventDetails: EventDetailModel[] = [
	{ option: 'Venues', value: 'venues', data: '' },
	{ option: 'Stratification', value: 'strat', data: '' },
	{ option: 'Sitters', value: 'sitters', data: '' },
	{ option: 'Adjustments', value: 'adjust', data: '' },
	{ option: 'Handicaps', value: 'handicap', data: '' },
	{ option: 'Labels', value: 'labels', data: '' },
	{ option: 'Abbreviations', value: 'abbrev', data: '' },
	{ option: 'Board Colours', value: 'boardCol', data: '' },
	{ option: 'Times + Lunch', value: 'timesLunch', data: '' }
];
