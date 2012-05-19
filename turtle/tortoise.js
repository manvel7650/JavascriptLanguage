function Tortoise(imageSrc, paper) {
	this.paper = paper;
	this.imageSrc = imageSrc;
	this.operations = [];
	this.clear();
}

Tortoise.prototype.clear = function() {
	this.params = {
		stroke: 'black'
	};
	this.x = this.paper.width / 2;
	this.y = this.paper.height / 2;
	this.angle = 90;
	this.paper.clear();
	this.image = this.paper.image(this.imageSrc, 0, 0, 32, 32);
	this.updateTortoise(null, function() {});
}

Tortoise.prototype.run = function(animation) {
	this.callback(animation);
}

Tortoise.prototype.callback = function(animation) {
	if(this.operations.length > 0) {
		this.executeOperation(this.operations.shift(), animation, this.callback);
	}
}

Tortoise.prototype.executeOperation = function(operation, animation, callback) {
	switch(operation.operation) {
		case 'draw':
			var startx = this.x;
			var starty = this.y;
			this.x = this.x + Math.cos(Raphael.rad(this.angle)) * operation.distance;
			this.y = this.y - Math.sin(Raphael.rad(this.angle)) * operation.distance;
			this.paper.path(Raphael.format('M{0},{1}L{2},{3}', startx, starty, this.x, this.y)).attr(operation.attr);
			break;
		case 'move':
			this.x = this.x + Math.cos(Raphael.rad(this.angle)) * operation.distance;
			this.y = this.y - Math.sin(Raphael.rad(this.angle)) * operation.distance;
			break;
		case 'rect':
			this.paper.rect(this.x, this.y, operation.size, operation.size)).attr(operation.attr);
			break;
		case 'circle':
			this.paper.circle(this.x, this.y, operation.radious)).attr(operation.attr);
			break;
		case 'text':
			this.paper.text(this.x, this.y, operation.text)).attr(operation.attr);
			break;
		case 'left':
			this.angle -= operation.angle;
			break;
		case 'right':
			this.angle += operation.angle;
			break;
	}
	this.updateTortoise(animation, callback);
}

Tortoise.prototype.move = function(distance) {
	this.operations.push({operation: 'move', distance: distance, attr: jQuery.extend(true, {}, this.params)});
}

Tortoise.prototype.draw = function(distance) {
	this.operations.push({operation: 'draw', distance: distance, attr: jQuery.extend(true, {}, this.params)});
}

Tortoise.prototype.left = function(angle) {
	this.operations.push({operation: 'left', angle: angle, attr: jQuery.extend(true, {}, this.params)});
}

Tortoise.prototype.right = function(angle) {
	this.operations.push({operation: 'right', angle: angle, attr: jQuery.extend(true, {}, this.params)});
}

Tortoise.prototype.rect = function(size) {
	this.operations.push({operation: 'rect', size: size, attr: jQuery.extend(true, {}, this.params)});
}

Tortoise.prototype.circle = function(radious) {
	this.operations.push({operation: 'circle', radious: radious, attr: jQuery.extend(true, {}, this.params)});
}

Tortoise.prototype.text = function(text) {
	this.operations.push({operation: 'text', text: text, attr: jQuery.extend(true, {}, this.params)});
}

Tortoise.prototype.updateTortoise = function(animation, callback) {
	this.image.toFront();
	var attr = {
		transform: 'T' + (this.x - 16) + ',' + (this.y - 16) + 'R' + (-this.angle + 235)
	}
	if(animation) {
		var closure = this;
		this.image.animate(attr, animation, function() {
			callback.call(closure, animation);
		});
	} else {
		this.image.attr(attr);
		callback.call(this, animation);
	}
}

