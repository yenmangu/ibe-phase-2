export interface ChargeCodeInterface {
	display: string;
	value: string;
	desc: string;
}

export const chargeCodes: ChargeCodeInterface[] = [
	{
		display: '02',
		value: '02',
		desc: 'Null Session. Used only for uploading results for sessions that have already been submitted e.g. to award Master Points for a final ladder. No charge will be made and no sessions credited to the participants i.e. this will not form a credit for a magazine point.'
	},
	{
		display: '03',
		value: '03',
		desc: 'One of a club’s annual (per EBU financial year) allocation of free sessions. See below for further details'
	},
	{
		display: '04',
		value: '04',
		desc: 'Novice Session without magazine points. No UMS is charged; uploading results for properly constituted Novice Sessions using this code is optional and is normally only used when a code is needed to upload results for display by Pianola or similar organisation.'
	},
	{
		display: '06',
		value: '06',
		desc: '06 Children in Need Simultaneous Pairs. Free of charge.'
	},
	{
		display: '07',
		value: '07',
		desc: 'Special rate for EBU-run Simultaneous Pairs events submitted by non-EBU clubs (so no additional subscription charge is levied). Should never be used by EBU-affiliated clubs.'
	},
	{
		display: '08',
		value: '08',
		desc: 'Special rate for events that have already been changed UMS, such as through the League Management System, but need to be re-submitted so that they can be processed for the NGS'
	},
	{
		display: '10',
		value: '10',
		desc: 'Normal club session charged at the standard subscription price for the date it was played, plus any county charges'
	},
	{
		display: '11',
		value: '11',
		desc: '‘Social or supervised sessions’. Sessions for which a full rate is charged (as they do not qualify as a ‘novice’ session), but the session should not be included in the NGS and no Master Points should be awarded (e.g. some players receive guidance). The sessions do qualify for magazine points.'
	},
	{
		display: '12',
		value: '12',
		desc: '‘Mentor sessions’. Sessions for which a full rate is charged (as they are not ‘novice sessions’), but the session is not included in the NGS. Master Points are awarded (they may be stratified) and the sessions do qualify for magazine points.'
	},
	{
		display: '14',
		value: '14',
		desc: '‘Trial Clubs’ session. No charge for offer period. Sessions qualifies for Magazine Point, NGS and Master Points. For registered Trial Clubs Only.'
	},
	{
		display: '20',
		value: '20',
		desc: 'County event. Charged at the full standard rate'
	},
	{
		display: '21',
		value: '21',
		desc: 'League or knockout event. From 1 st April 2020, charged the full standard rate. Used for club, county, district or regional leagues and knockouts as well as additional events associated to district leagues. Note also that organisers can alternatively submit via the League Management System.'
	},
	{
		display: '22',
		value: '22',
		desc: 'Novice Session with magazine points. Half the standard subscription price. No master points are issued and the event is not graded for the NGS.'
	},
	{
		display: '30',
		value: '30',
		desc: 'Licensed affiliated event (Swiss or non-Swiss).'
	},
	{
		display: '40',
		value: '40',
		desc: 'Licensed affiliated charity event (Swiss or non-Swiss).'
	},
	{ display: '50', value: '50', desc: 'Affiliated/associated blue-pointed event,' },
	{
		display: '60',
		value: '60',
		desc: 'Licensed county green-pointed event. Either a ODGP event or a green-pointed county congress.'
	},
	{
		display: '70',
		value: '70',
		desc: 'Event run by a registered commercial (i.e. non-affiliated) operator in England.'
	},
	{
		display: '71',
		value: '71',
		desc: 'Event run by a registered commercial (i.e. non-affiliated) operator outside of England'
	},
	{
		display: '72',
		value: '72',
		desc: "Event run by a registered commercial (i.e. non-affiliated) operator in England. Doesn't count for NGS."
	},
	{
		display: '73',
		value: '73',
		desc: "Event run by a registered commercial (i.e. non-affiliated) operator outside of England. Doesn't count for NGS."
	},
	{
		display: '90',
		value: '90',
		desc: 'Special rates for EBU events run by clubs on behalf of the EBU. Should only be used on direction of EBU staff. Single Session Events'
	},
	{
		display: '91',
		value: '91',
		desc: 'Special rates for EBU events run by clubs on behalf of the EBU. Should only be used on direction of EBU staff. Master Pairs Heats'
	},
	{
		display: '92',
		value: '92',
		desc: 'Special rates for EBU events run by clubs on behalf of the EBU. Should only be used on direction of EBU staff. National Pairs Heats'
	},
	{
		display: '99',
		value: '99',
		desc: 'Special rate for EBU events and events run on behalf of the EBU. Should only be used on direction of EBU staff'
	}
];
