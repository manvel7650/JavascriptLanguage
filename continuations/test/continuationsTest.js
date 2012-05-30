if (typeof module !== 'undefined') {
	var continuations = require('../continuations.js');
	var sum = require('../sum.js');
	var fibonacci = require('../fibonacci.js');
	var count = require('../count.js');
	var reverse = require('../reverse.js');
	var insert = require('../insert.js');
	var assert = require('chai').assert;
	var expect = require('chai').expect;
} else {
	var assert = chai.assert;
	var expect = chai.expect;
}

var create_list = function(length) {
	var result = [];
	for(var i=0; i<length; i++) {
		result[i] = i;
	}
	return result;
};

var create_tree = function(lst) {
	var i;
	var curr = null;
	for(i = 0; i < lst.length; i++) {
		curr = add_tree(curr, lst[i]);
	}
	return curr;
};

var add_tree = function(tree, value) {
	var node = {data: value, left: null, right: null};
	if(tree === null) {
		return node;
	}
	var newTree = {data: tree.data, left: tree.left, right: tree.right};
	var temp = newTree;
	while(true) {
		if(value <= temp.data) {
			if(temp.left === null) {
				temp.left = node;
				break;
			} else {
				temp.left = {data: temp.left.data, left: temp.left.left, right: temp.left.right};
				temp = temp.left;
			}			
		} else {
			if(temp.right === null) {
				temp.right = node;
				break;
			} else {
				temp.right = {data: temp.right.data, left: temp.right.left, right: temp.right.right};
				temp = temp.right;
			}
		}
	}
	return newTree;
};

suite('sum', function() {
	test('sumCPS(20000)', function() {
		expect(
			function() { sum.sumCPS(20000) }
		).to.throw(
			'Maximum call stack size exceeded'
		);
	});
	test('sumThunk(20000)', function() {
		assert.deepEqual(sum.sumThunk(20000), 200010000);
	});
});

suite('fibonacci', function() {
	test('fibonacciCPS(30)', function() {
		expect(
			function() { fibonacci.fibonacciCPS(30) }
		).to.throw(
			'Maximum call stack size exceeded'
		);
	});
	test('fibonacciThunk(30)', function() {
		assert.deepEqual(fibonacci.fibonacciThunk(30), 832040);
	});
});

suite('count', function() {
	var length = 100000;
	var lst = create_list(length);
	for(var i=0; i<length; i++) {
		lst[i] = Math.random() * length;
	}	
	var tree = create_tree(lst);
	test('countCPS ' + length, function() {
		expect(
			function() { count.countCPS(tree) }
		).to.throw(
			'Maximum call stack size exceeded'
		);
	});
	test('countThunk ' + length, function() {
		assert.deepEqual(count.countThunk(tree), length);
	});
});
suite('reverse', function() {
	var length = 10000;
	var list = create_list(length);
	var reversed = [].concat(list);
	reversed.reverse();	
	test('reverseCPS ' + length, function() {
		expect(
			function() { reverse.reverseCPS(list) }
		).to.throw(
			'Maximum call stack size exceeded'
		);
	});
	test('reverseThunk ' + length, function() {
		assert.deepEqual(reverse.reverseThunk(list), reversed);
	});
});
suite('insert', function() {
	var length = 10000;
	var lst = create_list(length);
	var tree = create_tree(lst);
	var value = length + 1;
	var expected = add_tree(tree, value);
	test('insertCPS ' + length, function() {
		expect(
			function() { insert.insertCPS(tree, value) }
		).to.throw(
			'Maximum call stack size exceeded'
		);
	});
	test('insertThunk ' + length, function() {
		assert.deepEqual(insert.insertThunk(tree, value), expected);
	});
});


