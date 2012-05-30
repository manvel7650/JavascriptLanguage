if (typeof module !== 'undefined') {
	var continuations = require('./continuations.js');
} 

var insert = (function () {
	var insert = {
	
		insert : function(tree, value) {
			if(tree === null) {
				return {data: value, left: null, right: null};
			} else if(value <= tree.data) {
				return {data: tree.data, left: insert.insert(tree.left, value), right: tree.right};
			} else {
				return {data: tree.data, left: tree.left, right: insert.insert(tree.right, value) };
			}
		},
		
		insertCPS : function(tree, value) {
			return insertCPS(tree, value, function(n) {
				return n;
			});
		},

		insertThunk : function(tree, value) {
			var result = insertThunk(tree, value, continuations.thunkValue);
			console.log('LETS GO TRAMPOLINE');
			return continuations.trampoline(result);	
		}		
	};
	
	var insertCPS = function(tree, value, cont) {
		if(tree === null) {
			return cont({data: value, left: null, right: null});
		} else if(value <= tree.data) {
			var new_cont = function(v) {
				return cont({data: tree.data, left: v, right: tree.right});
			}
			return insertCPS(tree.left, value, new_cont);
		} else {
			var new_cont = function(v) {
				return cont({data: tree.data, left: tree.left, right: v});
			}
			return insertCPS(tree.right, value, new_cont);
		}
	};

	var insertThunk = function(tree, value, cont) {
		if(tree === null) {
			return continuations.thunk(cont, [{data: value, left: null, right: null}]);
		} else if(value <= tree.data) {
			var new_cont = function(v) {
				return continuations.thunk(cont, [{data: tree.data, left: v, right: tree.right}]);
			}
			return continuations.thunk(insertThunk, [tree.left, value, new_cont]);
		} else {
			var new_cont = function(v) {
				return continuations.thunk(cont, [{data: tree.data, left: tree.left, right: v}]);
			}
			return continuations.thunk(insertThunk, [tree.right, value, new_cont]);
		}
	};
	
	return insert;
})();

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

var assert = require('chai').assert;

var length = 10000;
	var lst = create_list(length);
	var tree = create_tree(lst);
	var value = length + 1;
	var expected = add_tree(tree, value);
	insert.insertThunk(tree, value);
	assert.deepEqual(insert.insertThunk(tree, value), expected);

if (typeof module !== 'undefined') {
	module.exports = insert;
}