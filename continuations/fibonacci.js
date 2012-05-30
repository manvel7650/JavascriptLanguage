if (typeof module !== 'undefined') {
	var continuations = require('./continuations.js');
} 

var fibonacci = (function () {
	var fibonacci = {
		fibonacci : function(n) {
			if(n <= 1) {
				return n;
			} else {
				return fibonacci.fibonacci(n - 1) + fibonacci.fibonacci(n - 2);
			}
		},
		
		fibonacciCPS : function(n) {
			return fibonacciCPS(n, function(n) {
				return n;
			});
		},

		fibonacciThunk : function(n) {
			var result = fibonacciThunk(n, continuations.thunkValue);
			return continuations.trampoline(result);	
		}
	};
	
	var fibonacciCPS = function(n, cont) {
		if (n <= 1) return cont(n);
		else {
			var fib_cont1 = function (v1) {
				var fib_cont2 =  function(v2) {
					return cont(v1 + v2);
				}
				return fibonacciCPS(n - 2, fib_cont2);
			};
			return fibonacciCPS(n - 1, fib_cont1);
		}
	};

	var fibonacciThunk = function(n, cont) {
		if (n <= 1) return continuations.thunk(cont, [n]);
		else {
			var fib_cont1 = function (v1) {
				var fib_cont2 =  function(v2) {
					return continuations.thunk(cont, [v1 + v2]);
				}
				return continuations.thunk(fibonacciThunk, [n - 2, fib_cont2]);
			};
			return continuations.thunk(fibonacciThunk, [n - 1, fib_cont1]);
		}
	};
	
	return fibonacci;
})();

if (typeof module !== 'undefined') {
	module.exports = fibonacci;
}