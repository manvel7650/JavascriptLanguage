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
		evalExpr : function (expr, env) {
			// Numbers evaluate to themselves
			if (typeof expr === 'number') {
				return expr;
			}
			// Look at tag to see what to do
			switch(expr.tag) {
				// Simple built-in binary operations
				case '<':
					return turtle.evalExpr(expr.left, env) < turtle.evalExpr(expr.right, env);
				case '<=':
					return turtle.evalExpr(expr.left, env) <= turtle.evalExpr(expr.right, env);
				case '>':
					return turtle.evalExpr(expr.left, env) > turtle.evalExpr(expr.right, env);
				case '>=':
					return turtle.evalExpr(expr.left, env) >= turtle.evalExpr(expr.right, env);
				case '==':
					return turtle.evalExpr(expr.left, env) === turtle.evalExpr(expr.right, env);
				case '!=':
					return turtle.evalExpr(expr.left, env) !== turtle.evalExpr(expr.right, env);
				case '+':
					return turtle.evalExpr(expr.left, env) + turtle.evalExpr(expr.right, env);
				case '-':
					return turtle.evalExpr(expr.left, env) - turtle.evalExpr(expr.right, env);
				case '*':
					return turtle.evalExpr(expr.left, env) * turtle.evalExpr(expr.right, env);
				case '/':
					return turtle.evalExpr(expr.left, env) / turtle.evalExpr(expr.right, env);
				// Lookup identifiers
				case 'ident':
					return turtle.lookup(env, expr.name);
				// Function calls
				case 'call':
					// Get function value (in Tortoise can only be a name)
					var func = turtle.lookup(env, expr.name);
					// Evaluate arguments to pass
					var ev_args = [];
					var i = 0;
					for(i = 0; i < expr.args.length; i++) {
						ev_args[i] = turtle.evalExpr(expr.args[i], env);
					}
					return func.apply(null, ev_args);
				// Should not get here
				default:
					throw new Error('Unknown form in AST expression ' + expr.tag);
			}
		},

		// Evaluate a Tortoise statement
		evalStatement : function (stmt, env) {
			var i;
			var num;
			var cond_expr;
			var val = undefined;
			// Statements always have tags
			switch(stmt.tag) {
				// A single expression
				case 'ignore':
					// Just evaluate expression
					return turtle.evalExpr(stmt.body, env);
				// Assignment
				case ':=':
					// Evaluate right hand side
					val = turtle.evalExpr(stmt.right, env);
					turtle.update(env, stmt.left, val);
					return val;
				// Declare new variable
				case 'var':
					// New variable gets default value of 0
					turtle.add_binding(env, stmt.name, 0);
					return 0;
				// Repeat
				case 'repeat':
					// Evaluate expr for number of times to repeat
					num = turtle.evalExpr(stmt.expr, env);
					// Now do a loop
					for(i = 0; i < num; i++) {
						val = turtle.evalStatements(stmt.body, env);
					}
					return val;
				// While
				case 'while':
					// do a loop
					while(true) {
						num = turtle.evalExpr(stmt.expr, env);
						// check expr
						if(num === null) break;
						if(typeof num === 'number' && num === 0) break;
						if(!num) break;
						
						val = turtle.evalStatements(stmt.body, env);
					}
					return val;
				// If
				case 'if':
					cond_expr = turtle.evalExpr(stmt.expr, env);
					val = undefined;
					if(cond_expr) {
						val = turtle.evalStatements(stmt.body, env);
					}
					return val;
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
							new_bindings[stmt.args[i]] = arguments[i];
						}
						new_env = { bindings: new_bindings, outer: env };
						return turtle.evalStatements(stmt.body, new_env);
					};
					turtle.add_binding(env, stmt.name, new_func);
					return 0;
				// Should not get here
				default:
					throw new Error('Unknown form in AST statement ' + stmt.tag);
			}
		},

		// Evaluate a list of Tortoise statements, return undefined
		evalStatements : function (seq, env) {
			var i;
			var val = undefined;
			for(i = 0; i < seq.length; i++) {
				val = turtle.evalStatement(seq[i], env);
			}
			return val;
		}
	};
	return turtle;
})();

// If we are used as Node module, export symbols
if (typeof module !== 'undefined') {
	module.exports = turtle;
}
