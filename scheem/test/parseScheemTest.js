var PEG = require('pegjs');
var fs = require('fs');
var assert = require('chai').assert;

var parser = PEG.buildParser(
	fs.readFileSync('scheem.peg', 'ascii')
);
suite('scheem parser', function() {
	test('(a b c)', function() {
		assert.deepEqual(
			parser.parse('(a b c)'),
			['a', 'b', 'c']
		);
	});
	test('  (a  b      c  )  ', function() {
		assert.deepEqual(
			parser.parse('  (a  b      c  )  '),
			['a', 'b', 'c']
		);
	});
	test('atom', function() {
		assert.deepEqual(
			parser.parse('atom'),
			'atom'
		);
	});
	test('  atom  ', function() {
		assert.deepEqual(
			parser.parse('  atom  '),
			'atom'
		);
	});
	test('+', function() {
		assert.deepEqual(
			parser.parse('+'),
			'+'
		);
	});
	test('(+ x 3)', function() {
		assert.deepEqual(
			parser.parse('(+ x 3)'),
			['+', 'x', '3']
		);
	});
	test('(+ 1 (f x 3 y))', function() {
		assert.deepEqual(
			parser.parse('(+ 1 (f x 3 y))'),
			['+', '1', ['f', 'x', '3', 'y']]
		);
	});
	test('(+ 1\n\t( f  x   3  y )\n)', function() {
		assert.deepEqual(
			parser.parse('(+ 1\n\t( f  x   3  y )\n)'),
			['+', '1', ['f', 'x', '3', 'y']]
		);
	});
	test('(+ 1 \'(f x 3 y))', function() {
		assert.deepEqual(
			parser.parse('(+ 1 \'(f x 3 y))'),
			['+', '1', ['quote', ['f', 'x', '3', 'y']]]
		);
	});
	test('(+ 1\n\t\'\t( f  x   3  y )\n)', function() {
		assert.deepEqual(
			parser.parse('(+ 1\n\t\'\t( f  x   3  y )\n)'),
			['+', '1', ['quote', ['f', 'x', '3', 'y']]]
		);
	});
	test(';; This is a comment\n(+ 1 \'(f x 3 y))', function() {
		assert.deepEqual(
			parser.parse(';; This is a comment\n(+ 1 \'(f x 3 y))'),
			['+', '1', ['quote', ['f', 'x', '3', 'y']]]
		);
	});
	test('(+ 1 \n;; This is a comment\n\'(f x 3 y))', function() {
		assert.deepEqual(
			parser.parse('(+ 1 \n;; This is a comment\n\'(f x 3 y))'),
			['+', '1', ['quote', ['f', 'x', '3', 'y']]]
		);
	});
});