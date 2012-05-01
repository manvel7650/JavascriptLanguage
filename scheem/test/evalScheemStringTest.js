if (typeof module !== 'undefined') {
	var scheem = require('../scheem.js');
	var assert = require('chai').assert;
	var expect = require('chai').expect;
} else {
	var assert = chai.assert;
	var expect = chai.expect;
}

suite('interpreter', function() {
	test('(a b c)', function() {
		expect(
			function() { scheem.evalScheemString('(a b c)') }
		).to.throw(
			SCHEEM.VariableNotFoundError
		);
	});
	
	test('atom', function() {
		expect(
			function() { scheem.evalScheemString('atom') }
		).to.throw(
			SCHEEM.VariableNotFoundError
		);
	});
	test('(+ x 3)', function() {
		expect(
			function() { scheem.evalScheemString('(+ x 3)') }
		).to.throw(
			SCHEEM.VariableNotFoundError
		);
	});
});
suite('interpret quote', function() {
	test('a number', function() {
		assert.deepEqual(
			scheem.evalScheemString('\'3'),
			3
		);
	});
	test('an atom', function() {
		assert.deepEqual(
			scheem.evalScheemString('\'dog'),
			'dog'
		);
	});
	test('a list', function() {
		assert.deepEqual(
			scheem.evalScheemString('\'(1 2 3)'),
			[1, 2, 3]
		);
	});
	test('(quote (+ 2 3)) test', function() {
		assert.deepEqual(
			scheem.evalScheemString('\'(+ 2 3)'),
			['+', 2, 3]
		);
	});
	test('(quote (quote (+ 2 3))) test', function() {
		assert.deepEqual(
			scheem.evalScheemString('\'(\'(+ 2 3))'),
			['quote', ['+', 2, 3]]
		);
	});
});