function Turtle(width, height, turtle, paper, animation) {
	this.paper = paper;
	this.width = width;
	this.height = height;
	this.turtle = turtle;
	this.animation = animation;
	this.clear();
}

Turtle.prototype.clear = function() {
	this.params = {};
	this.x = this.width / 2;
	this.y = this.height / 2;
	this.angle = 90;
	this.paper.clear();
	this.image = this.paper.image(this.turtle, 0, 0, 32, 32);
	this.updateTurtle(null, function() {});
}

Turtle.prototype.move = function(distance, callback) {
	this.x = this.x + Math.cos(Raphael.rad(this.angle)) * distance;
	this.y = this.y - Math.sin(Raphael.rad(this.angle)) * distance;
	this.updateTurtle(this.animation, callback);
}

Turtle.prototype.draw = function(distance, callback) {
	var startx = this.x;
	var starty = this.y;
	this.move(distance, function() {
		this.paper.path(
			Raphael.format('M{0},{1}L{2},{3}', startx, starty, this.x, this.y )
		).attr(
			this.params
		);
		this.updateTurtle(null, callback);
	});
}

Turtle.prototype.left = function(angle, callback) {
	this.angle -= angle;
	this.updateTurtle(this.animation, callback);
}

Turtle.prototype.right = function(angle, callback) {
	this.angle += angle;
	this.updateTurtle(this.animation, callback);
}

Turtle.prototype.updateTurtle = function(animation, callback) {
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

