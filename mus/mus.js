var PEG = require('pegjs');
var fs = require('fs');

var mus = (function(undefined) {

	var mus = {
		compile: function(musexpr) {
			var result = [];
			if(musexpr) {
				compileT(musexpr, 0, result);
			}
			return result;
		},
		
		parse: function(expr) {
			return parser.parse(expr);
		}
	};

	var parser = PEG.buildParser(fs.readFileSync('mus.peg', 'ascii'), {trackLineAndColumn: true});
	
	var pitchMap = {
		A: 9, B: 11, C: 0, D: 2, E: 4, F: 5, G: 7
	};
	
	

	var convertPitch = function(pitch) {
		return 12 + 12 * parseInt(pitch[1], 10) + pitchMap[pitch[0].toUpperCase()];
	};

	var compileT = function(expr, time, result) {
		var handler = handlerMap[expr.tag.toLowerCase()];
		if(!handler) {
			return time;
		} else {
			return handler.compileT(expr, time, result);
		}
	};

	function NoteHandler() {}

	NoteHandler.prototype.compileT = function(expr, time, result) {
		result.push({tag: 'note', pitch: convertPitch(expr.pitch), start: time, dur: expr.dur});
		return time + expr.dur;
	};

	function RestHandler() {}

	RestHandler.prototype.compileT = function(expr, time, result) {
		result.push({tag: 'rest', start: time, dur: expr.dur});	
		return time + expr.dur;
	};

	function SeqHandler() {}

	SeqHandler.prototype.compileT = function(expr, time, result) {
		time = compileT(expr.left, time, result);
		time = compileT(expr.right, time, result);
		return time;
	};

	function ParHandler() {}

	ParHandler.prototype.compileT = function(expr, time, result) {
		var leftTime = compileT(expr.left, time, result);
		var rightTime = compileT(expr.right, time, result);
		return Math.max(leftTime, rightTime);
	};

	function RepeatHandler() {}

	RepeatHandler.prototype.compileT = function(expr, time, result) {
		for(var i = 0; i < expr.count; i++) {
			time = compileT(expr.section, time, result);
		}
		return time;
	};

	var handlerMap = {
		note: new NoteHandler(),
		rest: new RestHandler(),
		seq: new SeqHandler(),
		par: new ParHandler(),
		repeat: new RepeatHandler()
	};
	
	return mus;
})();

if (typeof module !== "undefined") {
	module.exports = mus;
}
