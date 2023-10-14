import { BoardsScoringInterface } from '../boards-scoring';



// Scoring methods
const mp = {value: 'mp', display: 'Match Points'}
const ximp = {value: 'ximp', display: 'Cross IMPs'}
const ag = {value: 'ag', display: 'Aggregate'}
const bimp = {value: 'bimp', display: 'Butler IMPs'}
const imp = {value: 'imp', display: 'IMPs'}
const vpimp = {value: 'vpimp', display: 'IMPs ⇀ VPs'}
const mzp = {value: 'mzp', display: 'Point-a-board: -1 0 1'}
const ozt = {value: 'ozt', display: 'Point-a-board: 0 1 3'}
const pch = {value: 'pch', display: 'Pachabo'}
const ati = {value: 'ati', display: 'Add then IMP'}
const tol = {value: 'tol', display: 'Tollemache'}
const vpmp = {value: 'vpmp', display: 'Match Points ⇀ VPs'}


const normalDuration: any[] = [
	{ value: '8x12', display: '8-12 Boards' },
	{ value: '13x16', display: '13-16 Boards' },
	{ value: '15x18', display: '15-18 Boards' },
	{ value: '16x20', display: '16-20 Boards' },
	{ value: '18x21', display: '18-21 Boards' },
	{ value: '20x22', display: '20-22 Boards' },
	{ value: '22x25', display: '22-25 Boards' },
	{ value: '24x26', display: '24-26 Boards' },
	{ value: '25x27', display: '25-27 Boards' },
	{ value: '26x28', display: '26-28 Boards' },
	{ value: '28x30', display: '28-30 Boards' },
	{ value: '30x33', display: '30-33 Boards' },
	{ value: '33x36', display: '33-36 Boards' },
	{ value: '36x40', display: '36-40 Boards' }
];

const swissDuration: any[] = [
	{ value: '5x5', display: '5 Boards x 5' },
	{ value: '6x5', display: '6 Boards x 5' },
	{ value: '5x6', display: '5 Boards x 6' },
	{ value: '6x6', display: '6 Boards x 6' },
	{ value: '7x6', display: '7 Boards x 6' },
	{ value: '6x7', display: '6 Boards x 7' },
	{ value: '7x7', display: '7 Boards x 7' },
	{ value: '5x7', display: '5 Boards x 7' },
	{ value: '7x5', display: '7 Boards x 5' },
	{ value: '8x6', display: '8 Boards x 6' },
	{ value: '6x8', display: '6 Boards x 8' },
	{ value: '8x7', display: '8 Boards x 7' },
	{ value: '7x8', display: '7 Boards x 8' },
	{ value: '8x8', display: '8 boards x 8' }
];

export const boardsScoringData: BoardsScoringInterface[] = [
	{
		eventType: 'Pairs',
		defaultSelected: false,
		preferedDuration: normalDuration,
		scoringMethods: [
			{ value: 'matchPoints', display: 'Match points' },
			{ value: 'crossIMP', display: "Cross IMP's" },
			{ value: 'aggregate', display: 'Aggregate' },
			{ value: 'butlerIMP', display: "Butler IMP's" }
		]
	},
	{
		eventType: 'Teams of four',
		defaultSelected: false,
		preferedDuration: normalDuration,
		scoringMethods: [
			{ value: 'IMP', display: 'Match points' },
			{ value: 'crossIMP', display: "Cross IMP's" },
			{ value: 'aggregate', display: 'Aggregate' },
			{ value: 'butlerIMP', display: "Butler IMP's" }
		]
	},
	{
		eventType: 'Teams of 8',
		defaultSelected: false,
		preferedDuration: normalDuration,
		scoringMethods: [
			{ value: 'matchPoints', display: 'Match points' },
			{ value: 'crossIMP', display: "Cross IMP's" },
			{ value: 'aggregate', display: 'Aggregate' },
			{ value: 'butlerIMP', display: "Butler IMP's" }
		]
	},
	{
		eventType: 'Teams of 16',
		defaultSelected: false,
		preferedDuration: normalDuration,
		scoringMethods: [
			{ value: 'matchPoints', display: 'Match points' },
			{ value: 'crossIMP', display: "Cross IMP's" },
			{ value: 'aggregate', display: 'Aggregate' },
			{ value: 'butlerIMP', display: "Butler IMP's" }
		]
	},
	{
		eventType: 'Individual',
		defaultSelected: false,
		preferedDuration: normalDuration,
		scoringMethods: [
			{ value: 'matchPoints', display: 'Match points' },
			{ value: 'crossIMP', display: "Cross IMP's" },
			{ value: 'aggregate', display: 'Aggregate' },
			{ value: 'butlerIMP', display: "Butler IMP's" }
		]
	},
	{
		eventType: 'Swiss Pairs',
		defaultSelected: false,
		preferedDuration: swissDuration,
		scoringMethods: [
			{ value: 'matchPoints', display: 'Match points' },
			{ value: 'crossIMP', display: "Cross IMP's" },
			{ value: 'aggregate', display: 'Aggregate' },
			{ value: 'butlerIMP', display: "Butler IMP's" }
		]
	},
	{
		eventType: 'Swiss Teams',
		defaultSelected: false,
		preferedDuration: swissDuration,
		scoringMethods: [
			{ value: 'matchPoints', display: 'Match points' },
			{ value: 'crossIMP', display: "Cross IMP's" },
			{ value: 'aggregate', display: 'Aggregate' },
			{ value: 'butlerIMP', display: "Butler IMP's" }
		]
	}
];
