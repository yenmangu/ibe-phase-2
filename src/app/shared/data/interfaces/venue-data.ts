export interface Venue {
	key: string;
	value: {
		$: {
			type: string;
			n: string;
			adddate: string;
		};
		name: string | string[];
		lastplay: {
			$: {
				date: string;
			};
		}[];
	};
}

// Example

// {
//   "$": {
//       "type": "event",
//       "n": "26",
//       "adddate": "20/04/20"
//   },
//   "name": [
//       "Reform Monday Bridge Duplicate"
//   ],
//   "lastplay": [
//       {
//           "$": {
//               "date": "07/06/23"
//           }
//       }
//   ]
// },
