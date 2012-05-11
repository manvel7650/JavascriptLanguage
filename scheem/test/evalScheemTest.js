if (typeof module !== 'undefined') {
	var scheem = require('../scheem.js');
	var assert = require('chai').assert;
	var expect = require('chai').expect;
} else {
	var assert = chai.assert;
	var expect = chai.expect;
}

suite('eval quote', function() {
	test('a number', function() {
		assert.deepEqual(
			scheem.evalScheem(['quote', 3], {}),
			3
		);
	});
	test('an atom', function() {
		assert.deepEqual(
			scheem.evalScheem(['quote', 'dog'], {}),
			'dog'
		);
	});
	test('a list', function() {
		assert.deepEqual(
			scheem.evalScheem(['quote', [1, 2, 3]], {}),
			[1, 2, 3]
		);
	});
	test('(quote (+ 2 3)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['quote', ['+', 2, 3]], {}),
			['+', 2, 3]
		);
	});
	test('(quote (quote (+ 2 3))) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['quote', ['quote', ['+', 2, 3]]], {}),
			['quote', ['+', 2, 3]]
		);
	});
});
suite('eval +-*/', function() {
	test('5 test', function() {
		assert.deepEqual(
			scheem.evalScheem(5, {}),
			5
		);
	});
	test('(+ 2 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['+', 2, 3], {}),
			5
		);
	});
	test('(* 2 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['*', 2, 3], {}),
			6
		);
	});
	test('(/ 1 2) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['/', 1, 2], {}),
			0.5
		);
	});
	test('(* (/ 8 4) (+ 1 1)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['*', ['/', 8, 4], ['+', 1, 1]], {}),
			4
		);
	});
});
suite('eval variable', function() {
	var env = { bindings: {x:2, y:3, z:10} };	
	test('x test', function() {
		assert.deepEqual(
			scheem.evalScheem('x', env),
			2
		);
	});
	test('(* y 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['*', 'y', 3], env),
			9
		);
	});
	test('(/ z (+ x y)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['/', 'z', ['+', 'x', 'y']], env),
			2
		);
	});
});
suite('eval define,set!', function() {
	var env = {bindings: {x:2, y:3, z:10}};	
	test('evaluation of define test', function() {
		assert.deepEqual(
			scheem.evalScheem(['define', 'a', 5], env),
			5
		);
	});	
	test('(define a 5) test', function() {
		assert.deepEqual(
			{bindings: {x:2, y:3, z:10, a:5}},
			env
		);
	});
	test('evaluation of set test', function() {
		assert.deepEqual(
			scheem.evalScheem(['set!', 'a', 1], env),
			1
		);
	});
	test('(set! a 1) test', function() {
		assert.deepEqual(
			{bindings: {x:2, y:3, z:10, a:1}},
			env
		);
	});	
	test('(set! x 7) test', function() {
		scheem.evalScheem(['set!', 'x', 7], env);
		assert.deepEqual(
			{bindings: {x:7, y:3, z:10, a:1}},
			env
		);
	});
	test('(set! y (+ x 1)) test', function() {
		scheem.evalScheem(['set!', 'y', ['+', 'x', 1]], env);
		assert.deepEqual(
			{bindings: {x:7, y:8, z:10, a:1}},
			env
		);
	});	
});
suite('eval begin', function() {
	test('(begin 1 2 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['begin', 1, 2, 3], {}),
			3
		);
	});
	test('(begin (+ 2 2)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['begin', ['+', 2, 2]], {}),
			4
		);
	});
	test('(begin x y x) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['begin', 'x', 'y', 'x'], {bindings: {x:1, y:2}}),
			1
		);
	});
	test('(begin (set! x 5) (set! x (+ y x)) x) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['begin', ['set!', 'x', 5], ['set!', 'x', ['+', 'y', 'x']], 'x'], {bindings: {x:1, y:2}}),
			7
		);
	});
});
suite('eval <, =', function() {
	test('(< 2 2) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['<', 2, 2], {}),
			'#f'
		);
	});
	test('(< 2 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['<', 2, 3], {}),
			'#t'
		);
	});
	test('(< (+ 1 1) (+ 2 3)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['<', ['+', 1, 1], ['+', 2, 3]], {}),
			'#t'
		);
	});
});
suite('eval cons,car,cdr', function() {
	test('(cons 1 \'(2 3)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['cons', 1, ['quote', [2, 3]]], {}),
			[1, 2, 3]
		);
	});
	test('(cons \'(1 2) \'(3 4)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}),
			[[1, 2], 3, 4]
		);
	});
	test('(car \'((1 2) 3 4)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['car', ['quote', [[1, 2], 3, 4]]], {}),
			[1, 2]
		);
	});
	test('(cdr \'((1 2) 3 4)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['cdr', ['quote', [[1, 2], 3, 4]]], {}),
			[3, 4]
		);
	});	
});
suite('eval if', function() {
	test('(if (= 1 1) 2 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['if', ['=', 1, 1], 2, 3], {}),
			2
		);
	});
	test('(if (= 1 0) 2 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['if', ['=', 1, 0], 2, 3], {}),
			3
		);
	});
	test('(if (= 1 1) 2 error) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['if', ['=', 1, 1], 2, 'error'], {}),
			2
		);
	});
	test('(if (= 1 1) error 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['if', ['=', 1, 0], 'error', 3], {}),
			3
		);
	});
	test('(if (= 1 1) (if (= 2 3) 10 11) 12) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['if', ['=', 1, 1], ['if', ['=', 2, 3], 10, 11], 12], {}),
			11
		);
	});
});
suite('eval functions', function() {
	var always3 = function (x) { return 3; };
	var identity = function (x) { return x; };
	var plusone = function (x) { return x + 1; };
	var add3 = function (x, y, z) { return x + y + z;};
	var env = {
		bindings: {
			'always3': always3,
			'identity': identity,
			'plusone': plusone,
			'add3': add3
		}, outer: { }
	};
	test('(always3 5) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['always3', 5], env),
			3
		);
	});
	test('(identity 5) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['identity', 5], env),
			5
		);
	});
	test('(plusone 5) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['plusone', 5], env),
			6
		);
	});
	test('(plusone (always3 5)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['plusone', ['always3', 5]], env),
			4
		);
	});
	test('(plusone (+ (plusone 2) (plusone 3))) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['plusone', ['+', ['plusone', 2], ['plusone', 3]]], env),
			8
		);
	});
	test('(add3 5 2 4) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['add3', 5, 2, 4], env),
			11
		);
	});
	test('(add3 5 2 (plusone 5)) test', function() {
		assert.deepEqual(
			scheem.evalScheem(['add3', 5, 2, ['plusone', 5]], env),
			13
		);
	});
});
suite('eval lambda', function() {
	test('((lambda (x) x) 5) test', function() {
		assert.deepEqual(
			scheem.evalScheem([['lambda', ['x'], 'x'], 5], { }),
			5
		);
	});
	test('((lambda (x) (+ x 1)) 5) test', function() {
		assert.deepEqual(
			scheem.evalScheem([['lambda', ['x'], ['+', 'x', 1]], 5], { }),
			6
		);
	});
	test('(((lambda (x) (lambda (y) (+ x y))) 5) 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem([[['lambda', ['x'], ['lambda', ['y'], ['+', 'x', 'y']]], 5], 3], { }),
			8
		);
	});
	test('(((lambda (x) (lambda x (+ x x))) 5) 3) test', function() {
		assert.deepEqual(
			scheem.evalScheem([[['lambda', ['x'], ['lambda', ['x'], ['+', 'x', 'x']]], 5], 3], { }),
			6
		);
	});
	test('((lambda (x y) (+ x y)) 5 2) test', function() {
		assert.deepEqual(
			scheem.evalScheem([['lambda', ['x', 'y'], ['+', 'x', 'y']], 5, 2], { }),
			7
		);
	});
	test('(begin (define plusone (lambda (x) (+ x 1))) (plusone x)) test', function() {
		var env = {
			bindings: { x: 5}
		};
		assert.deepEqual(
			scheem.evalScheem(['begin', ['define', 'plusone', ['lambda', ['x'], ['+', 'x', 1]]], ['plusone', 'x']], env),
			6
		);
		assert.deepEqual(
			env.bindings['x'],
			5
		);
	});	
	test('(begin (define factorial (lambda (n) (if (= n 0) 1 (* n (factorial (- n 1)))))) (factorial x)) test', function() {
		var env = {
			bindings: { x: 5}
		};
		assert.deepEqual(
			scheem.evalScheem(['begin', ['define', 'factorial', ['lambda', ['n'], ['if', ['=', 'n', 0], 1, ['*', 'n', ['factorial', ['-', 'n', 1]]]]]], ['factorial', 'x']], env),
			120
		);
		assert.deepEqual(
			env.bindings['x'],
			5
		);
	});	
	test('(begin (define plusone (lambda (n) (begin (set! x 25) (+ n 1)))) (plusone x)) test', function() {
		var env = {
			bindings: { x: 5}
		};
		assert.deepEqual(
			scheem.evalScheem(['begin', ['define', 'plusone', ['lambda', ['n'], ['begin', ['set!', 'x', 25], ['+', 'n', 1]]]], ['plusone', 'x']], env),
			6
		);
		assert.deepEqual(
			env.bindings['x'],
			25
		);
	});	
	test('(begin (define delegate (lambda (n) (n))) (define plusone (lambda (n) (+ n 1))) ((delegate plusone) 4)) test', function() {
	assert.deepEqual(
			scheem.evalScheem(['begin', ['define', 'delegate', ['lambda', ['n'], 'n']], ['define', 'plusone', ['lambda', ['n'], ['+', 'n', 1]]], [['delegate', 'plusone'], 4]], {}),
			5
		);
	});	
	
	
});
suite('eval let', function() {
	test('(let ((x (+ 3 1))) (+ (let ((x 3)) x) (let ((y 4)) x)))  test', function() {
		assert.deepEqual(
			scheem.evalScheem(['let', [['x', ['+', 3, 1]]], ['+', ['let',[['x', 3]], 'x'], ['let',[['y', 4]], 'x']]], { }),
			7
		);
	});
});
if (typeof module !== 'undefined') {
	suite('eval alert', function() {
		test('(alert \'hello-world)  test', function() {
			assert.deepEqual(
				scheem.evalScheem(['alert', ['quote', 'hello-world']], { }),
				'hello-world'
			);
		});
		expect(
			function() { scheem.evalScheem(['alert', 'hello-world'], { }) }
		).to.throw(
			scheem.VariableNotFoundError
		);
		test('(alert (+ 3 2))  test', function() {
			assert.deepEqual(
				scheem.evalScheem(['alert', ['+', 3, 2]], { }),
				5
			);
		});
	});
}