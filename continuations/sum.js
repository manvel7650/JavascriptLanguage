if (typeof module !== 'undefined') {
	var continuations = require('./continuations.js');
} 

var sum = (function () {
	var sum = {
		sum : function(n) {
			if (n === 1)  {
				return 1;
			} else {
				return sum(n - 1) + n;
			}
		},
		
		sumCPS : function(n) {
			return sumCPS(n, function(n) {
				return n;
			});
		},

		sumThunk : function(n) {
			var result = sumThunk(n, continuations.thunkValue);
			return continuations.trampoline(result);
		}
	};
	
	var sumCPS = function(n, cont) {
		if (n <= 1) return cont(n);
		else {
			var new_cont = function (v) {
				return cont(v + n);
			};
			return sumCPS(n - 1, new_cont);
		}
	};

	var sumThunk = function(n, cont) {
		if (n <= 1) return continuations.thunk(cont, [n]);
		else {
			var new_cont = function (v) {
				return continuations.thunk(cont, [v + n]);
			};
			return continuations.thunk(sumThunk, [n - 1, new_cont]);
		}
	};
	
	return sum;
})();

if (typeof module !== 'undefined') {
	module.exports = sum;
}