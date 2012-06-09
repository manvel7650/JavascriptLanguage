var continuations = (function () {
	var continuations = {
		thunk : function (f) {
			var args = Array.prototype.slice.call(arguments);
			args.shift();
			return { tag: "thunk", func: f, args: args };
		},
		thunkArray : function(f, args) {
			return { tag: "thunk", func: f, args: args };
		},
		thunkValue : function (x) {
			return { tag: 'value', val: x };
		},
		trampoline : function (thk) {
			while (true) {
				if (thk.tag === 'value') {
					return thk.val;
				} else if (thk.tag === 'thunk') {
					thk = thk.func.apply(null, thk.args);
				} else {
					throw new Error('unkown thunk ' + thk.tag);
				}
			}
		},
		step : function (state) {
			if (state.data.tag === "value") {
				state.done = true;
				state.data = state.data.val;
			} else if (state.data.tag === "thunk") {
				state.data = state.data.func.apply(null, state.data.args);
			} else {
				throw new Error('unkown thunk ' + state.data.tag);
			}
		}
	};
	
	return continuations;
})();

if (typeof module !== 'undefined') {
	module.exports = continuations;
}