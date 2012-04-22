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

deepEqual(mus.parse("play note A4 for 500"), {tag:'note',pitch:'A4',dur: 500}, "play note A4 for 500");
deepEqual(mus.compile(mus.parse("play note A4 for 500")), [{tag:'note',pitch:69,start: 0,dur:500}], "play note A4 for 500");
deepEqual(mus.parse("rest for 500"), {tag:'rest',dur: 500}, "rest for 500");
deepEqual(mus.compile(mus.parse("rest for 500")), [{tag:'rest',start: 0,dur:500}], "rest for 500");

/*
var melody_mus = { 
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

deepEqual(
	mus.compile(melody_mus),
	[
		{ tag: 'note', pitch: 48, start: 0, dur: 250 },
		{ tag: 'note', pitch: 67, start: 0, dur: 500 },
		{ tag: 'note', pitch: 60, start: 500, dur: 250 },
		{ tag: 'note', pitch: 60, start: 750, dur: 250 },
		{ tag: 'note', pitch: 60, start: 1000, dur: 250 },
		{ tag: 'rest', start: 1250, dur: 250 } 
	],
	JSON.stringify(melody_mus, null, '\t')
);
*/