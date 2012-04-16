/* Compiler functions */
var pitchMap = {
	A: 9, B: 11, C: 0, D: 2, E: 4, F: 5, G: 7
};

var convertPitch = function(pitch) {
	return 12 + 12 * parseInt(pitch[1], 10) + pitchMap[pitch[0].toUpperCase()];
};

var compileT = function(expr, time, result) {
	var handler = handlerMap[expr.tag.toLowerCase()];
	if(!handler) {
		console.log('Handler for tag \'' + expr.tag + '\' not found');
		return time;
	} else {
		return handler.compileT(expr, time, result);
	}
};

var compile = function(musexpr) {
	var result = [];
	compileT(musexpr, 0, result);
	return result;
};

/* OOP Classes */
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

/* Test methods */
var melody_mus = 
	{ tag: 'seq',
	left: 
		{ tag: 'par',
			left: { tag: 'note', pitch: 'c3', dur: 250 },
			right: { tag: 'note', pitch: 'g4', dur: 500 } },
	right:
		{ tag: 'seq',
			left: { tag: 'repeat',
				section: { tag: 'note', pitch: 'c4', dur: 250 },
				count: 3 },
			right: { tag: 'rest', dur: 250 } } };

console.log(melody_mus);
console.log(compile(melody_mus));