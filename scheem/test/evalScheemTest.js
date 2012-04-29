if (typeof module !== 'undefined') {
	var scheem = require('../scheem.js');
	var assert = require('chai').assert;
} else {
	var assert = chai.assert;
}

suite('quote', function() {
	test('a number', function() {
		assert.deepEqual(
			scheem.evalScheem(['quote', 3], {}),
			3
		);
	});
	test('an atom', function() {
		assert.deepEqual(
			scheem.evalScheem(['quote', 'dog'], {}),
			'dog'
		);
	});
	test('a list', function() {
		assert.deepEqual(
			scheem.evalScheem(['quote', [1, 2, 3]], {}),
			[1, 2, 3]
		);
	});
});

suite('+-*/', function() {
	test('5 test', function() {
		assert.deepEqual(
			scheem.evalScheem(5, {}),
			5
		);
	});
	test('(+ 2 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['+', 2, 3], {}),
			5
		);
	});
	test('(* 2 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['*', 2, 3], {}),
			6
		);
	});
	test('(/ 1 2) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['/', 1, 2], {}),
			0.5
		);
	});
	test('(* (/ 8 4) (+ 1 1)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['*', ['/', 8, 4], ['+', 1, 1]], {}),
			4
		);
	});
});

suite('variable', function() {
	var env = {x:2, y:3, z:10};	
	test('x test', function() {
		assert.deepEqual(
			scheem.evalScheem('x', env),
			2
		);
	});
	test('(* y 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['*', 'y', 3], env),
			9
		);
	});
	test('(/ z (+ x y)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['/', 'z', ['+', 'x', 'y']], env),
			2
		);
	});
});

suite('define, set!', function() {
	var env = {x:2, y:3, z:10};	
	test('evaluation of define test', function() {
		assert.deepEqual(
			scheem.evalScheem(['define', 'a', 5], env),
			5
		);
	});	
	test('(define a 5) test', function() {
		assert.deepEqual(
			{x:2, y:3, z:10, a:5},
			env
		);
	});
	test('evaluation of set test', function() {
		assert.deepEqual(
			scheem.evalScheem(['set!', 'a', 1], env),
			1
		);
	});
	test('(set! a 1) test', function() {
		assert.deepEqual(
			{x:2, y:3, z:10, a:1},
			env
		);
	});	
	test('(set! x 7) test', function() {
		scheem.evalScheem(['set!', 'x', 7], env);
		assert.deepEqual(
			{x:7, y:3, z:10, a:1},
			env
		);
	});
	test('(set! y (+ x 1)) test', function() {
		scheem.evalScheem(['set!', 'y', ['+', 'x', 1]], env);
		assert.deepEqual(
			{x:7, y:8, z:10, a:1},
			env
		);
	});	
});
suite('begin', function() {
	test('(begin 1 2 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['begin', 1, 2, 3], {}),
			3
		);
	});
	test('(begin (+ 2 2)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['begin', ['+', 2, 2]], {}),
			4
		);
	});
	test('(begin x y x) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['begin', 'x', 'y', 'x'], {x:1, y:2}),
			1
		);
	});
	test('(begin (set! x 5) (set! x (+ y x) x)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['begin', ['set!', 'x', 5], ['set!', 'x', ['+', 'y', 'x']], 'x'], {x:1, y:2}),
			7
		);
	});
});
suite('<, =', function() {
	test('(< 2 2) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['<', 2, 2], {}),
			'#f'
		);
	});
	test('(< 2 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['<', 2, 3], {}),
			'#t'
		);
	});
	test('(< (+ 1 1) (+ 2 3)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['<', ['+', 1, 1], ['+', 2, 3]], {}),
			'#t'
		);
	});
});