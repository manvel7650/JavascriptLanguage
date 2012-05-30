var continuations = (function () {
	var continuations = {
		thunk : function (f, lst) {
			return { tag: 'thunk', func: f, args: lst };
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
					throw new Error('unkown tag ' + thk.tag);
				}
			}
		}
	};
	
	return continuations;
})();

if (typeof module !== 'undefined') {
	module.exports = continuations;
}