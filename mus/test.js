var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs');
var mus = require('./mus.js');

var wrapAssertion = function(f) {
	return function(actual, expected, message) {
		try {
			f(actual, expected, message);
			console.log("SUCCESS: " + message);
		}
		catch(err) {
			console.log("FAILED: " + err.message + ". Actual -> " + JSON.stringify(actual, null, '\t') + ", expected -> " + JSON.stringify(expected, null, '\t'));
		}
	}
}

var deepEqual = wrapAssertion(assert.deepEqual);

deepEqual(mus.parse("A4[500]"), {tag:'note',pitch:'A4',dur: 500}, "A4[500]");
deepEqual(mus.compile(mus.parse("A4[500]")), [{tag:'note',pitch:69,start: 0,dur:500}], "A4[500]");
deepEqual(mus.parse("REST[500]"), {tag:'rest',dur: 500}, "REST[500]");
deepEqual(mus.compile(mus.parse("REST[500]")), [{tag:'rest',start: 0,dur:500}], "REST[500]");
deepEqual(mus.parse("SEQ{A4[500]REST[500]}"), {tag:'seq',left:{tag:'note',pitch:'A4',dur: 500},right:{tag:'rest',dur:500}}, "A4[500]\nREST[500]");
deepEqual(mus.parse("PAR{A4[500]REST[500]}"), {tag:'par',left:{tag:'note',pitch:'A4',dur: 500},right:{tag:'rest',dur:500}}, "A4[500],REST[500]");
/*deepEqual(mus.parse("3{A4[500]}"), {tag:'repeat',section:{tag:'note',pitch:'A4',dur: 500},count:3}, "3{A4[500]}");
deepEqual(mus.parse("3  \n{\n  A4[500]\n\t}"), {tag:'repeat',section:{tag:'note',pitch:'A4',dur: 500},count:3}, "3  \n{\n  A4[500]\n\t}");

var melody_mus = "C3[250],G4[500]\n3{C4[250]}\nREST[250]";
var melody_mus_parsed = { 
	tag: 'seq',
	left: { 
		tag: 'par',
		left: { tag: 'note', pitch: 'c3', dur: 250 },
		right:  { tag: 'note', pitch: 'g4', dur: 500 } 
	},
	right: { 
		tag: 'seq',
		left: { 
			tag: 'repeat',
			section: { tag: 'note', pitch: 'c4', dur: 250 },
			count: 3
		},
		right: { tag: 'rest', dur: 250 }
	}
};
var melody_mus_compiled = [
	{ tag: 'note', pitch: 48, start: 0, dur: 250 },
	{ tag: 'note', pitch: 67, start: 0, dur: 500 },
	{ tag: 'note', pitch: 60, start: 500, dur: 250 },
	{ tag: 'note', pitch: 60, start: 750, dur: 250 },
	{ tag: 'note', pitch: 60, start: 1000, dur: 250 },
	{ tag: 'rest', start: 1250, dur: 250 } 
];

deepEqual(mus.parse(melody_mus), melody_mus_parsed, "PARSE -> " + melody_mus);
deepEqual(mus.compile(melody_mus_parsed), melody_mus_compiled, "COMPILE -> " + JSON.stringify(melody_mus, null, '\t'));
*/
