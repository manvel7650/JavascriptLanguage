if (typeof module !== 'undefined') {
	var continuations = require('./continuations.js');
} 

var count = (function () {
	var count = {
		count : function(tree) {
			if(tree === undefined || tree === null) {
				return 0;
			}
			return 1 + count.count(tree.left) + count.count(tree.right); 
		},
		
		countCPS : function(tree) {
			return countCPS(tree, function(n) {
				return n;
			});
		},

		countThunk : function(tree) {
			var result = countThunk(tree, continuations.thunkValue);
			return continuations.trampoline(result);	
		}
	};
	
	var countCPS = function(tree, cont) {
		if(tree === undefined || tree === null) return cont(0);
		else {
			var left_cont = function (vl) {
				var right_cont =  function(vr) {
					return cont(1 + vr + vl);
				}
				return countCPS(tree.right, right_cont);
			};
			return countCPS(tree.left, left_cont);
		}
	};

	var countThunk = function(tree, cont) {
		if(tree === undefined || tree === null) return continuations.thunk(cont, [0]);
		else {
			var left_cont = function (vl) {
				var right_cont =  function(vr) {
					return continuations.thunk(cont, [1 + vr + vl]);
				}
				return continuations.thunk(countThunk, [tree.right, right_cont]);
			};
			return continuations.thunk(countThunk, [tree.left, left_cont]);
		}
	};
	
	return count;
})();

if (typeof module !== 'undefined') {
	module.exports = count;
}