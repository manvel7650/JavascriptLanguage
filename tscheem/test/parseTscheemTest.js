if (typeof module !== 'undefined') {
	var tscheem = require('../tscheem.js');
	var assert = require('chai').assert;
} else {
	var assert = chai.assert;
}

suite('parser', function() {
	test('(+ 2 3)', function() {
		assert.deepEqual(
			tscheem.parse('(+ 2 3)'),
			['+', 2, 3]
		);
	});
	test('(+ 1 (+ 2 3))', function() {
		assert.deepEqual(
			tscheem.parse('(+ 1 (+ 2 3))'),
			['+', 1, ['+', 2, 3]]
		);
	});
	test('(+ 1\n\t( +  2   3)\n)', function() {
		assert.deepEqual(
			tscheem.parse('(+ 1\n\t( +  2   3)\n)'),
			['+', 1, ['+', 2, 3]]
		);
	});
	test('(+ 1 \'(+ 2 3))', function() {
		assert.deepEqual(
			tscheem.parse('(+ 1 \'(+ 2 3))'),
			['+', 1, ['quote', ['+', 2, 3]]]
		);
	});
	test('(+ 1\n\t\'( +  2   3)\n)', function() {
		assert.deepEqual(
			tscheem.parse('(+ 1\n\t\'( +  2   3)\n)'),
			['+', 1, ['quote', ['+', 2, 3]]]
		);
	});
	test(';; This is a comment\n(+ 1 \'(+ 2 3))', function() {
		assert.deepEqual(
			tscheem.parse(';; This is a comment\n(+ 1 \'(+ 2 3))'),
			['+', 1, ['quote', ['+', 2, 3]]]
		);
	});
	test('(+ 1 \n;; This is a comment\n\'(+ 2 3))', function() {
		assert.deepEqual(
			tscheem.parse('(+ 1 \n;; This is a comment\n\'(+ 2 3))'),
			['+', 1, ['quote', ['+', 2, 3]]]
		);
	});
});
suite('parse quote', function() {
	test('a number', function() {
		assert.deepEqual(
			tscheem.parse('\'3'),
			['quote', 3]
		);
	});
	test('an atom', function() {
		assert.deepEqual(
			tscheem.parse('(begin (define dog 3) \'dog)'),
			['begin', ['define', 'dog', 3], ['quote', 'dog']]
		);
	});
	test('a list', function() {
		assert.deepEqual(
			tscheem.parse('\'(list 1 2 3)'),
			['quote', ['list', 1, 2, 3]]
		);
	});
	test('(quote (+ 2 3)) test', function() {
		assert.deepEqual(
			tscheem.parse('\'(+ 2 3)'),
			['quote', ['+', 2, 3]]
		);
	});
	test('(quote (quote (+ 2 3))) test', function() {
		assert.deepEqual(
			tscheem.parse('\'\'(+ 2 3)'),
			['quote', ['quote', ['+', 2, 3]]]
		);
	});
});
suite('parse +-*/', function() {
	test('5 test', function() {
		assert.deepEqual(
			tscheem.parse('5'),
			5
		);
	});
	test('(+ 2 3) test', function() {
		assert.deepEqual(
			tscheem.parse('(+ 2 3)'),
			['+', 2, 3]
		);
	});
	test('(* 2 3) test', function() {
		assert.deepEqual(
			tscheem.parse('(* 2 3)'),
			['*', 2, 3]
		);
	});
	test('(/ 1 2) test', function() {
		assert.deepEqual(
			tscheem.parse('(/ 1 2)'),
			['/', 1, 2]
		);
	});
	test('(* (/ 8 4) (+ 1 1)) test', function() {
		assert.deepEqual(
			tscheem.parse('(* (/ 8 4) (+ 1 1))'),
			['*', ['/', 8, 4], ['+', 1, 1]]
		);
	});
});
suite('parse define,set!', function() {
	test('evaluation of define test', function() {
		assert.deepEqual(
			tscheem.parse('(define a 5)'),
			['define', 'a', 5]
		);
	});	
	test('evaluation of set test', function() {
		assert.deepEqual(
			tscheem.parse('(begin (define a 3) (set! a 1))'),
			['begin', ['define', 'a', 3], ['set!', 'a', 1]]
		);
	});
	test('(begin (define y 3) (set! y (+ 2 1))) test', function() {
		assert.deepEqual(
			tscheem.parse('(begin (define y 3) (set! y (+ 2 1)))'),
			['begin', ['define', 'y', 3], ['set!', 'y', ['+', 2, 1]]]
		);
	});	
});
suite('parse begin', function() {
	test('(begin 1 2 3) test', function() {
		assert.deepEqual(
			tscheem.parse('(begin 1 2 3)'),
			['begin', 1, 2, 3]
		);
	});
	test('(begin (+ 2 2)) test', function() {
		assert.deepEqual(
			tscheem.parse('(begin (+ 2 2))'),
			['begin', ['+', 2, 2]]
		);
	});
	test('(begin (define x 2) (set! x 5) (set! x (+ y x)) x) test', function() {
		assert.deepEqual(
			tscheem.parse('(begin (define x 2) (set! x 5) (set! x (+ 2 x)) x)'),
			['begin', ['define', 'x', 2], ['set!', 'x', 5], ['set!', 'x', ['+', 2, 'x']], 'x']
		);
	});
});
suite('parse <, =', function() {
	test('(< 2 2) test', function() {
		assert.deepEqual(
			tscheem.parse('(< 2 2)'),
			['<', 2, 2]
		);
	});
	test('(< 2 3) test', function() {
		assert.deepEqual(
			tscheem.parse('(< 2 3)'),
			['<', 2, 3]
		);
	});
	test('(< (+ 1 1) (+ 2 3)) test', function() {
		assert.deepEqual(
			tscheem.parse('(< (+ 1 1) (+ 2 3))'),
			['<', ['+', 1, 1], ['+', 2, 3]]
		);
	});
});
suite('parse cons,car,cdr', function() {
	test('(cons 1 (list 2 3)) test', function() {
		assert.deepEqual(
			tscheem.parse('(cons 1 (list 2 3))'),
			['cons', 1, ['list', 2, 3]]
		);
	});
	test('(cons (list 1 2) (list 3 4)) test', function() {
		assert.deepEqual(
			tscheem.parse('(cons (list 1 2) (list 3 4))'),
			['cons', ['list', 1, 2], ['list', 3, 4]]
		);
	});
	test('(car (list (list 1 2) 3 4)) test', function() {
		assert.deepEqual(
			tscheem.parse('(car (list (list 1 2) 3 4))'),
			['car', ['list', ['list', 1, 2], 3, 4]]
		);
	});
	test('(cdr (list (list 1 2) 3 4)) test', function() {
		assert.deepEqual(
			tscheem.parse('(cdr (list (list 1 2) 3 4))'),
			['cdr', ['list', ['list', 1, 2], 3, 4]]
		);
	});	
	test('(length \'(1 2 3 4)) test', function() {
		assert.deepEqual(
			tscheem.parse('(length \'(1 2 3 4))'),
			['length', ['quote', [1, 2, 3, 4]]]
		);
	});	
});
suite('parse if', function() {
	test('(if (= 1 1) 2 3) test', function() {
		assert.deepEqual(
			tscheem.parse('(if (= 1 1) 2 3)'),
			['if', ['=', 1, 1], 2, 3]
		);
	});
	test('(if (= 1 0) 2 3) test', function() {
		assert.deepEqual(
			tscheem.parse('(if (= 1 0) 2 3)'),
			['if', ['=', 1, 0], 2, 3]
		);
	});
	test('(if (= 1 1) 2 3) test', function() {
		assert.deepEqual(
			tscheem.parse('(if (= 1 1) 2 3)'),
			['if', ['=', 1, 1], 2, 3]
		);
	});
	test('(if (= 1 1) error 3) test', function() {
		assert.deepEqual(
			tscheem.parse('(if (= 1 1) 2 3)'),
			['if', ['=', 1, 1], 2, 3]
		);
	});
	test('(if (= 1 1) (if (= 2 3) 10 11) 12) test', function() {
		assert.deepEqual(
			tscheem.parse('(if (= 1 1) (if (= 2 3) 10 11) 12)'),
			['if', ['=', 1, 1], ['if', ['=', 2, 3], 10, 11], 12]
		);
	});
});
suite('parse functions', function() {
	test('(always3 5) test', function() {
		assert.deepEqual(
			tscheem.parse('(always3 5)'), 
			['always3', 5]
		);
	});
	test('(identity 5) test', function() {
		assert.deepEqual(
			tscheem.parse('(identity 5)'),
			['identity', 5]
		);
	});
	test('(plusone 5) test', function() {
		assert.deepEqual(
			tscheem.parse('(plusone 5)'),
			['plusone', 5]
		);
	});
	test('(plusone (always3 5)) test', function() {
		assert.deepEqual(
			tscheem.parse('(plusone (always3 5))'),
			['plusone', ['always3', 5]]
		);
	});
	test('(plusone (+ (plusone 2) (plusone 3))) test', function() {
		assert.deepEqual(
			tscheem.parse('(plusone (+ (plusone 2) (plusone 3)))'),
			['plusone', ['+', ['plusone', 2], ['plusone', 3]]]
		);
	});
	test('(add3 5 2 4) test', function() {
		assert.deepEqual(
			tscheem.parse('(add3 5 2 4)'),
			['add3', 5, 2, 4]
		);
	});
	test('(add3 5 2 (plusone 5)) test', function() {
		assert.deepEqual(
			tscheem.parse('(add3 5 2 (plusone 5))'),
			['add3', 5, 2, ['plusone', 5]]
		);
	});
});
suite('parse lambda', function() {
	test('((lambda (x num) x) 5) test', function() {
		assert.deepEqual(
			tscheem.parse('((lambda (x num) x) 5)'),
			[['lambda', [{atom: 'x', type: 'num'}], 'x'], 5]
		);
	});
	test('((lambda (x num) (+ x 1)) 5) test', function() {
		assert.deepEqual(
			tscheem.parse('((lambda (x num) (+ x 1)) 5)'),
			[['lambda', [{atom: 'x', type: 'num'}], ['+', 'x', 1]], 5]
		);
	});
	test('(((lambda (x num) (lambda (y num) (+ x y))) 5) 3) test', function() {
		assert.deepEqual(
			tscheem.parse('(((lambda (x num) (lambda (y num) (+ x y))) 5) 3) '),
			[[['lambda', [{atom: 'x', type: 'num'}], ['lambda', [{atom: 'y', type: 'num'}], ['+', 'x', 'y']]], 5], 3]
		);
	});
	test('(((lambda (x num) (lambda (x num) (+ x x))) 5) 3) test', function() {
		assert.deepEqual(
			tscheem.parse('(((lambda (x num) (lambda (x num) (+ x x))) 5) 3)'),
			[[['lambda', [{atom: 'x', type: 'num'}], ['lambda', [{atom: 'x', type: 'num'}], ['+', 'x', 'x']]], 5], 3]
		);
	});
	test('((lambda (x num y num) (+ x y)) 5 2) test', function() {
		assert.deepEqual(
			tscheem.parse('((lambda (x num y num) (+ x y)) 5 2)'),
			[['lambda', [{atom: 'x', type: 'num'}, {atom: 'y', type: 'num'}], ['+', 'x', 'y']], 5, 2]
		);
	});
	test('(begin (define plusone (lambda (x num) (+ x 1))) (plusone x)) test', function() {
		assert.deepEqual(
			tscheem.parse('(begin (define plusone (lambda (x num) (+ x 1))) (plusone x))'),
			['begin', ['define', 'plusone', ['lambda', [{atom: 'x', type: 'num'}], ['+', 'x', 1]]], ['plusone', 'x']]
		);
	});	
	test('(begin (define factorial (lambda (n num) (if (= n 0) 1 (* n (factorial (- n 1)))))) (factorial x)) test', function() {
		assert.deepEqual(
			tscheem.parse('(begin (define factorial (lambda (n num) (if (= n 0) 1 (* n (factorial (- n 1)))))) (factorial x))'),
			['begin', ['define', 'factorial', ['lambda', [{atom: 'n', type: 'num'}], ['if', ['=', 'n', 0], 1, ['*', 'n', ['factorial', ['-', 'n', 1]]]]]], ['factorial', 'x']]
		);
	});	
	test('(begin (define plusone (lambda (n num) (begin (set! x 25) (+ n 1)))) (plusone x)) test', function() {
		assert.deepEqual(
			tscheem.parse('(begin (define plusone (lambda (n num) (begin (set! x 25) (+ n 1)))) (plusone x))'),
			['begin', ['define', 'plusone', ['lambda', [{atom: 'n', type: 'num'}], ['begin', ['set!', 'x', 25], ['+', 'n', 1]]]], ['plusone', 'x']]
		);
	});	
	test('(begin (define delegate (lambda (n function) n)) (define plusone (lambda (n num) (+ n 1))) ((delegate plusone) 4)) test', function() {
	assert.deepEqual(
			tscheem.parse('(begin (define delegate (lambda (n function) n)) (define plusone (lambda (n num) (+ n 1))) ((delegate plusone) 4))'),
			['begin', ['define', 'delegate', ['lambda', [{atom: 'n', type: 'function'}], 'n']], ['define', 'plusone', ['lambda', [{atom: 'n', type: 'num'}], ['+', 'n', 1]]], [['delegate', 'plusone'], 4]]
		);
	});	
	
	
});

suite('parse alert', function() {
	test('(alert \'helloWorld)  test', function() {
		assert.deepEqual(
			tscheem.parse('(alert \'helloWorld)'),
			['alert', ['quote', 'helloWorld']]
		);
	});
	test('(alert (+ 3 2))  test', function() {
		assert.deepEqual(
			tscheem.parse('(alert (+ 3 2))'),
			['alert', ['+', 3, 2]]
		);
	});
});