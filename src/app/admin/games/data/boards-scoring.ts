export interface BoardsScoringInterface {
	eventType: string;
	defaultSelected?: boolean;
	preferredDuration: { value: string; display: string }[];
	scoringMethods: {value: string; display: string}[]
}
