if (typeof module !== 'undefined') {
	var continuations = require('./continuations.js');
} 

var reverse = (function () {
	var reverse = {
		reverse : function(list) {
			if(list.length <= 1) {
				return list;
			}
			return [list[list.length-1]].concat(reverse.reverse(list.slice(0, list.length -1))); 
		},
		
		reverseCPS : function(list) {
			return reverseCPS(list, function(n) {
				return n;
			});
		},

		reverseThunk : function(list) {
			var result = reverseThunk(list, continuations.thunkValue);
			return continuations.trampoline(result);	
		}
	};
	
	var reverseCPS = function(list, cont) {
		if(list.length <= 1) return cont(list);
		else {
			var new_cont = function (v) {
				return cont([list[list.length-1]].concat(v));
			};
			return reverseCPS(list.slice(0, list.length -1), new_cont);
		}
	};

	var reverseThunk = function(list, cont) {
		if(list.length <= 1) return continuations.thunk(cont, [list]);
		else {
			var new_cont = function (v) {
				return continuations.thunk(cont, [[list[list.length-1]].concat(v)]);
			};
			return continuations.thunk(reverseThunk, [list.slice(0, list.length -1), new_cont]);
		}
	};
	
	return reverse;
})();

if (typeof module !== 'undefined') {
	module.exports = reverse;
}