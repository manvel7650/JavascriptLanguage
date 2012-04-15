/* Compiler functions */
var pitchMap = {
	A: 9,
	B: 11,
	C: 0,
	D: 2,
	E: 4,
	F: 5
	G: 7
};

var convertPitch = function(pitch) {
	return 12 + 12 * parseInt(pitch[1]) + pitchMap[pitch[0].toUpperCase()];
};

var endTime = function (expr, time) {
	return getHandler(expr).endTime(expr, time);
};

var compileT = function(expr, time) {
    return getHandler(expr).compileT(expr, time);
};

var compile = function(musexpr) {
    return compileT(musexpr, 0);
};

/* OOP Classes */
function TagHandler() {
};

function NoteHandler() {
};

NoteHandler.prototype = new TagHandler();

NoteHandler.prototype.compileT = function(expr, time) {
    var result = [];
	result.push(
		{
			tag : 'note', 
			pitch : convertPitch(expr.pitch),
			start : time,
			dur: expr.dur
		}
	);
    return result;
};

NoteHandler.prototype.endTime = function (expr, time) {
	return time + expr.dur;
};

function RestHandler() {
};

RestHandler.prototype = new TagHandler();

RestHandler.prototype.compileT = function(expr, time) {
    var result = [];
	result.push(
		{
			tag : 'rest', 
			start : time,
			dur: expr.dur
		}
	);	
    return result;
};

RestHandler.prototype.endTime = function (expr, time) {
	return time + expr.dur;
};

function SeqHandler() {
};

SeqHandler.prototype = new TagHandler();

SeqHandler.prototype.compileT = function(expr, time) {
    var result = [];
	result = result.concat(compileT(expr.left, time));
	time = endTime(expr.left, time);
	result = result.concat(compileT(expr.right, time));
    return result;
};

SeqHandler.prototype.endTime = function (expr, time) {
	time = endTime(expr.left, time);
	time = endTime(expr.right, time);
	return time;
};

function ParHandler() {
};

ParHandler.prototype = new TagHandler();

ParHandler.prototype.compileT = function(expr, time) {
    var result = [];
	result = result.concat(compileT(expr.left, time));
	result = result.concat(compileT(expr.right, time));
    return result;
};

ParHandler.prototype.endTime = function (expr, time) {
	var longExpr = expr.left.dur > expr.right.dur ? expr.left : expr.right;
	time = endTime(longExpr, time);
	return time;
};

function RepeatHandler() {
};

RepeatHandler.prototype = new TagHandler();

RepeatHandler.prototype.compileT = function(expr, time) {
    var result = [];
	for(var i = 0; i < expr.count; i++) {
		result = result.concat(compileT(expr.section, time));
		time = endTime(expr.section, time);
	}
    return result;
};

RepeatHandler.prototype.endTime = function (expr, time) {
	var newTime = endTime(expr.section, time);
	return time + (newTime - time) * expr.count;
};

var handlerMap = {
	note: new NoteHandler(),
	rest: new RestHandler(),
	seq: new SeqHandler(),
	par: new ParHandler(),
	repeat: new RepeatHandler()
};

var UnknownTagException = function(tag) {
	this.tag = tag;
}

var getHandler = function(expr) {
	var handler = handlerMap[expr.tag.toLowerCase()];
	if(handler === null) {
		throw new UnknownTagException(expr.tag);
	}
	return handler;
}

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
