function Tortoise(turtle, paper, animation) {
	this.paper = paper;
	this.width = paper.width;
	this.height = paper.height;
	this.turtle = turtle;
	this.animation = animation;
	this.operations = [];
	this.clear();
}

Tortoise.prototype.clear = function() {
	this.params = {
		width : 4,
		opacity : 1.0,
		color : '#00f'
	};
	this.x = this.width / 2;
	this.y = this.height / 2;
	this.angle = 90;
	this.paper.clear();
	this.image = this.paper.image(this.turtle, 0, 0, 32, 32);
	this.updateTortoise(null, function() {});
}

Tortoise.prototype.executeAll = function() {
	if(this.operations.length === 1) {
		this.execute(this.operations.pop(), this.executeCallback);
	}
}

Tortoise.prototype.executeCallback = function() {
	this.execute(this.operations.pop(), this.executeCallback);
}

Tortoise.prototype.call = function() {
	if(this.operations.length === 1) {
		var closure = this;
		var callback = new function()  {
			closure.execute(closure.operations.pop(), callback);
		};
		this.execute(closure.operations.pop(), callback);
	}
}

Tortoise.prototype.execute = function(operation, callback) {
	if(operation) {
		alert(operation);
		switch(operation[0]) {
			case 'move':
				this.x = this.x + Math.cos(Raphael.rad(this.angle)) * operation[1];
				this.y = this.y - Math.sin(Raphael.rad(this.angle)) * operation[1];
				this.updateTortoise(this.animation, callback);
				break;
			case 'draw':
				var startx = this.x;
				var starty = this.y;
				this.x = this.x + Math.cos(Raphael.rad(this.angle)) * operation[1];
				this.y = this.y - Math.sin(Raphael.rad(this.angle)) * operation[1];
				this.paper.path(
					Raphael.format('M{0},{1}L{2},{3}', startx, starty, this.x, this.y )
				).attr(
					this.params
				);
				this.updateTortoise(null, callback);
			case 'left':
				this.angle -= operation[1];
				this.updateTortoise(this.animation, callback);
				break;
			case 'rigth':
				this.angle += operation[1];
				this.updateTortoise(this.animation, callback);
				break;
		}
	}
}

Tortoise.prototype.move = function(distance) {
	this.operations.push(['move', distance]);
	this.executeAll();
}

Tortoise.prototype.draw = function(distance, callback) {
	this.operations.push(['draw', distance]);
	this.executeAll();
}

Tortoise.prototype.left = function(angle, callback) {
	this.operations.push(['left', angle]);
	this.executeAll();
}

Tortoise.prototype.right = function(angle, callback) {
	this.operations.push(['right', angle]);
	this.executeAll();
}

Tortoise.prototype.updateTortoise = function(animation, callback) {
	this.image.toFront();
	var attr = {
		transform: 'T' + (this.x - 16) + ',' + (this.y - 16) + 'R' + (-this.angle + 235)
	}
	if(animation) {
		var closure = this;
		this.image.animate(attr, animation, function() {
			callback.call(closure);
		});
	} else {
		this.image.attr(attr);
		callback.call(this);
	}
}

