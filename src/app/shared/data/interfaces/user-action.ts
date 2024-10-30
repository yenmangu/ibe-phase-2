export interface UserAction {
	deviceId: string;
	gameCode: {
		name: string;
		gameCode: string;
	};
	timeMeta: {
		name: string;
		epoch: number;
		fullDate: Date;
	};
	uNumber: {
		name: string;
		number: string;
	};
	uType: {
		name: string;
		unitType: string;
	};
	command: {
		name: string;
		command: string;
	};
	details: {
		name: string;
		details: string;
	};
	AI: {
		name: string;
		AI: string;
	};
	SE: {
		name: string;
		SE: string;
	};
	unknownProp_5?: any;
}
export type UserActions = UserAction[];
