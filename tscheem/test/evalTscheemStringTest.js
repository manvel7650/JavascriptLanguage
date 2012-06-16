if (typeof module !== 'undefined') {
	var tscheem = require('../tscheem.js');
	var TSCHEEM = require('../parser.js');
	var assert = require('chai').assert;
	var expect = require('chai').expect;
} else {
	var assert = chai.assert;
	var expect = chai.expect;
}

suite('interpreter', function() {
	test('(a b c)', function() {
		expect(
			function() { tscheem.evalTscheemString('(a b c)') }
		).to.throw(
			TSCHEEM.VariableNotFoundError
		);
	});	
	test('atom', function() {
		expect(
			function() { tscheem.evalTscheemString('atom') }
		).to.throw(
			TSCHEEM.VariableNotFoundError
		);
	});
	test('(+ x 3)', function() {
		expect(
			function() { tscheem.evalTscheemString('(+ x 3)') }
		).to.throw(
			TSCHEEM.VariableNotFoundError
		);
	});
	test('(begin (define a 1) (define b 2) (if (< a b) (list 1 a) (list 2 b)))', function() {
		assert.deepEqual(
			tscheem.evalTscheemString('(begin (define a 1) (define b 2) (if (< a b) (list 1 a) (list 2 b)))'),
			[1, 1]
		);
	});
	test('(begin (define factorial (lambda (n num) (if (= n 0) 1 (* n (factorial (- n 1)))))) (factorial 5))', function() {
		assert.deepEqual(
			tscheem.evalTscheemString('(begin (define factorial (lambda (n num) (if (= n 0) 1 (* n (factorial (- n 1)))))) (factorial 5))'),
			120
		);
	});
	test('(begin (define fibonacci (lambda (n num) (if (< n 2) n (+ (fibonacci (- n 1)) (fibonacci (- n 2)))))) (fibonacci 25))', function() {
		assert.deepEqual(
			tscheem.evalTscheemString('(begin (define fibonacci (lambda (n num) (if (< n 2) n (+ (fibonacci (- n 1)) (fibonacci (- n 2)))))) (fibonacci 10))'),
			55
		);
	});
	test('(begin (define reverse (lambda (n list) (if (= (length n) 1) n (append (reverse (cdr n)) (car n))))) (reverse (list 1 2 3 4)))', function() {
		assert.deepEqual(
			tscheem.evalTscheemString('(begin (define reverse (lambda (n list) (if (= (length n) 1) n (append (reverse (cdr n)) (car n))))) (reverse (list 1 2 3 4)))'),
			[4, 3, 2, 1]
		);
	});
	test('(begin (define l (list 4 3 56 7)) (define find (lambda (l list n num) (if (= (length l) 0) #f (if (= (car l) n) #t (find (cdr l) n))))) (find l 7))', function() {
		assert.deepEqual(
			tscheem.evalTscheemString('(begin (define l (list 4 3 56 7)) (define find (lambda (l list n num) (if (= (length l) 0) #f (if (= (car l) n) #t (find (cdr l) n))))) (find l 7))'),
			'#t'
		);
	});
	test('(begin (define l (list 1 2 3)) (define c 0) (define sum (lambda (n list) (set! c (+ c n)))) (define exec (lambda (l list f function) (begin (f (car l)) (if (> (length l) 1) (exec (cdr l) f) l)))) (exec l sum) c)', function() {
		assert.deepEqual(
			tscheem.evalTscheemString('(begin (define l (list 1 2 3)) (define c 0) (define sum (lambda (n list) (set! c (+ c n)))) (define exec (lambda (l list f function) (begin (f (car l)) (if (> (length l) 1) (exec (cdr l) f) l)))) (exec l sum) c)'),
			6
		);
	});
});