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
		},
		evalScheemString : function(expr) {
			var parsed = this.parse(expr);
			return this.evalScheem(parsed, {});
		}
	};
	
	var evalScheem = function (expr, env) {
		var handler = typeHandlerMap[typeof expr];
		if(handler) 
			return handler.evalScheem(expr, env);
		else
			throw new scheem.UnknownExpression(exp);
	};
	
	function NumberHandler() {}
	
	NumberHandler.prototype.evalScheem = function(expr, env) {
		return parseInt(expr, 10);
	};
	
	function TokenHandler() {}
	
	TokenHandler.prototype.evalScheem = function(expr, env) {
		if(expr === '#t') {
			return true;
		} else if(expr === '#f') {
			return false;
		} else {
			var value = env[expr];
			if(value === undefined) {
				throw new scheem.VariableNotFoundError(expr);
			}
			return value;
		}
	};
	
	function ObjectHandler() {}
	
	ObjectHandler.prototype.evalScheem = function(expr, env) {
		var handler = arrayHandlerMap[expr[0]];
		if(handler)
			return handler.evalScheem(expr, env);
		else
			return arrayHandlerMap[null].evalScheem(expr, env);
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
		return result ? true : false;
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
	
	function ListHandler() {}
	
	ListHandler.prototype.evalScheem = function(expr, env) {
		var result = [];
		for(var item in expr) {
			result[item] = evalScheem(expr[item], env);
		}
		return result;
	};
	
	var typeHandlerMap = {
		'string' : new TokenHandler(),
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
		'if' : new IfHandler(),
		null : new ListHandler()
	};
	
	scheem.UnknownExpression = function(expr) {
		this.name = "UnknownExpression";
		this.message = 'Expression ' + expr + ' is unknown';
		this.expr = expr;
	};
	
	scheem.UnknownExpression.prototype = Error.prototype;
  
	scheem.VariableNotFoundError = function(variable) {
		this.name = "VariableNotFoundError";
		this.message = 'Variable ' + variable + ' is not defined, define it first';
		this.variable = variable;
	};
  
	scheem.VariableNotFoundError.prototype = Error.prototype;
	
	return scheem;
})();

if (typeof module !== 'undefined') {
	module.exports = scheem;
}