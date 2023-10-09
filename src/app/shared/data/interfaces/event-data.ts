export interface EventInterface {
	$: {
		type: string;
		n: string;
		adddate: string;
	};
	name: string[];
	lastplay?: {
		$: {
			date: string;
		};
	}[];
}

// Example //

// {
// 	"$": {
// 			"type": "event",
// 			"n": "23",
// 			"adddate": "15/02/20"
// 	},
// 	"name": [
// 			"Purley Championship Pairs"
// 	],
// 	"lastplay": [
// 			{
// 					"$": {
// 							"date": "07/06/23"
// 					}
// 			}
// 	]
// },
