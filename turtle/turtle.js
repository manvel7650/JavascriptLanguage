// Evaluate a Tortoise program
// env is like:
// { bindings: { x: 5, ... }, outer: { } }

// Lookup a variable in an environment
var lookup = function (env, v) {
	if (!(env.hasOwnProperty('bindings')))
		throw new Error(v + " not found");
	if (env.bindings.hasOwnProperty(v))
		return env.bindings[v];
	return lookup(env.outer, v);
};

// Update existing binding in environment
var update = function (env, v, val) {
	if (env.hasOwnProperty('bindings')) {
		if (env.bindings.hasOwnProperty(v)) {
			env.bindings[v] = val;
		} else {
			update(env.outer, v, val);
		}
	} else {
		throw new Error('Undefined variable update ' + v);
	}
};

// Add a new binding to outermost level
var add_binding = function (env, v, val) {
	if(env.hasOwnProperty('bindings')) {
		env.bindings[v] = val;
	} else {
		env.bindings = {};
		env.outer = {};
		env.bindings[v] = val;
	}
};


// Evaluate a Tortoise expression, return value
var evalExpr = function (expr, env) {
	// Numbers evaluate to themselves
	if (typeof expr === 'number') {
		return expr;
	}
	// Look at tag to see what to do
	switch(expr.tag) {
		// Simple built-in binary operations
		case '<':
			return evalExpr(expr.left, env) < evalExpr(expr.right, env);
		case '<=':
			return evalExpr(expr.left, env) <= evalExpr(expr.right, env);
		case '>':
			return evalExpr(expr.left, env) > evalExpr(expr.right, env);
		case '>=':
			return evalExpr(expr.left, env) >= evalExpr(expr.right, env);
		case '==':
			return evalExpr(expr.left, env) === evalExpr(expr.right, env);
		case '!=':
			return evalExpr(expr.left, env) !== evalExpr(expr.right, env);
		case '+':
			return evalExpr(expr.left, env) + evalExpr(expr.right, env);
		case '-':
			return evalExpr(expr.left, env) - evalExpr(expr.right, env);
		case '*':
			return evalExpr(expr.left, env) * evalExpr(expr.right, env);
		case '/':
			return evalExpr(expr.left, env) / evalExpr(expr.right, env);
		// Lookup identifiers
		case 'ident':
			return lookup(env, expr.name);
		// Function calls
		case 'call':
			// Get function value (in Tortoise can only be a name)
			var func = lookup(env, expr.name);
			// Evaluate arguments to pass
			var ev_args = [];
			var i = 0;
			for(i = 0; i < expr.args.length; i++) {
				ev_args[i] = evalExpr(expr.args[i], env);
			}
			return func.apply(null, ev_args);
		// Should not get here
		default:
			throw new Error('Unknown form in AST expression ' + expr.tag);
	}
};

// Evaluate a Tortoise statement
var evalStatement = function (stmt, env) {
	var i;
	var num;
	var cond_expr;
	var val = undefined;
	// Statements always have tags
	switch(stmt.tag) {
		// A single expression
		case 'ignore':
			// Just evaluate expression
			return evalExpr(stmt.body, env);
		// Assignment
		case ':=':
			// Evaluate right hand side
			val = evalExpr(stmt.right, env);
			update(env, stmt.left, val);
			return val;
		// Declare new variable
		case 'var':
			// New variable gets default value of 0
			add_binding(env, stmt.name, 0);
			return 0;
		// Repeat
		case 'repeat':
			// Evaluate expr for number of times to repeat
			num = evalExpr(stmt.expr, env);
			// Now do a loop
			for(i = 0; i < num; i++) {
				val = evalStatements(stmt.body, env);
			}
			return val;
		// While
		case 'while':
			// do a loop
			while(true) {
				num = evalExpr(stmt.expr, env);
				// check expr
				if(num === null) break;
				if(typeof num === 'number' && num === 0) break;
				if(!num) break;
				
				val = evalStatements(stmt.body, env);
			}
			return val;
		// If
		case 'if':
			cond_expr = evalExpr(stmt.expr, env);
			val = undefined;
			if(cond_expr) {
				val = evalStatements(stmt.body, env);
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
				return evalStatements(stmt.body, new_env);
			};
			add_binding(env, stmt.name, new_func);
			return 0;
		// Should not get here
		default:
			throw new Error('Unknown form in AST statement ' + stmt.tag);
	}
};

// Evaluate a list of Tortoise statements, return undefined
var evalStatements = function (seq, env) {
	var i;
	var val = undefined;
	for(i = 0; i < seq.length; i++) {
		val = evalStatement(seq[i], env);
	}
	return val;
};


// If we are used as Node module, export symbols
if (typeof module !== 'undefined') {
	module.exports.lookup = lookup;
	module.exports.evalExpr = evalExpr;
	module.exports.evalStatement = evalStatement;
	module.exports.evalStatements = evalStatements;
}
