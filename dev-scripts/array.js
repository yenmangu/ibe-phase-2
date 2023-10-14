const string =
	'1.-1.0.-1.-1.x.0.0.0.0.1.1.0.10.30000.0.x.x.0.0.0.0.0.1.1.0.x.1.1.1.1.0.0.0.12.0.0.0.0.1.1.1.1.1.1.0.1.-1.0.-1.-1.-1.-1.-1.1.0.1.0.-1.-1.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x';
// const array = string.split('.');

// <![CDATA[MV PS11-2
// 	ROVER false
// 	ATT ATTACHEDTOTABLE
// 	PN NP
// 	EN NN
// 	ASW .
// 	OTH 1.2.0.-1.-1.-1.1.1.1.1.1.1.0.10.30000.0.x.x.0.1.0.0.0.1.1.0.x.0.0.0.1.0.0.0.0.0.1.1.0.0.0.0.1.0.1.0.1.-1.0.-1.-1.-1.-1.-1.0.0.1.0.-1.-1.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x
// 	DUMMY
// 	]]>
// console.log(array);

// const newString =
// 	'1.2.0.-1.-1.-1.1.1.1.1.1.1.0.10.30000.0.x.x.0.1.0.0.0.1.1.0.x.0.0.0.1.0.0.0.0.0.1.1.0.0.0.0.1.0.1.0.1.-1.0.-1.-1.-1.-1.-1.0.0.1.0.-1.-1.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x';
// const pairsArray = newString.split('.');

// console.log('el at index 34: ', pairsArray[34]);

// const index = array.findIndex(item => item === '12');
// console.log('index is: ', index);
// console.log(element);
const test ="OTH 1.-1.0.-1.-1.x.0.0.0.0.1.1.0.10.30000.0.x.x.0.0.0.0.0.1.1.0.x.1.1.1.1.0.0.0.12.0.0.0.0.1.1.1.1.1.1.0.1.-1.0.-1.-1.-1.-1.-1.1.0.1.0.-1.-1.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x"
const array = test.split(' ')[1].split('.')
// const extracted = array[1].split('.')
console.log(array)
const settings =
[
  "MV TS177",
  "ROVER false",
  "ATT ATTACHEDTOPLAYERS",
  "PN NP",
  "EN first event test",
  "ASW .",
  "OTH 1.-1.0.-1.-1.x.0.0.0.0.1.1.0.10.30000.0.x.x.0.0.0.0.0.1.1.0.x.1.1.1.1.0.0.0.12.0.0.0.0.1.1.1.1.1.1.0.1.-1.0.-1.-1.-1.-1.-1.1.0.1.0.-1.-1.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x",
  "DUMMY",
  ""
]
function extractOTH(string){
	return string.split(' ')[1].split('.')
}

const teamArray = [
  "\n      \n    "
]



console.log('testVal: ',extractOTH(settings[6]))


