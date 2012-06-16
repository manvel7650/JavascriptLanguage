if (typeof module !== 'undefined') {
	var tscheem = require('../tscheem.js');
	var assert = require('chai').assert;
	var expect = require('chai').expect;
} else {
	var assert = chai.assert;
	var expect = chai.expect;
}

suite('eval quote', function() {
	test('a number', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['quote', 3], {}),
			3
		);
	});
	test('an atom', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['quote', 'dog'], {}),
			'dog'
		);
	});
	test('a list', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['quote', [1, 2, 3]], {}),
			[1, 2, 3]
		);
	});
	test('(quote (+ 2 3)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['quote', ['+', 2, 3]], {}),
			['+', 2, 3]
		);
	});
	test('(quote (quote (+ 2 3))) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['quote', ['quote', ['+', 2, 3]]], {}),
			['quote', ['+', 2, 3]]
		);
	});
});
suite('eval +-*/', function() {
	test('5 test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(5, {}),
			5
		);
	});
	test('(+ 2 3) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['+', 2, 3], {}),
			5
		);
	});
	test('(* 2 3) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['*', 2, 3], {}),
			6
		);
	});
	test('(/ 1 2) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['/', 1, 2], {}),
			0.5
		);
	});
	test('(* (/ 8 4) (+ 1 1)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['*', ['/', 8, 4], ['+', 1, 1]], {}),
			4
		);
	});
});
suite('eval variable', function() {
	var env = { bindings: 
		{
			x: {
				value: 2,
				type: {tag: 'basetype', name: 'num'}
			}, 
			y: {
				value: 3,
				type: {tag: 'basetype', name: 'num'}
			}, 
			z: {
				value: 10,
				type: {tag: 'basetype', name: 'num'}
			}
		}
	};
	test('x test', function() {
		assert.deepEqual(
			tscheem.evalTscheem('x', env),
			2
		);
	});
	test('(* y 3) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['*', 'y', 3], env),
			9
		);
	});
	test('(/ z (+ x y)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['/', 'z', ['+', 'x', 'y']], env),
			2
		);
	});
});
suite('eval define,set!', function() {
	var env = { bindings: 
		{
			x: {
				value: 2,
				type: {tag: 'basetype', name: 'num'}
			}, 
			y: {
				value: 3,
				type: {tag: 'basetype', name: 'num'}
			}, 
			z: {
				value: 10,
				type: {tag: 'basetype', name: 'num'}
			}
		}
	};
	test('evaluation of define test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['define', 'a', 5], env),
			5
		);
	});	
	test('(define a 5) test', function() {
		assert.deepEqual(
			{ bindings: 
				{
					x: {
						value: 2,
						type: {tag: 'basetype', name: 'num'}
					}, 
					y: {
						value: 3,
						type: {tag: 'basetype', name: 'num'}
					}, 
					z: {
						value: 10,
						type: {tag: 'basetype', name: 'num'}
					},
					a: {
						value: 5,
						type: {tag: 'basetype', name: 'num'}
					}
				}
			},
			env
		);
	});
	test('evaluation of set test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['set!', 'a', 1], env),
			1
		);
	});
	test('(set! a 1) test', function() {
		assert.deepEqual(
			{ bindings: 
				{
					x: {
						value: 2,
						type: {tag: 'basetype', name: 'num'}
					}, 
					y: {
						value: 3,
						type: {tag: 'basetype', name: 'num'}
					}, 
					z: {
						value: 10,
						type: {tag: 'basetype', name: 'num'}
					},
					a: {
						value: 1,
						type: {tag: 'basetype', name: 'num'}
					}
				}
			},
			env
		);
	});	
	test('(set! x 7) test', function() {
		tscheem.evalTscheem(['set!', 'x', 7], env);
		assert.deepEqual(
			{ bindings: 
				{
					x: {
						value: 7,
						type: {tag: 'basetype', name: 'num'}
					}, 
					y: {
						value: 3,
						type: {tag: 'basetype', name: 'num'}
					}, 
					z: {
						value: 10,
						type: {tag: 'basetype', name: 'num'}
					},
					a: {
						value: 1,
						type: {tag: 'basetype', name: 'num'}
					}
				}
			},
			env
		);
	});
	test('(set! y (+ x 1)) test', function() {
		tscheem.evalTscheem(['set!', 'y', ['+', 'x', 1]], env);
		assert.deepEqual(
			{ bindings: 
				{
					x: {
						value: 7,
						type: {tag: 'basetype', name: 'num'}
					}, 
					y: {
						value: 8,
						type: {tag: 'basetype', name: 'num'}
					}, 
					z: {
						value: 10,
						type: {tag: 'basetype', name: 'num'}
					},
					a: {
						value: 1,
						type: {tag: 'basetype', name: 'num'}
					}
				}
			},
			env
		);
	});	
});
suite('eval begin', function() {
	test('(begin 1 2 3) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['begin', 1, 2, 3], {}),
			3
		);
	});
	test('(begin (+ 2 2)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['begin', ['+', 2, 2]], {}),
			4
		);
	});
	test('(begin x y x) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['begin', 'x', 'y', 'x'], {bindings: {x: {value: 1, type: {tag: 'basetype', name: 'num'}}, y: {value: 2, type: {tag: 'basetype', name: 'num'}}}}),
			1
		);
	});
	test('(begin (set! x 5) (set! x (+ y x)) x) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['begin', ['set!', 'x', 5], ['set!', 'x', ['+', 'y', 'x']], 'x'], {bindings: {x: {value: 1, type: {tag: 'basetype', name: 'num'}}, y: {value: 2, type: {tag: 'basetype', name: 'num'}}}}),
			7
		);
	});
});
suite('eval <, =', function() {
	test('(< 2 2) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['<', 2, 2], {}),
			'#f'
		);
	});
	test('(< 2 3) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['<', 2, 3], {}),
			'#t'
		);
	});
	test('(< (+ 1 1) (+ 2 3)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['<', ['+', 1, 1], ['+', 2, 3]], {}),
			'#t'
		);
	});
});
suite('eval cons,car,cdr', function() {
	test('(cons 1 \'(2 3)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['cons', 1, ['quote', [2, 3]]], {}),
			[1, 2, 3]
		);
	});
	test('(cons \'(1 2) \'(3 4)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}),
			[[1, 2], 3, 4]
		);
	});
	test('(car \'((1 2) 3 4)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['car', ['quote', [[1, 2], 3, 4]]], {}),
			[1, 2]
		);
	});
	test('(cdr \'((1 2) 3 4)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['cdr', ['quote', [[1, 2], 3, 4]]], {}),
			[3, 4]
		);
	});	
	test('(length \'(1 2 3 4)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['length', ['quote', [1, 2, 3, 4]]], {}),
			4
		);
	});	
});
suite('eval if', function() {
	test('(if (= 1 1) 2 3) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['if', ['=', 1, 1], 2, 3], {}),
			2
		);
	});
	test('(if (= 1 0) 2 3) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['if', ['=', 1, 0], 2, 3], {}),
			3
		);
	});
	test('(if (= 1 1) 2 error) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['if', ['=', 1, 1], 2, 'error'], {}),
			2
		);
	});
	test('(if (= 1 1) error 3) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['if', ['=', 1, 0], 'error', 3], {}),
			3
		);
	});
	test('(if (= 1 1) (if (= 2 3) 10 11) 12) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['if', ['=', 1, 1], ['if', ['=', 2, 3], 10, 11], 12], {}),
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
			'always3': {value: always3},
			'identity': {value: identity},
			'plusone': {value: plusone},
			'add3': {value: add3}
		}, outer: { }
	};
	test('(always3 5) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['always3', 5], env),
			3
		);
	});
	test('(identity 5) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['identity', 5], env),
			5
		);
	});
	test('(plusone 5) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['plusone', 5], env),
			6
		);
	});
	test('(plusone (always3 5)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['plusone', ['always3', 5]], env),
			4
		);
	});
	test('(plusone (+ (plusone 2) (plusone 3))) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['plusone', ['+', ['plusone', 2], ['plusone', 3]]], env),
			8
		);
	});
	test('(add3 5 2 4) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['add3', 5, 2, 4], env),
			11
		);
	});
	test('(add3 5 2 (plusone 5)) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem(['add3', 5, 2, ['plusone', 5]], env),
			13
		);
	});
});
suite('eval lambda', function() {
	test('((lambda (x num) x) 5) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem([['lambda', [{atom: 'x', type: 'num'}], 'x'], 5], { }),
			5
		);
	});
	test('((lambda (x num) (+ x 1)) 5) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem([['lambda', [{atom: 'x', type: 'num'}], ['+', 'x', 1]], 5], { }),
			6
		);
	});
	test('(((lambda (x num) (lambda (y num) (+ x y))) 5) 3) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem([[['lambda', [{atom: 'x', type: 'num'}], ['lambda', [{atom: 'y', type: 'num'}], ['+', 'x', 'y']]], 5], 3], { }),
			8
		);
	});
	test('(((lambda (x num) (lambda (x num) (+ x x))) 5) 3) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem([[['lambda', [{atom: 'x', type: 'num'}], ['lambda', [{atom: 'x', type: 'num'}], ['+', 'x', 'x']]], 5], 3], { }),
			6
		);
	});
	test('((lambda (x num y num) (+ x y)) 5 2) test', function() {
		assert.deepEqual(
			tscheem.evalTscheem([['lambda', [{atom: 'x', type: 'num'}, {atom: 'y', type: 'num'}], ['+', 'x', 'y']], 5, 2], { }),
			7
		);
	});
	test('(begin (define plusone (lambda (x num) (+ x 1))) (plusone x)) test', function() {
		var env = {
			bindings: { x: {value:5,type:{tag:'basetype', name: 'num'}}}
		};
		assert.deepEqual(
			tscheem.evalTscheem(['begin', ['define', 'plusone', ['lambda', [{atom: 'x', type: 'num'}], ['+', 'x', 1]]], ['plusone', 'x']], env),
			6
		);
		assert.deepEqual(
			env.bindings['x'].value,
			5
		);
	});	
	test('(begin (define factorial (lambda (n num) (if (= n 0) 1 (* n (factorial (- n 1)))))) (factorial x)) test', function() {
		var env = {
			bindings: { x:{value:5,type:{tag:'basetype', name: 'num'}}}
		};
		assert.deepEqual(
			tscheem.evalTscheem(['begin', ['define', 'factorial', ['lambda', [{atom: 'n', type: 'num'}], ['if', ['=', 'n', 0], 1, ['*', 'n', ['factorial', ['-', 'n', 1]]]]]], ['factorial', 'x']], env),
			120
		);
		assert.deepEqual(
			env.bindings['x'].value,
			5
		);
	});	
	test('(begin (define plusone (lambda (n num) (begin (set! x 25) (+ n 1)))) (plusone x)) test', function() {
		var env = {
			bindings: { x: {value:5,type:{tag:'basetype', name: 'num'}}}
		};
		assert.deepEqual(
			tscheem.evalTscheem(['begin', ['define', 'plusone', ['lambda', [{atom: 'n', type: 'num'}], ['begin', ['set!', 'x', 25], ['+', 'n', 1]]]], ['plusone', 'x']], env),
			6
		);
		assert.deepEqual(
			env.bindings['x'].value,
			25
		);
	});	
	test('(begin (define delegate (lambda (n function) n)) (define plusone (lambda (n num) (+ n 1))) ((delegate plusone) 4)) test', function() {
	assert.deepEqual(
			tscheem.evalTscheem(['begin', ['define', 'delegate', ['lambda', [{atom: 'n', type: 'function'}], 'n']], ['define', 'plusone', ['lambda', [{atom: 'n', type: 'num'}], ['+', 'n', 1]]], [['delegate', 'plusone'], 4]], {}),
			5
		);
	});	
	
	
});

if (typeof module !== 'undefined') {
	suite('eval alert', function() {
		test('(alert \'helloWorld)  test', function() {
			assert.deepEqual(
				tscheem.evalTscheem(['alert', ['quote', 'helloWorld']], { }),
				'helloWorld'
			);
		});
		expect(
			function() { tscheem.evalTscheem(['alert', 'helloWorld'], { }) }
		).to.throw(
			tscheem.VariableNotFoundError
		);
		test('(alert (+ 3 2))  test', function() {
			assert.deepEqual(
				tscheem.evalTscheem(['alert', ['+', 3, 2]], { }),
				5
			);
		});
	});
}