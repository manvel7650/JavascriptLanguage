if (typeof module !== 'undefined') {
	var scheem = require('../scheem.js');
	var assert = require('chai').assert;
} else {
	var assert = chai.assert;
}

suite('scheem parser', function() {
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
			['+', 'x', '3']
		);
	});
	test('(+ 1 (f x 3 y))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 (f x 3 y))'),
			['+', '1', ['f', 'x', '3', 'y']]
		);
	});
	test('(+ 1\n\t( f  x   3  y )\n)', function() {
		assert.deepEqual(
			scheem.parse('(+ 1\n\t( f  x   3  y )\n)'),
			['+', '1', ['f', 'x', '3', 'y']]
		);
	});
	test('(+ 1 \'(f x 3 y))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 \'(f x 3 y))'),
			['+', '1', ['quote', ['f', 'x', '3', 'y']]]
		);
	});
	test('(+ 1\n\t\'\t( f  x   3  y )\n)', function() {
		assert.deepEqual(
			scheem.parse('(+ 1\n\t\'\t( f  x   3  y )\n)'),
			['+', '1', ['quote', ['f', 'x', '3', 'y']]]
		);
	});
	test(';; This is a comment\n(+ 1 \'(f x 3 y))', function() {
		assert.deepEqual(
			scheem.parse(';; This is a comment\n(+ 1 \'(f x 3 y))'),
			['+', '1', ['quote', ['f', 'x', '3', 'y']]]
		);
	});
	test('(+ 1 \n;; This is a comment\n\'(f x 3 y))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 \n;; This is a comment\n\'(f x 3 y))'),
			['+', '1', ['quote', ['f', 'x', '3', 'y']]]
		);
	});
});