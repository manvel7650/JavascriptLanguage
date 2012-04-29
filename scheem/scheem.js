if (typeof module !== 'undefined') {
	var SCHEEM = require('./parser.js');
}

var scheem = (function(undefined) {
	var scheem = {
		evalScheem : function (expr, env) {
			return evalScheem(expr, env);
		},
		parse : function (expr) {
			return SCHEEM.parse(expr);
		}
	};	
	
	var evalScheem = function (expr, env) {
		return typeHandlerMap[typeof expr].evalScheem(expr, env);
	};
	
	function NumberHandler() {}
	
	NumberHandler.prototype.evalScheem = function(expr, env) {
		return parseInt(expr, 10);
	};
	
	function VariableHandler() {}
	
	VariableHandler.prototype.evalScheem = function(expr, env) {
		return env[expr];
	};	
	
	function ObjectHandler() {}
	
	ObjectHandler.prototype.evalScheem = function(expr, env) {
		return arrayHandlerMap[expr[0]].evalScheem(expr, env);
	};	
	
	function AritmeticalHandler() {}
	
	AritmeticalHandler.prototype.evalScheem = function(expr, env) {
		var left = evalScheem(expr[1], env);
		var right = evalScheem(expr[2], env);
		var result;
		switch (expr[0]) {
			case '+':
				result = left + right;
				break;
			case '-':
				result = left - right;
				break;
			case '*':
				result = left * right;
				break;
			case '/':
				result = left / right;
				break;
		}
		return result;
	};
	
	function LogicalHandler() {}
	
	LogicalHandler.prototype.evalScheem = function(expr, env) {
		var left = evalScheem(expr[1], env);
		var right = evalScheem(expr[2], env);
		var result;
		switch (expr[0]) {
			case '<':
				result = left < right;
				break;
			case '=':
				result = left === right;
				break;
		}
		return result ? '#t' : '#f';
	};
	
	function QuoteHandler() {}
	
	QuoteHandler.prototype.evalScheem = function(expr, env) {
		return expr[1];
	};
	
	function DefineHandler() {}
	
	DefineHandler.prototype.evalScheem = function(expr, env) {
		var value = evalScheem(expr[2], env);
		env[expr[1]] = value;
		return value;
	};
	
	function SetHandler() {}

	SetHandler.prototype.evalScheem = function(expr, env) {
		var value = evalScheem(expr[2], env);
		env[expr[1]] = value;
		return value;
	};
	
	function BeginHandler() {}
	
	BeginHandler.prototype.evalScheem = function(expr, env) {
		var result;
		for(var i=1; i<expr.length; i++) {
			result = evalScheem(expr[i], env);
		}
		return result;
	};
	
	function ConsHandler() {}
	
	ConsHandler.prototype.evalScheem = function(expr, env) {
		var result = [evalScheem(expr[1], env)];
		return result.concat(evalScheem(expr[2], env));
	};
	
	function CarHandler() {}
	
	CarHandler.prototype.evalScheem = function(expr, env) {
		return evalScheem(expr[1], env)[0];
	};
	
	function CdrHandler() {}
	
	CdrHandler.prototype.evalScheem = function(expr, env) {
		return evalScheem(expr[1], env).slice(1);
	};
	
	function IfHandler() {}
	
	IfHandler.prototype.evalScheem = function(expr, env) {
		var isTrue = evalScheem(expr[1], env) === '#t';
		return evalScheem(expr[isTrue ? 2 : 3], env);
	};
	
	var typeHandlerMap = {
		'string' : new VariableHandler(),
		'number' : new NumberHandler(),
		'object' : new ObjectHandler()
	}
	
	var arrayHandlerMap = {
		'+' : new AritmeticalHandler(),
		'-' : new AritmeticalHandler(),
		'*' : new AritmeticalHandler(),
		'/' : new AritmeticalHandler(),
		'=' : new LogicalHandler(),
		'<' : new LogicalHandler(),
		'quote' : new QuoteHandler(),
		'define' : new DefineHandler(),
		'set!' : new SetHandler(),
		'begin' : new BeginHandler(),
		'cons' : new ConsHandler(),
		'car' : new CarHandler(),
		'cdr' : new CdrHandler(),
		'if' : new IfHandler()
	};
	
	return scheem;
})();

if (typeof module !== 'undefined') {
	module.exports = scheem;
}