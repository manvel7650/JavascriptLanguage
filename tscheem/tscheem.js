if (typeof module !== 'undefined') {
	var TSCHEEM = require('./parser.js');
}

var tscheem = (function(undefined) {
	var tscheem = {
		evalTscheem : function (expr, env) {
			try {
				if(!env.hasOwnProperty('bindings'))
					env.bindings = {};
				for(var op in functions) {
					env.bindings[op] = functions[op];
				}
				return evalTscheem(expr, env);
			} finally {
				for(var op in functions) {
					delete env.bindings[op];
				}
			}
		},
		parse : function (expr) {
			return TSCHEEM.parse(expr);
		},
		evalTscheemString : function(expr) {
			var parsed = this.parse(expr);
			return this.evalTscheem(parsed, {});
		}
	};
	
	var arrowType = function(left, right) {
		return {tag: 'arrowtype', left: left, right: right};
	};
	
	var baseType = function(name) {
		return {tag: 'basetype', name: name};
	};
	
	var varargType = function(name) {
		return {tag: 'varargtype', name: name};
	};

    var unknownType = function() {
        return {tag: 'unknownType'};
    };
	
	var evalTscheem = function (expr, env) {
		var handler = exprByTypeHandlers[typeof expr];
		if(handler) {
			return handler(expr, env);
		}
		else
			throw new UnknownExpression(exp);
	};
	
	var lookup = function (env, v) {
		if (env === undefined || env === null || !env.hasOwnProperty('bindings')) {
			throw new VariableNotFoundError(v);
		}
		if (env.bindings.hasOwnProperty(v)) {
			return env;
		}
		return lookup(env.outer, v);
	};
	
	var update = function (env, v, value, type, create) {
		if (env === undefined || env === null)
			throw new VariableNotFoundError(v);
		if(create) {
			if(!env.hasOwnProperty('bindings'))
				env.bindings = {};
			if(env.bindings.hasOwnProperty(v))
				throw new VariableAlreadyDefinedError(v);
			env.bindings[v] = {value : value, type : type};
		} else {
			lookup(env, v).bindings[v] = {value : value, type : type};
		}
	};
	
	var functions = {
		'+': { value: function() {
				if(arguments.length < 2) 
					throw new ArgumentCountError('+', '>1', arguments.length);
				var result = arguments[0] + arguments[1];
				for(var i = 2; i<arguments.length; i++) {
					if(typeof arguments[i] !== 'number')
						throw new NotANumberError(arguments[i]);
					result += arguments[i];
				}
				return result;
			},
			type: arrowType(varargType('num'), baseType('num'))
		},
		'-': { value: function() {
				if(arguments.length < 2) 
					throw new ArgumentCountError('-', '>1', arguments.length); 
				var result = arguments[0] - arguments[1];
				for(var i = 2; i<arguments.length; i++) {
					if(typeof arguments[i] !== 'number')
						throw new NotANumberError(arguments[i]);
					result -= arguments[i];
				}
				return result;
			},
			type: arrowType(varargType('num'), baseType('num'))
		},	
		'*': { value: function() {
				if(arguments.length < 2) 
					throw new ArgumentCountError('*', '>1', arguments.length); 
				var result = arguments[0] * arguments[1];
				for(var i = 2; i<arguments.length; i++) {
					if(typeof arguments[i] !== 'number')
						throw new NotANumberError(arguments[i]);	
					result *= arguments[i];
				}
				return result;
			},
			type: arrowType(varargType('num'), baseType('num'))
		},	
		'/': {value: function() {
				if(arguments.length < 2) 
					throw new ArgumentCountError('/', '>1', arguments.length); 
				var result = arguments[0] / arguments[1];
				for(var i = 2; i<arguments.length; i++) {
					if(typeof arguments[i] !== 'number')
						throw new NotANumberError(arguments[i]);	
					result /= arguments[i];
				}
				return result;
			},
			type: arrowType(varargType('num'), baseType('num'))
		},	
		'=': {value: function() {
				if(arguments.length !== 2) 
					throw new ArgumentCountError('=', 2, arguments.length); 
				var result = arguments[0] === arguments[1];
				return result ? '#t' : '#f';
			},
			type: arrowType([baseType('num'), baseType('num')], baseType('bool'))
		},
		'!=': {value: function() {
				if(arguments.length !== 2) 
					throw new ArgumentCountError('!=', 2, arguments.length); 
				var result = arguments[0] !== arguments[1];
				return result ? '#t' : '#f';
			},
			type: arrowType([baseType('num'), baseType('num')], baseType('bool'))
		},
		'<': {value: function() {
				if(arguments.length !== 2) 
					throw new ArgumentCountError('<', 2, arguments.length); 
				var result = arguments[0] < arguments[1];
				return result ? '#t' : '#f';
			},
			type: arrowType([baseType('num'), baseType('num')], baseType('bool'))
		},
		'<=': {value: function() {
				if(arguments.length !== 2) 
					throw new ArgumentCountError('<=', 2, arguments.length); 
				var result = arguments[0] <= arguments[1];
				return result ? '#t' : '#f';
			},
			type: arrowType([baseType('num'), baseType('num')], baseType('bool'))
		},
		'>': {value: function() {
				if(arguments.length !== 2) 
					throw new ArgumentCountError('>', 2, arguments.length); 
				var result = arguments[0] > arguments[1];
				return result ? '#t' : '#f';
			},
			type: arrowType([baseType('num'), baseType('num')], baseType('bool'))
		},
		'>=': {value: function() {
				if(arguments.length !== 2) 
					throw new ArgumentCountError('>=', 2, arguments.length); 
				var result = arguments[0] >= arguments[1];
				return result ? '#t' : '#f';
			},
			type: arrowType([baseType('num'), baseType('num')], baseType('bool'))
		},
		'list': {value: function() {
				var result = [];
				for(var i=0; i<arguments.length; i++) {
					result.push(arguments[i]);
				}
				return result;
			},
			type: arrowType(varargType('num'), baseType('list'))
		},
		'cons': {value: function() {
				if(arguments.length !== 2) 
					throw new ArgumentCountError('cons', 2, arguments.length); 
				var result = [arguments[0]];
				return result.concat(arguments[1]);
			},
			type: arrowType([baseType('num'), baseType('list')], baseType('list'))
		},
		'car': {value: function() {
				if(arguments.length !== 1) 
					throw new ArgumentCountError('car', 1, arguments.length); 
				return arguments[0][0];
			},
			type: arrowType(baseType('list'), baseType('num'))
		},
		'cdr': {value: function() {
				if(arguments.length !== 1) 
					throw new ArgumentCountError('cdr', 1, arguments.length);
				return arguments[0].slice(1);
			},
			type: arrowType(baseType('list'), baseType('list'))
		},
		'length': {value: function() {
				if(arguments.length !== 1) 
					throw new ArgumentCountError('length', 1, arguments.length);
				return arguments[0].length;
			},
			type: arrowType(baseType('list'), baseType('num'))
		},
		'append': {value: function() {
				if(arguments.length < 2) 
					throw new ArgumentCountError('append', '>1', arguments.length);
				var result = [];
				for(var i=0; i<arguments.length; i++) {
					result = result.concat(arguments[i]);
				}
				return result;
			},
			type: arrowType(varargType('list'), baseType('list'))
		},
		'alert': {value: function() {
				if(arguments.length !== 1) 
					throw new ArgumentCountError('alert', 1, arguments.length);
				if (typeof module !== 'undefined') {
					console.log(arguments[0]);
				} else {
					alert(arguments[0]);
				}
				return arguments[0];
			},
			type: arrowType(baseType('num'), baseType('num'))
		}
	};
	
	var exprByTypeHandlers = {
		'string': function(expr, env) {
			if(expr === '#t' || expr === '#f') {
				return expr;
			} else {
				return lookup(env, expr).bindings[expr].value;
			}
		},
		'number': function(expr, env) {
			return parseInt(expr, 10);
		},
		'object': function(expr, env) {
			var handler = exprByTagHandlers[expr[0]];
			if(handler)
				return handler(expr, env);
			else
				return exprByTagHandlers[null](expr, env);
		}
	};
	
	var typeByTypeHandlers = {
		'boolean' : function(expr, env) {
			return { tag: 'basetype', name: 'bool' };
		},
		'string': function(expr, env) {
			if(expr === '#t' || expr === '#f') {
				return { tag: 'basetype', name: 'bool' };
			} else {
				return lookup(env, expr).bindings[expr].type;
			}
		},
		'number': function(expr, env) {
			return { tag: 'basetype', name: 'num' };
		},
		'object': function(expr, env) {
			var handler = typeByTagHandlers[expr[0]];
			if(handler)
				return handler(expr, env);
			else
				return typeByTagHandlers[null](expr, env);
		}
	};
	
	var exprByTagHandlers = {
		'quote': function(expr, env) {
			return expr[1];
		},
		'define': function(expr, env) {
			var value = evalTscheem(expr[2], env);
            var newenv = { bindings: {}, outer: env};
            update(newenv, expr[1], null, unknownType(), true);
			var type = typeExpr(expr[2], newenv);
			update(env, expr[1], value, type, true);
			return value;
		},
		'set!': function(expr, env) {
			var value = evalTscheem(expr[2], env);
			var type = typeExpr(expr[2], env);
			var current = typeExpr(expr[1], env);
			if(!sameType(type, current)) {
				throw new IllegalTypeError(type, current);
			}
			update(env, expr[1], value, type, false);
			return value;
		},
		'let':  function(expr, env) {
			var newenv = { bindings: {}, outer: env};
			for(var i=0; i<expr[1].length; i++) {
				var name = expr[1][i][0];
				var value = evalTscheem(expr[1][i][1], env);
				var type = typeExpr(expr[1][i][1], env);
				update(newenv, name, value, type, true);
			}
			return evalTscheem(expr[2], newenv);
		},
		'begin': function(expr, env) {
			var result;
			for(var i=1; i<expr.length; i++) {
				result = evalTscheem(expr[i], env);
			}
			return result;
		},
		'if': function(expr, env) {
			var isTrue = evalTscheem(expr[1], env) === '#t';
			return evalTscheem(expr[isTrue ? 2 : 3], env);
		},
		'lambda': function(expr, env) {
			return function() {
				var newenv = { bindings: {}, outer: env};
				for(var i=0; i<expr[1].length; i++) {
					var name = expr[1][i].atom;
					var type = baseType(expr[1][i].type);
					update(newenv, name, arguments[i], type, true);
				}
				return evalTscheem(expr[2], newenv);
			};	
		},
		null: function(expr, env) {
			var result = [];
			for(var item in expr) {
				result[item] = evalTscheem(expr[item], env);
			}
			if(typeof result[0] === 'function') {
				try {
					return result[0].apply(null, result.slice(1));
				} catch (e) {
					throw new FunctionEvaluateError(result[0], e);
				}
			} else {
				throw new NotAFunctionError(result[0]);
			}
		}
	};
	
	var typeByTagHandlers = {
		'quote': function(expr, env) {
			return typeExpr(expr[1], env);
		},
		'define': function(expr, env) {
			return typeExpr(expr[2], env);
		},
		'set!': function(expr, env) {
			return typeExpr(expr[2], env);
		},
		'let':  function(expr, env) {
			var newenv = { bindings: {}, outer: env};
			for(var i=0; i<expr[1].length; i++) {
				var name = expr[1][i][0];
				var value = evalTscheem(expr[1][i][1], env);
				var type = typeExpr(expr[1][i][1], env);
				update(newenv, name, value, type, true);
			}
			return typeExpr(expr[2], newenv);
		},
		'begin': function(expr, env) {
			if(expr.length <= 0) {
				return null;
			}
			return typeExpr(expr[expr.length - 1], env);
		},
		'if': function(expr, env) {
			var cond_type = typeExpr(expr[1], env);
			if(cond_type.tag !== 'basetype' || cond_type.name !== 'bool') {
				throw new NotBooleanIf(cond_type);
			}
			var A_type = typeExpr(expr[2], env);
			var B_type = typeExpr(expr[3], env);
            if(A_type.tag === 'unknownType') {
                return B_type;
            } else if(B_type.tag === 'unknownType') {
                return A_type;
            } else if(!sameType(A_type, B_type)) {
			   throw new NotEqualTypeIf(A_type, B_type);
			}
			return A_type;    
		},
		'lambda': function(expr, env) {
			var newenv = { bindings: {}, outer: env};
			for(var i=0; i<expr[1].length; i++) {
				var name = expr[1][i].atom;
				var type = baseType(expr[1][i].type);
				update(newenv, name, null, type, true);
			}
			return typeExpr(expr[2], newenv);
		},
		null: function(expr, env) {
			var type = lookup(env, expr[0]).bindings[expr[0]].type;
            if(type.tag === 'unknownType') {
                return type;
            }else if(type.tag !== 'arrowtype') {
				throw new ArrowTypeExpectedError('Function ' + expr[0]  + ' expected an arrowtype, but received ' + JSON.stringify(type));
			}
			return type.right;
		}
	};
	
	var typeExpr = function(expr, env) {
		var handler = typeByTypeHandlers[typeof expr];
		if(handler) 
			return handler(expr, env);
		else
			throw new UnknownExpression(exp);
	};
	
	var sameType = function (a, b) {
		if(a === b) {
			return true;
		} else if(a === null || b === null) {
			return false;
		} else if(a.tag === 'basetype') {
			if(b.tag === 'basetype') {
				return a.name === b.name;
			}
			return false;
		}
		if(a.tag === 'arrowtype') {
			if(b.tag === 'arrowtype') {
				return sameType(a.left, b.left) && sameType(a.right, b.right);
			}
			return false;
		}
	};
	
	var prettyType = function (type) {
		if(type === null) {
			return '-';
		} else if(Object.prototype.toString.call(type) === '[object Array]') {
			var result = [];
			for(var i in type) {
				result.push(prettyType(type[i]));
			}
			return result.join(',');
		} else if(type.tag === undefined) {
			return '-';
		}
		switch(type.tag) {
			case 'basetype':
				return type.name;
			case 'varargtype':
				return '...' + type.name;
			case 'arrowtype':
				return '(' + prettyType(type.left) + ' -> ' + prettyType(type.right) + ')';
            case 'unknownType':
                return type.tag;
			default:
				throw new Error('unknown type ' + type.tag);
			  
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
	
	var NotANumberError = function(value) {
		this.name = "NotANumberError";
		this.message = 'Value ' + value + ' is not a number';
		this.value = value;
	};
	
	NotANumberError.prototype = Error.prototype;
	
	var NotAFunctionError = function(f) {
		this.name = "NotAFunctionError";
		this.message = 'Value ' + f + ' is not a function';
		this.f = f;
	};
	
	NotAFunctionError.prototype = Error.prototype;
	
	var IllegalTypeError = function(received, expected) {
		this.name = "IllegalTypeError";
		this.message = 'Received type ' + prettyType(received) + ' but expected ' + prettyType(expected);
		this.received = received;
		this.expected = expected;
	};
	
	IllegalTypeError.prototype = Error.prototype;
	
	var NotBooleanIf = function(type) {
		this.name = "NotBooleanIf";
		this.message = 'Illegal boolean expression for if ' + prettyType(type);
		this.type = type;
	};
	
	NotBooleanIf.prototype = Error.prototype;
	
	var NotEqualTypeIf = function(atype, btype) {
		this.name = "NotEqualTypeIf";
		this.message = 'Illegal expressions in if, A type : ' + prettyType(atype) + ', B type : ' + prettyType(btype);
		this.atype = atype;
		this.btype = btype;
	};
	
	NotEqualTypeIf.prototype = Error.prototype;
	
	var ArrowTypeExpectedError = function(message) {
		this.name = "ArrowTypeExpectedError";
		this.message = message;
	};
	
	ArrowTypeExpectedError.prototype = Error.prototype;
	
	return tscheem;
})();

if (typeof module !== 'undefined') {
	module.exports = tscheem;
}