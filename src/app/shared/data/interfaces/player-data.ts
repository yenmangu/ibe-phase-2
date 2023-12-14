export interface Player {
	key: string;
	value: {
		$: {
			type: string;
			n: string;
			adddate: string;
		};
		name: string[] | string;
		email?: string[] | string;
		phone?: string[] | string;
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
	};
}
// // Example

// {
// 	"$": {
// 			"type": "player",
// 			"n": "3074",
// 			"adddate": "20/04/20"
// 	},
// 	"name": [
// 			"\n          Hilary Hugh Jones\n        "
// 	],
// 	"id": [
// 			{
// 					"$": {
// 							"type": "BBO",
// 							"code": "semley1"
// 					}
// 			}
// 	],
// 	"lastplay": [
// 			{
// 					"$": {
// 							"date": "10/03/20"
// 					}
// 			}
// 	],
// 	"pp": [
// 			{
// 					"$": {
// 							"n": "3073"
// 					}
// 			}
// 	]
// },

// //  Multiple ID Codes

// {
// 	"$": {
// 		"type": "player",
// 		"n": "3022",
// 		"adddate": "20/04/20"
// 	},
// 	"name": [
// 		"\n          Kiki Greenwood\n        "
// 	],
// 	"id": [
// 		{
// 			"$": {
// 				"type": "BBO",
// 				"code": "kgwood"
// 			}
// 		},
// 		{
// 			"$": {
// 				"type": "EBU",
// 				"code": "00466210"
// 			}
// 		}
// 	]
// },
