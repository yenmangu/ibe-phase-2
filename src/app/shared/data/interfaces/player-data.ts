export interface Player {
	$: {
		type: string;
		n: string;
		adddate: string;
	};
	name: string[];
	email: string[];
	telephone: string[];
	id?: {
		$: {
			type: string;
			code: string;
		};
	}[];
	lastplay?: {
		$: {
			date: string;
		};
	}[];
	pp?: {
		$: {
			n: string;
		};
	}[];
}
