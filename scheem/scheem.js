if (typeof module !== 'undefined') {
	var SCHEEM = require('./parser.js');
}

var scheem = (function(undefined) {
	var scheem = {
		evalScheem : function (expr, env) {
			try {
				if(!env.hasOwnProperty('bindings'))
					env.bindings = {};
				for(var op in functions) {
					env.bindings[op] = functions[op];
				}
				return evalScheem(expr, env);
			} finally {
				for(var op in functions) {
					delete env.bindings[op];
				}
			}
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
			return handler(expr, env);
		else
			throw new UnknownExpression(exp);
	};
	
	var lookup = function (env, v) {
		if (env === undefined || env === null || !env.hasOwnProperty('bindings'))
			throw new VariableNotFoundError(v);
		if (env.bindings.hasOwnProperty(v))
			return env;
		return lookup(env.outer, v);
	};
	
	var update = function (env, v, value, create) {
		if (env === undefined || env === null)
			throw new VariableNotFoundError(v);
		if(create) {
			if(!env.hasOwnProperty('bindings'))
				env.bindings = {};
			if(env.bindings.hasOwnProperty(v))
				throw new VariableAlreadyDefinedError(v);
			env.bindings[v] = value;
		} else {
			lookup(env, v).bindings[v] = value;;
		}
	};
	
	var functions = {
		'+': function() {
			if(arguments.length < 2) 
				throw new ArgumentCountError('+', '>1', arguments.length); 
			var result = arguments[0] + arguments[1];
			for(var i = 2; i<arguments.length; i++) {
				result += arguments[i];
			}
			return result;
		},
		'-': function() {
			if(arguments.length < 2) 
				throw new ArgumentCountError('-', '>1', arguments.length); 
			var result = arguments[0] - arguments[1];
			for(var i = 2; i<arguments.length; i++) {
				result -= arguments[i];
			}
			return result;
		},	
		'*': function() {
			if(arguments.length < 2) 
				throw new ArgumentCountError('*', '>1', arguments.length); 
			var result = arguments[0] * arguments[1];
			for(var i = 2; i<arguments.length; i++) {
				result *= arguments[i];
			}
			return result;
		},	
		'/': function() {
			if(arguments.length < 2) 
				throw new ArgumentCountError('/', '>1', arguments.length); 
			var result = arguments[0] / arguments[1];
			for(var i = 2; i<arguments.length; i++) {
				result /= arguments[i];
			}
			return result;
		},	
		'=': function() {
			if(arguments.length !== 2) 
				throw new ArgumentCountError('/', 2, arguments.length); 
			var result = arguments[0] === arguments[1];
			return result ? '#t' : '#f';;
		},
		'<': function() {
			if(arguments.length !== 2) 
				throw new ArgumentCountError('/', 2, arguments.length); 
			var result = arguments[0] < arguments[1];
			return result ? '#t' : '#f';;
		},
		'cons': function() {
			if(arguments.length !== 2) 
				throw new ArgumentCountError('cons', 2, arguments.length); 
			var result = [arguments[0]];
			return result.concat(arguments[1]);
		},
		'car': function() {
			if(arguments.length !== 1) 
				throw new ArgumentCountError('car', 1, arguments.length); 
			return arguments[0][0];
		},
		'cdr': function() {
			if(arguments.length !== 1) 
				throw new ArgumentCountError('cdr', 1, arguments.length);
			return arguments[0].slice(1);
		},
		'alert': function() {
			if(arguments.length !== 1) 
				throw new ArgumentCountError('alert', 1, arguments.length);
			if (typeof module !== 'undefined') {
				console.log(arguments[0]);
			} else {
				alert(arguments[0]);
			}
			return arguments[0];			
		}
	};
	
	var typeHandlerMap = {
		'string': function(expr, env) {
			if(expr === '#t' || expr === '#f') {
				return expr;
			} else {
				return lookup(env, expr).bindings[expr];
			}
		},
		'number': function(expr, env) {
			return parseInt(expr, 10);
		},
		'object': function(expr, env) {
			var handler = arrayHandlerMap[expr[0]];
			if(handler)
				return handler(expr, env);
			else
				return arrayHandlerMap[null](expr, env);
		}
	};
	
	var arrayHandlerMap = {
		'quote': function(expr, env) {
			return expr[1];
		},
		'define': function(expr, env) {
			var value = evalScheem(expr[2], env);
			update(env, expr[1], value, true);
			return value;
		},
		'set!': function(expr, env) {
			var value = evalScheem(expr[2], env);
			update(env, expr[1], value, false);
			return value;
		},
		'let':  function(expr, env) {
			var newenv = { bindings: {}, outer: env};
			for(var i=0; i<expr[1].length; i++) {
				var name = expr[1][i][0];
				var value = evalScheem(expr[1][i][1], env);
				update(newenv, name, value, true);
			}
			return evalScheem(expr[2], newenv);
		},
		'begin': function(expr, env) {
			var result;
			for(var i=1; i<expr.length; i++) {
				result = evalScheem(expr[i], env);
			}
			return result;
		},
		'if': function(expr, env) {
			var isTrue = evalScheem(expr[1], env) === '#t';
			return evalScheem(expr[isTrue ? 2 : 3], env);
		},
		'lambda': function(expr, env) {
			return function() {
				var newenv = { bindings: {}, outer: env};
				for(var i=0; i<arguments.length; i++) {
					update(newenv, expr[1][i], arguments[i], true);
				}
				return evalScheem(expr[2], newenv);
			};	
		},
		null: function(expr, env) {
			var result = [];
			for(var item in expr) {
				result[item] = evalScheem(expr[item], env);
			}
			if(typeof result[0] === 'function') {
				try {
					return result[0].apply(null, result.slice(1));
				} catch (e) {
					throw new FunctionEvaluateError(result[0], e);
				}
			} else {
				return result;
			}
		}
	};
	
	var UnknownExpression = function(expr) {
		this.name = 'UnknownExpression';
		this.message = 'Expression ' + expr + ' is unknown';
		this.expr = expr;
	};
	
	UnknownExpression.prototype = Error.prototype;
	
	var FunctionEvaluateError = function(f, cause) {
		this.name = 'FunctionEvaluateError';
		this.message = 'Cannot evaluate {' + f + '}, cause: ' + cause;
		this.f = f;
		this.cause = cause;
	};
	
	FunctionEvaluateError.prototype = Error.prototype;
	
	var VariableNotFoundError = function(variable) {
		this.name = "VariableNotFoundError";
		this.message = 'Variable ' + variable + ' is not defined';
		this.variable = variable;
	};
	
    VariableNotFoundError.prototype = Error.prototype;
	
	var VariableAlreadyDefinedError = function(variable) {
		this.name = "VariableAlreadyDefinedError";
		this.message = 'Variable ' + variable + ' is already defined';
		this.variable = variable;
	};
	
    VariableAlreadyDefinedError.prototype = Error.prototype;
	
	var ArgumentCountError = function(f, expected, received) {
		this.name = "ArgumentCountError";
		this.message = 'Function ' + f + ' expected ' + expected + 'arguments but received ' + received;
		this.f = f; 
		this.expected = expected;
		this.received = expected;
	};
	
    ArgumentCountError.prototype = Error.prototype;
	
	return scheem;
})();

if (typeof module !== 'undefined') {
	module.exports = scheem;
}