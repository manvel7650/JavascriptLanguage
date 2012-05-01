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
	test('(+ x 3)', function() {
		assert.deepEqual(
			scheem.parse('(+ x 3)'),
			['+', 'x', 3]
		);
	});
	test('(+ 1 (+ x 3))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 (+ x 3))'),
			['+', 1, ['+', 'x', 3]]
		);
	});
	test('(+ 1\n\t( +  x   3)\n)', function() {
		assert.deepEqual(
			scheem.parse('(+ 1\n\t( +  x   3)\n)'),
			['+', 1, ['+', 'x', 3]]
		);
	});
	test('(+ 1 \'(+ x 3))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 \'(+ x 3))'),
			['+', 1, ['quote', ['+', 'x', 3]]]
		);
	});
	test('(+ 1\n\t\'\t( +  x   3)\n)', function() {
		assert.deepEqual(
			scheem.parse('(+ 1\n\t\'\t( +  x   3)\n)'),
			['+', 1, ['quote', ['+', 'x', 3]]]
		);
	});
	test(';; This is a comment\n(+ 1 \'(+ x 3))', function() {
		assert.deepEqual(
			scheem.parse(';; This is a comment\n(+ 1 \'(+ x 3))'),
			['+', 1, ['quote', ['+', 'x', 3]]]
		);
	});
	test('(+ 1 \n;; This is a comment\n\'(+ x 3))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 \n;; This is a comment\n\'(+ x 3))'),
			['+', 1, ['quote', ['+', 'x', 3]]]
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
suite('parse variable', function() {
	test('x test', function() {
		assert.deepEqual(
			scheem.parse('x'),
			'x'
		);
	});
	test('(* y 3) test', function() {
		assert.deepEqual(
			scheem.parse('(* y 3)'),
			['*', 'y', 3]
		);
	});
	test('(/ z (+ x y)) test', function() {
		assert.deepEqual(
			scheem.parse('(/ z (+ x y))'),
			['/', 'z', ['+', 'x', 'y']]
		);
	});
});
suite('parse define,set!', function() {
	test('evaluation of define test', function() {
		assert.deepEqual(
			scheem.parse('(define a 5)'),
			['define', 'a', 5]
		);
	});	
	test('evaluation of set test', function() {
		assert.deepEqual(
			scheem.parse('(set! a 1)'),
			['set!', 'a', 1]
		);
	});
	test('(set! y (+ x 1)) test', function() {
		assert.deepEqual(
			scheem.parse('(set! y (+ x 1))'),
			['set!', 'y', ['+', 'x', 1]]
		);
	});	
});
suite('parse begin', function() {
	test('(begin 1 2 3) test', function() {
		assert.deepEqual(
			scheem.parse('(begin 1 2 3)'),
			['begin', 1, 2, 3]
		);
	});
	test('(begin (+ 2 2)) test', function() {
		assert.deepEqual(
			scheem.parse('(begin (+ 2 2))'),
			['begin', ['+', 2, 2]]
		);
	});
	test('(begin x y x) test', function() {
		assert.deepEqual(
			scheem.parse('(begin x y x)'),
			['begin', 'x', 'y', 'x']
		);
	});
	test('(begin (set! x 5) (set! x (+ y x)) x) test', function() {
		assert.deepEqual(
			scheem.parse('(begin (set! x 5) (set! x (+ y x)) x)'),
			['begin', ['set!', 'x', 5], ['set!', 'x', ['+', 'y', 'x']], 'x']
		);
	});
});
suite('parse <, =', function() {
	test('(< 2 2) test', function() {
		assert.deepEqual(
			scheem.parse('(< 2 2)'),
			['<', 2, 2]
		);
	});
	test('(< 2 3) test', function() {
		assert.deepEqual(
			scheem.parse('(< 2 3)'),
			['<', 2, 3]
		);
	});
	test('(< (+ 1 1) (+ 2 3)) test', function() {
		assert.deepEqual(
			scheem.parse('(< (+ 1 1) (+ 2 3))'),
			['<', ['+', 1, 1], ['+', 2, 3]]
		);
	});
});
suite('parse cons,car,cdr', function() {
	test('(cons 1 \'(2 3)) test', function() {
		assert.deepEqual(
			scheem.parse('(cons 1 \'(2 3))'),
			['cons', 1, ['quote', [2, 3]]]
		);
	});
	test('(cons \'(1 2) \'(3 4)) test', function() {
		assert.deepEqual(
			scheem.parse('(cons \'(1 2) \'(3 4))'),
			['cons', ['quote', [1, 2]], ['quote', [3, 4]]]
		);
	});
	test('(car \'((1 2) 3 4)) test', function() {
		assert.deepEqual(
			scheem.parse('(car \'((1 2) 3 4))'),
			['car', ['quote', [[1, 2], 3, 4]]]
		);
	});
	test('(cdr \'((1 2) 3 4)) test', function() {
		assert.deepEqual(
			scheem.parse('(cdr \'((1 2) 3 4))'),
			['cdr', ['quote', [[1, 2], 3, 4]]]
		);
	});	
});
suite('parse if', function() {
	test('(if (= 1 1) 2 3) test', function() {
		assert.deepEqual(
			scheem.parse('(if (= 1 1) 2 3)'),
			['if', ['=', 1, 1], 2, 3]
		);
	});
	test('(if (= 1 0) 2 3) test', function() {
		assert.deepEqual(
			scheem.parse('(if (= 1 0) 2 3)'),
			['if', ['=', 1, 0], 2, 3]
		);
	});
	test('(if (= 1 1) 2 error) test', function() {
		assert.deepEqual(
			scheem.parse('(if (= 1 1) 2 error)'),
			['if', ['=', 1, 1], 2, 'error']
		);
	});
	test('(if (= 1 1) error 3) test', function() {
		assert.deepEqual(
			scheem.parse('(if (= 1 1) error 3)'),
			['if', ['=', 1, 1], 'error', 3]
		);
	});
	test('(if (= 1 1) (if (= 2 3) 10 11) 12) test', function() {
		assert.deepEqual(
			scheem.parse('(if (= 1 1) (if (= 2 3) 10 11) 12)'),
			['if', ['=', 1, 1], ['if', ['=', 2, 3], 10, 11], 12]
		);
	});
});