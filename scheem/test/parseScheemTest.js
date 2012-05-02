if (typeof module !== 'undefined') {
	var scheem = require('../scheem.js');
	var assert = require('chai').assert;
} else {
	var assert = chai.assert;
}

suite('parser', function() {
	test('(1 2 3)', function() {
		assert.deepEqual(
			scheem.parse('(1 2 3)'),
			[1, 2, 3]
		);
	});
	test('  (1  2      3  )  ', function() {
		assert.deepEqual(
			scheem.parse('  (1  2      3  )  '),
			[1, 2, 3]
		);
	});
	test('(+ 2 3)', function() {
		assert.deepEqual(
			scheem.parse('(+ 2 3)'),
			['+', 2, 3]
		);
	});
	test('(+ 1 (+ 2 3))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 (+ 2 3))'),
			['+', 1, ['+', 2, 3]]
		);
	});
	test('(+ 1\n\t( +  2   3)\n)', function() {
		assert.deepEqual(
			scheem.parse('(+ 1\n\t( +  2   3)\n)'),
			['+', 1, ['+', 2, 3]]
		);
	});
	test('º', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 \'(+ 2 3))'),
			['+', 1, ['quote', ['+', 2, 3]]]
		);
	});
	test('(+ 1\n\t\'\t( +  2   3)\n)', function() {
		assert.deepEqual(
			scheem.parse('(+ 1\n\t\'\t( +  2   3)\n)'),
			['+', 1, ['quote', ['+', 2, 3]]]
		);
	});
	test(';; This is a comment\n(+ 1 \'(+ 2 3))', function() {
		assert.deepEqual(
			scheem.parse(';; This is a comment\n(+ 1 \'(+ 2 3))'),
			['+', 1, ['quote', ['+', 2, 3]]]
		);
	});
	test('(+ 1 \n;; This is a comment\n\'(+ 2 3))', function() {
		assert.deepEqual(
			scheem.parse('(+ 1 \n;; This is a comment\n\'(+ 2 3))'),
			['+', 1, ['quote', ['+', 2, 3]]]
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
			scheem.parse('(begin (define dog 3) \'dog)'),
			['begin', ['define', 'dog', 3], ['quote', 'dog']]
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
			scheem.parse('\'\'(+ 2 3)'),
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
suite('parse define,set!', function() {
	test('evaluation of define test', function() {
		assert.deepEqual(
			scheem.parse('(define a 5)'),
			['define', 'a', 5]
		);
	});	
	test('evaluation of set test', function() {
		assert.deepEqual(
			scheem.parse('(begin (define a 3) (set! a 1))'),
			['begin', ['define', 'a', 3], ['set!', 'a', 1]]
		);
	});
	test('(begin (define y 3) (set! y (+ 2 1))) test', function() {
		assert.deepEqual(
			scheem.parse('(begin (define y 3) (set! y (+ 2 1)))'),
			['begin', ['define', 'y', 3], ['set!', 'y', ['+', 2, 1]]]
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
	test('(begin (define x 2) (set! x 5) (set! x (+ y x)) x) test', function() {
		assert.deepEqual(
			scheem.parse('(begin (define x 2) (set! x 5) (set! x (+ 2 x)) x)'),
			['begin', ['define', 'x', 2], ['set!', 'x', 5], ['set!', 'x', ['+', 2, 'x']], 'x']
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
	test('(if (= 1 1) 2 3) test', function() {
		assert.deepEqual(
			scheem.parse('(if (= 1 1) 2 3)'),
			['if', ['=', 1, 1], 2, 3]
		);
	});
	test('(if (= 1 1) error 3) test', function() {
		assert.deepEqual(
			scheem.parse('(if (= 1 1) 2 3)'),
			['if', ['=', 1, 1], 2, 3]
		);
	});
	test('(if (= 1 1) (if (= 2 3) 10 11) 12) test', function() {
		assert.deepEqual(
			scheem.parse('(if (= 1 1) (if (= 2 3) 10 11) 12)'),
			['if', ['=', 1, 1], ['if', ['=', 2, 3], 10, 11], 12]
		);
	});
});