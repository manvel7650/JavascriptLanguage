var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

fs.readFile('scheme.peg', 'ascii', function(err, data) {
	// Create my parser
	var parse = wrapExceptions(PEG.buildParser(data).parse);
	var deepEqual = wrapAssertion(assert.deepEqual);
	// Do tests
	deepEqual(parse("(a b c)"), ["a", "b", "c"], "(a b c)");
	deepEqual(parse("  (a  b      c  )  "), ["a", "b", "c"], "  (a  b      c  )  ");
	deepEqual(parse("atom"), "atom", "atom");
	deepEqual(parse("  atom  "), "atom", "   atom  ");
	deepEqual(parse("+"), "+", "+");
	deepEqual(parse("(+ x 3)"), ["+", "x", "3"], "(+ x 3)");
	deepEqual(parse("(+ 1 (f x 3 y))"), ["+", "1", ["f", "x", "3", "y"]], "(+ (1 (f x 3 y))");
	deepEqual(parse("(+ 1\n\t( f  x   3  y )\n)"), ["+", "1", ["f", "x", "3", "y"]], "(+ 1\n\t( f  x   3  y )\n)");
	deepEqual(parse("(+ 1 '(f x 3 y))"), ["+", "1", ["quote", ["f", "x", "3", "y"]]], "(+ 1 '(f x 3 y))");
	deepEqual(parse("(+ 1\n\t'\t( f  x   3  y )\n)"), ["+", "1", ["quote", ["f", "x", "3", "y"]]], "(+ 1\n\t'\t( f  x   3  y )\n)");
	deepEqual(parse(";; This is a comment\n(+ 1 '(f x 3 y))"), ["+", "1", ["quote", ["f", "x", "3", "y"]]], ";; This is a comment\n(+ 1 '(f x 3 y))");
	deepEqual(parse("(+ 1 \n;; This is a comment\n'(f x 3 y))"), ["+", "1", ["quote", ["f", "x", "3", "y"]]], "(+ 1 \n;; This is a comment\n'(f x 3 y))");
});

var wrapExceptions = function(f) {
	return function(x) {
		try {
			return f(x);
		}
		catch(err) {
			console.log("PARSING FAILED: " + err);
			return undefined;
		}
	};
};

var wrapAssertion = function(f) {
	return function(actual, expected, message) {
		try {
			f(actual, expected, message);
			console.log("SUCCESS: " + message);
		}
		catch(err) {
			console.log("FAILED: " + err.message + ". Actual -> " + actual + ", expected -> " + expected);
		}
	}
}