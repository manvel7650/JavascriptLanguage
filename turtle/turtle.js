if (typeof module !== 'undefined') {
	var continuations = require('../continuations/continuations');
	var TURTLE = require('./parser.js');
}

var turtle = (function(){
	var turtle = {
		lookup : function (env, v) {
			if (!(env.hasOwnProperty('bindings')))
				throw new Error(v + " not found");
			if (env.bindings.hasOwnProperty(v))
				return env.bindings[v];
			return turtle.lookup(env.outer, v);
		},

		// Update existing binding in environment
		update : function (env, v, val) {
			if (env.hasOwnProperty('bindings')) {
				if (env.bindings.hasOwnProperty(v)) {
					env.bindings[v] = val;
				} else {
					turtle.update(env.outer, v, val);
				}
			} else {
				throw new Error('Undefined variable update ' + v);
			}
		},

		// Add a new binding to outermost level
		add_binding : function (env, v, val) {
			if(env.hasOwnProperty('bindings')) {
				env.bindings[v] = val;
			} else {
				env.bindings = {};
				env.outer = {};
				env.bindings[v] = val;
			}
		},

		// Evaluate a Tortoise expression, return value
		internalEvalExpr : function (expr, env, cont) {
			// Numbers evaluate to themselves
			if (typeof expr === 'number') {
				return continuations.thunk(cont, expr);
			}
			// strings evaluate to themselves
			if (typeof expr === 'string') {
				return continuations.thunk(cont, expr);
			}
			
			// Look at tag to see what to do
			switch(expr.tag) {
				// Simple built-in binary operations
				case '<':
					return continuations.thunk(turtle.internalEvalBinaryStatement, expr.left, expr.right, env, function(v1, v2) { return v1 < v2;}, cont);
				case '<=':
					return continuations.thunk(turtle.internalEvalBinaryStatement, expr.left, expr.right, env, function(v1, v2) { return v1 <= v2;}, cont);
				case '>':
					return continuations.thunk(turtle.internalEvalBinaryStatement, expr.left, expr.right, env, function(v1, v2) { return v1 > v2;}, cont);
				case '>=':
					return continuations.thunk(turtle.internalEvalBinaryStatement, expr.left, expr.right, env, function(v1, v2) { return v1 >= v2;}, cont);
				case '==':
					return continuations.thunk(turtle.internalEvalBinaryStatement, expr.left, expr.right, env, function(v1, v2) { return v1 == v2;}, cont);
				case '!=':
					return continuations.thunk(turtle.internalEvalBinaryStatement, expr.left, expr.right, env, function(v1, v2) { return v1 != v2;}, cont);
				case '+':
					return continuations.thunk(turtle.internalEvalBinaryStatement, expr.left, expr.right, env, function(v1, v2) { return v1 + v2;}, cont);
				case '-':
					return continuations.thunk(turtle.internalEvalBinaryStatement, expr.left, expr.right, env, function(v1, v2) { return v1 - v2;}, cont);
				case '*':
					return continuations.thunk(turtle.internalEvalBinaryStatement, expr.left, expr.right, env, function(v1, v2) { return v1 * v2;}, cont);
				case '/':
					return continuations.thunk(turtle.internalEvalBinaryStatement, expr.left, expr.right, env, function(v1, v2) { return v1 / v2;}, cont);
				// Lookup identifiers
				case 'ident':
					return continuations.thunk(cont, turtle.lookup(env, expr.name));
				// Function calls
				case 'call':
					// Get function value (in Tortoise can only be a name)
					var func = turtle.lookup(env, expr.name);
					// Evaluate arguments to pass
					var ev_args = [cont];
					var i= 0;
					var evalArgs = function(arg) {
						if(i > 0) {
							ev_args.push(arg);
						}
						if(i === expr.args.length) {
							return continuations.thunkArray(func, ev_args);
						} else {
							
							return continuations.thunk(turtle.internalEvalExpr, expr.args[i++], env, evalArgs);
						}
					};
					return evalArgs(undefined);
				// Should not get here
				default:
					throw new Error('Unknown form in AST expression ' + expr.tag);
			}
		},

		internalEvalBinaryStatement : function(exprLeft, exprRight, env, f, cont) {
			return continuations.thunk(turtle.internalEvalExpr, exprLeft, env, function(v1) {
				return continuations.thunk(turtle.internalEvalExpr, exprRight, env, function(v2) {
					return continuations.thunk(cont, f.call(null, v1, v2));
				});
			});
		},

		// Evaluate a Tortoise statement
		internalEvalStatement : function (stmt, env, cont) {
			// Statements always have tags
			switch(stmt.tag) {
				// A single expression
				case 'ignore':
					// Just evaluate expression
					return continuations.thunk(turtle.internalEvalExpr, stmt.body, env, cont);
				// Assignment
				case ':=':
					// Evaluate right hand side
					return turtle.internalEvalExpr(stmt.right, env, function(val) {
						turtle.update(env, stmt.left, val);
						return continuations.thunk(cont, val);
					});
					
				// Declare new variable
				case 'var':
					// New variable gets default value of 0
					turtle.add_binding(env, stmt.name, 0);
					return continuations.thunk(cont, 0);
				// Repeat
				case 'repeat':
					// Evaluate expr for number of times to repeat
					return turtle.internalEvalExpr(stmt.expr, env, function(num) {
						// Now do a loop
						var next = function(val) {
							if(num-- === 0) {
								return continuations.thunk(cont, val);
							} else {
								return continuations.thunk(turtle.internalEvalStatements, stmt.body, env, next);
							}
						};
						return next(undefined);
					});
				// While
				case 'while':
					// do a loop
					var next = function(val) {
						return turtle.internalEvalExpr(stmt.expr, env, function(num) {
							// check expr
							if(num === null || (typeof num === 'number' && num === 0) || !num) {
								return continuations.thunk(cont, val);
							} else {
								return continuations.thunk(turtle.internalEvalStatements, stmt.body, env, next);
							}
						});
					};
					return next(undefined);
					
				// If
				case 'if':
					return turtle.internalEvalExpr(stmt.expr, env, function(cond_expr) {
						if(cond_expr) {
							return continuations.thunk(turtle.internalEvalStatements, stmt.body, env, cont);
						} else {
							return continuations.thunk(cont, undefined);
						}
					});
				// Define new function
				case 'define':
					// name args body
					var new_func = function() {
						// This function takes any number of arguments
						var i;
						var new_env;
						var new_bindings;
						new_bindings = { };
						for(i = 0; i < stmt.args.length; i++) {
							new_bindings[stmt.args[i]] = arguments[i + 1];
						}
						new_env = { bindings: new_bindings, outer: env };
						return continuations.thunk(turtle.internalEvalStatements, stmt.body, new_env, arguments[0]);
					};
					turtle.add_binding(env, stmt.name, new_func);
					return continuations.thunk(cont, 0);
				// Should not get here
				default:
					throw new Error('Unknown form in AST statement ' + stmt.tag);
			}
		},

		// Evaluate a list of Tortoise statements, return undefined
		internalEvalStatements : function (seq, env, cont) {
			var i = 0;
			var next = function(val) {
				if(i >= seq.length) {
					return continuations.thunk(cont, val);
				} else {
					return continuations.thunk(turtle.internalEvalStatement, seq[i++], env, next);
				}
			}
			return next(undefined);
		},
		
		evalExpr : function (expr, env) {
			var state = { 
				data: turtle.internalEvalExpr(expr, env, continuations.thunkValue),
				done: false
			};
			while(!state.done) {
				continuations.step(state);
			}
			return state.data;
		},
		
		evalStatement : function (stmt, env) {
			var state = { 
				data: turtle.internalEvalStatement(stmt, env, continuations.thunkValue),
				done: false
			};
			while(!state.done) {
				continuations.step(state);
			}
			return state.data;
		},
		
		evalStatements : function(seq, env) {
			var state = { 
				data: turtle.internalEvalStatements(seq, env, continuations.thunkValue),
				done: false
			};
			while(!state.done) {
				continuations.step(state);
			}
			return state.data;
		}

	};
	return turtle;
})();

// If we are used as Node module, export symbols
if (typeof module !== 'undefined') {
	module.exports = turtle;
}
