export interface BoardsScoringInterface {
	eventType: string;
	defaultSelected?: boolean;
	preferedDuration: { value: string; display: string }[];
	scoringMethods: {value: string; display: string}[]
}
