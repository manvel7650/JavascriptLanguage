if (typeof module !== 'undefined') {
	var scheem = require('../scheem.js');
	var assert = require('chai').assert;
} else {
	var assert = chai.assert;
}

suite('parser', function() {
	test('(a b c)', function() {
		assert.deepEqual(
			scheem.parse('(a b c)'),
			['a', 'b', 'c']
		);
	});
	test('  (a  b      c  )  ', function() {
		assert.deepEqual(
			scheem.parse('  (a  b      c  )  '),
			['a', 'b', 'c']
		);
	});
	test('atom', function() {
		assert.deepEqual(
			scheem.parse('atom'),
			'atom'
		);
	});
	test('  atom  ', function() {
		assert.deepEqual(
			scheem.parse('  atom  '),
			'atom'
		);
	});
	test('+', function() {
		assert.deepEqual(
			scheem.parse('+'),
			'+'
		);
	});
	test('(+ x 3)', function() {
		assert.deepEqual(
			scheem.parse('(+ x 3)'),
			['+', 'x', 3]
		);
	});
	test('(+ 1 (f x 3 y))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 (f x 3 y))'),
			['+', 1, ['f', 'x', 3, 'y']]
		);
	});
	test('(+ 1\n\t( f  x   3  y )\n)', function() {
		assert.deepEqual(
			scheem.parse('(+ 1\n\t( f  x   3  y )\n)'),
			['+', 1, ['f', 'x', 3, 'y']]
		);
	});
	test('(+ 1 \'(f x 3 y))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 \'(f x 3 y))'),
			['+', 1, ['quote', ['f', 'x', 3, 'y']]]
		);
	});
	test('(+ 1\n\t\'\t( f  x   3  y )\n)', function() {
		assert.deepEqual(
			scheem.parse('(+ 1\n\t\'\t( f  x   3  y )\n)'),
			['+', 1, ['quote', ['f', 'x', 3, 'y']]]
		);
	});
	test(';; This is a comment\n(+ 1 \'(f x 3 y))', function() {
		assert.deepEqual(
			scheem.parse(';; This is a comment\n(+ 1 \'(f x 3 y))'),
			['+', 1, ['quote', ['f', 'x', 3, 'y']]]
		);
	});
	test('(+ 1 \n;; This is a comment\n\'(f x 3 y))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 \n;; This is a comment\n\'(f x 3 y))'),
			['+', 1, ['quote', ['f', 'x', 3, 'y']]]
		);
	});
});
suite('parse quote', function() {
	test('a number', function() {
		assert.deepEqual(
			scheem.parse('\'3'),
			['quote', 3]
		);
	});
	test('an atom', function() {
		assert.deepEqual(
			scheem.parse('\'dog'),
			['quote', 'dog']
		);
	});
	test('a list', function() {
		assert.deepEqual(
			scheem.parse('\'(1 2 3)'),
			['quote', [1, 2, 3]]
		);
	});
	test('(quote (+ 2 3)) test', function() {
		assert.deepEqual(
			scheem.parse('\'(+ 2 3)'),
			['quote', ['+', 2, 3]]
		);
	});
	test('(quote (quote (+ 2 3))) test', function() {
		assert.deepEqual(
			scheem.parse('\'(\'(+ 2 3))'),
			['quote', ['quote', ['+', 2, 3]]]
		);
	});
});
suite('parse +-*/', function() {
	test('5 test', function() {
		assert.deepEqual(
			scheem.parse('5'),
			5
		);
	});
	test('(+ 2 3) test', function() {
		assert.deepEqual(
			scheem.parse('(+ 2 3)'),
			['+', 2, 3]
		);
	});
	test('(* 2 3) test', function() {
		assert.deepEqual(
			scheem.parse('(* 2 3)'),
			['*', 2, 3]
		);
	});
	test('(/ 1 2) test', function() {
		assert.deepEqual(
			scheem.parse('(/ 1 2)'),
			['/', 1, 2]
		);
	});
	test('(* (/ 8 4) (+ 1 1)) test', function() {
		assert.deepEqual(
			scheem.parse('(* (/ 8 4) (+ 1 1))'),
			['*', ['/', 8, 4], ['+', 1, 1]]
		);
	});
});