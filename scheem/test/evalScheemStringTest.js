if (typeof module !== 'undefined') {
	var scheem = require('../scheem.js');
	var SCHEEM = require('../parser.js');
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