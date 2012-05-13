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
	test('(begin (define a 1) (define b 2) (if (< a b) (list 1 a) (list 2 b)))', function() {
		assert.deepEqual(
			scheem.evalScheemString('(begin (define a 1) (define b 2) (if (< a b) (list 1 a) (list 2 b)))'),
			[1, 1]
		);
	});
	test('(begin (define factorial (lambda (n) (if (= n 0) 1 (* n (factorial (- n 1)))))) (factorial 5))', function() {
		assert.deepEqual(
			scheem.evalScheemString('(begin (define factorial (lambda (n) (if (= n 0) 1 (* n (factorial (- n 1)))))) (factorial 5))'),
			120
		);
	});
	test('(begin (define fibonacci (lambda (n) (if (< n 2) n (+ (fibonacci (- n 1)) (fibonacci (- n 2)))))) (fibonacci 25))', function() {
		assert.deepEqual(
			scheem.evalScheemString('(begin (define fibonacci (lambda (n) (if (< n 2) n (+ (fibonacci (- n 1)) (fibonacci (- n 2)))))) (fibonacci 10))'),
			55
		);
	});
	test('(begin (define reverse (lambda (n) (if (= (length n) 1) n (append (reverse (cdr n)) (car n))))) (reverse (list 1 2 3 4)))', function() {
		assert.deepEqual(
			scheem.evalScheemString('(begin (define reverse (lambda (n) (if (= (length n) 1) n (append (reverse (cdr n)) (car n))))) (reverse (list 1 2 3 4)))'),
			[4, 3, 2, 1]
		);
	});
	test('(begin (define l (list 4 3 56 7)) (define find (lambda (l n) (if (= (length l) 0) #f (if (= (car l) n) #t (find (cdr l) n))))) (find l 7))', function() {
		assert.deepEqual(
			scheem.evalScheemString('(begin (define l (list 4 3 56 7)) (define find (lambda (l n) (if (= (length l) 0) #f (if (= (car l) n) #t (find (cdr l) n))))) (find l 7))'),
			'#t'
		);
	});
	test('(begin (define l (list 1 2 3)) (define c 0) (define sum (lambda (n) (set! c (+ c n)))) (define exec (lambda (l f) (begin (f (car l)) (if (> (length l) 1) (exec (cdr l) f) l)))) (exec l sum) c)', function() {
		assert.deepEqual(
			scheem.evalScheemString('(begin (define l (list 1 2 3)) (define c 0) (define sum (lambda (n) (set! c (+ c n)))) (define exec (lambda (l f) (begin (f (car l)) (if (> (length l) 1) (exec (cdr l) f) l)))) (exec l sum) c)'),
			6
		);
	});
});