var assert = require('assert');
var fs = require('fs');
var mus = require('./mus.js');

function MusTester(testSuite) {
	this.suite = testSuite;
};

MusTester.prototype.execute = function() {
	for(var i = 0; i<this.suite.length; i++) {
		var test = this.suite[i];
		var musexpr = test.musfile === undefined ? test.musexpr : fs.readFileSync(test.musfile, 'ascii');
		try {
			var musparsed = mus.parse(musexpr);
			assert.deepEqual(musparsed, test.musparsed);
		}
		catch(err) {
			console.log("Failed parse : " + test.message + ", cause : " + err);
			continue;
		}
		try {
			var muscompiled = mus.compile(musparsed);
			assert.deepEqual(muscompiled, test.muscompiled);
		}
		catch(err) {
			console.log("Failed compile : " + test.message + ", cause : " + err);
			continue;
		}
	}
};

var testSuite = [
	{
		musexpr: "a4:500", 
		musparsed: {tag:'note',pitch:'a4',dur: 500}, 
		muscompiled: [{tag:'note',pitch:69,start: 0,dur:500}], 
		message : "a4:500"
	},
	{
		musexpr: "_:500", 
		musparsed: {tag:'rest',dur: 500}, 
		muscompiled: [{tag:'rest',start: 0,dur:500}], 
		message : "_:500"
	},
	{
		musexpr: "[3]a4:500", 
		musparsed: {tag:'repeat',section:{tag:'note',pitch:'a4',dur: 500},count:3}, 
		muscompiled: [{tag:'note',pitch:69,start: 0,dur:500},{tag:'note',pitch:69,start: 500,dur:500},{tag:'note',pitch:69,start: 1000,dur:500}], 
		message : "[3]a4:500"
	},
	{
		musfile: "test1.mus", 
		musparsed: {tag:'seq',left:{tag:'seq',left:{tag:'note',pitch:'c3',dur: 250},right:{tag:'note',pitch:'g4',dur: 500}},right:{tag:'repeat',section:{tag:'par',left:{tag:'note',pitch:'c4',dur:250},right:{tag:'rest',dur:250}},count:3}},
		muscompiled: [{tag:'note',pitch:48,start:0,dur:250},{tag:'note',pitch:67,start:250,dur:500},{tag:'note',pitch:60,start:750,dur:250},{tag:'rest',start:750,dur:250},{tag:'note',pitch:60,start:1000,dur:250},{tag:'rest',start:1000,dur:250},{tag:'note',pitch:60,start:1250,dur:250},{tag:'rest',start:1250,dur:250}],
		message : "test1.mus"
	}
];

var musTester = new MusTester(testSuite);
musTester.execute();