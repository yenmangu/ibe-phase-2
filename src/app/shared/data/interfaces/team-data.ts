export interface Team {
	$: {
		type: string;
		n: string;
		adddate: string;
	};
	name: string[];
	lastplay: {
		$: {
			date: string;
		};
	}[];
}

// Example

// {
// 	"$": {
// 			"type": "team",
// 			"n": "1",
// 			"adddate": "14/04/19"
// 	},
// 	"name": [
// 			"Chanel"
// 	],
// 	"lastplay": [
// 			{
// 					"$": {
// 							"date": "21/01/23"
// 					}
// 			}
// 	]
// },