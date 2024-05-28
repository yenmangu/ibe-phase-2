const movementonly = [
	'1,5,1,1,7,2,1,9,3,1,11,4,1,13,5,1,15,6,1,2,7,1,4,8,1,6,9,1,8,10,1,10,11,1,12,12',
	'2,6,2,2,8,3,2,10,4,2,12,5,2,14,6,2,1,7,2,3,8,2,5,9,2,7,10,2,9,11,2,11,12,2,13,13',
	'3,7,3,3,9,4,3,11,5,3,13,6,3,15,7,3,2,8,3,4,9,3,6,10,3,8,11,3,10,12,3,12,13,3,14,14',
	'4,8,4,4,10,5,4,12,6,4,14,7,4,1,8,4,3,9,4,5,10,4,7,11,4,9,12,4,11,13,4,13,14,4,15,15',
	'5,9,5,5,11,6,5,13,7,5,15,8,5,2,9,5,4,10,5,6,11,5,8,12,5,10,13,5,12,14,5,14,15,5,1,1',
	'6,10,6,6,12,7,6,14,8,6,1,9,6,3,10,6,5,11,6,7,12,6,9,13,6,11,14,6,13,15,6,15,1,6,2,2',
	'7,11,7,7,13,8,7,15,9,7,2,10,7,4,11,7,6,12,7,8,13,7,10,14,7,12,15,7,14,1,7,1,2,7,3,3',
	'8,12,8,8,14,9,8,1,10,8,3,11,8,5,12,8,7,13,8,9,14,8,11,15,8,13,1,8,15,2,8,2,3,8,4,4',
	'9,13,9,9,15,10,9,2,11,9,4,12,9,6,13,9,8,14,9,10,15,9,12,1,9,14,2,9,1,3,9,3,4,9,5,5',
	'10,14,10,10,1,11,10,3,12,10,5,13,10,7,14,10,9,15,10,11,1,10,13,2,10,15,3,10,2,4,10,4,5,10,6,6',
	'11,15,11,11,2,12,11,4,13,11,6,14,11,8,15,11,10,1,11,12,2,11,14,3,11,1,4,11,3,5,11,5,6,11,7,7',
	'12,1,12,12,3,13,12,5,14,12,7,15,12,9,1,12,11,2,12,13,3,12,15,4,12,2,5,12,4,6,12,6,7,12,8,8',
	'13,2,13,13,4,14,13,6,15,13,8,1,13,10,2,13,12,3,13,14,4,13,1,5,13,3,6,13,5,7,13,7,8,13,9,9',
	'14,3,14,14,5,15,14,7,1,14,9,2,14,11,3,14,13,4,14,15,5,14,2,6,14,4,7,14,6,8,14,8,9,14,10,10',
	'15,4,15,15,6,1,15,8,2,15,10,3,15,12,4,15,14,5,15,1,6,15,3,7,15,5,8,15,7,9,15,9,10,15,11,11'
];

const totalTables = 12;

function determineTeamsInPlay(movementonly, totalTables) {
	let startingTeams = [];
	let vsTeams = [];
	movementonly.forEach((line, index) => {
		startingTeams.push(line.split(',')[0]);
		vsTeams.push(line.split(',')[1]);
	});

	if ((startingTeams.length + vsTeams.length) / 2 === totalTables) {
		return { startingTeams };
	} else {
		console.log(false);
		startingTeams.sort((a, b) => a - b);

		const teamsInPlay = startingTeams.slice(0, totalTables);
		const extras = startingTeams.slice(totalTables, startingTeams.length);
		return { startingTeams, extraTeams: extras };
	}
}

const {} = determineTeamsInPlay(movementonly, totalTables);
console.log('Starting Teams from function: ', startingTeams);

function compareNumbers(a, b) {
	return a - b;
}

function getPeople() {
	const people = [
		"Bill Loughlin & Rachel Oliver\nMike McGarry & Monica Scott\nJudy Clowes & Michele Davies\nSue Yardley & Pam Booth-Jones\nZena Hargest & Janet Owen\nTess Szymanska & Sue Jarvis\nJanet Beach & Marion Mitchell\nHylary Kingham & Betty O'Donnell\nAnthony Cadley & Jill Cadley\nSue Munday & Pat Jenkins\nChris Reynolds & Tony Pummell\nPhil Inch & Lesley Chew\nPat Arthur & Myra Smith\nDot Kirby & Jeff Kirby\nYvonne Wright & Michael Wright\nNicky Gill & Maire Noble\nJanet Almond & Kay Pierce\nCarole Pollock & Joanna Gears\nAnnie Paul & Rita Simmons\nKaren Seaman & Gary Seaman\nSue Ratcliffe & Anne Smout\nNikki Barclay & Nicola Haywood\nJenny Rogers & Elizabeth Redrup\nTony Jones & Izabel Evans\nPat Tait & Barbara Lawton\nGraham Roberts & Alec Beer\nMarjorie Deans & Shirley Radford\nJudy Mitchell & Margaret Bridge\nJohanna Keane & Jan Bywater\nEunice King & Joan Eastwood\n"
	];

	return people.split('\n');
}

module.exports = { getPeople };
