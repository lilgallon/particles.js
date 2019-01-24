/**
 * GPL-3.0 License
 * Author(s) : N3ROO
 * Contribute here : https://github.com/N3ROO/Animated-Particles
 */

var particle={
	x:0,
	y:0,
	vx:0,
	vy:0,
	mass:1,
	radius:0,
	friction:1,
	gravity:0,
	mass:1,
	springs:null,

	create:function(x, y, speed, direction, grav){
		// Constructor
		var obj = Object.create(this);
		obj.x = x;
		obj.y = y;
		obj.vx = Math.cos(direction)*speed;
		obj.vy = Math.sin(direction)*speed;
		obj.gravity = grav||0;
		obj.springs = [];
		return obj;
	},
	addSpring:function(point, k, length){
		// Add a spring
		this.removeSpring(point);
		this.springs.push({
			point:point,
			k:k,
			length:length||0,
		});
	},
	removeSpring:function(point){
		// Remove a spring
		for(var i = 0; i < this.springs.length; i++){
			if(point === this.springs[i].point){
				this.springs.splice(i, 1);
				return;
			}
		}
	},
	getSpeed:function(){
		// Get the speed
		return Math.sqrt(this.vx*this.vx + this.vy*this.vy);
	},
	setSpeed:function(speed){
		// Set the speed
		var heading = this.getHeading();
		this.vx = Math.cos(heading)*speed;
		this.vy = Math.sin(heading)*speed;
	},
	getHeading:function(){
		// Get the heading (orientation)
		return Math.atan2(this.vy, this.vx);
	},
	setHeading:function(heading){
		// Set the heading
		var speed = this.getSpeed();
		this.vx = Math.cos(heading)*speed;
		this.vy = Math.sin(heading)*speed;
	},
	accelerate:function(ax,ay){
		// ACCELERATION
		this.vx += ax;
		this.vy += ay;
	},
	update:function(){
		// Update the position
		this.handleSprings();
		this.vy += this.gravity;
		this.vx *= this.friction,
		this.vy *= this.friction,
		this.x += this.vx;
		this.y += this.vy;
	},
	handleSprings:function(){
		// Update all the stuff that a spring needs to update
		for(var i = 0; i < this.springs.length; i++){
			var spring = this.springs[i];
			this.springTo(spring.point, spring.k, spring.length);
		}
	},
	angleTo:function(p2){
		return Math.atan2(p2.y - this.y, p2.x - this.x);
	},
	distanceTo:function(p2){
		var dx = p2.x - this.x,
			dy = p2.y - this.y;
		return Math.sqrt(dx*dx + dy*dy);
	},
	gravitateTo:function(p2){
		var dx = p2.x - this.x,
			dy = p2.y - this.y,
			distSQ = dx*dx + dy*dy,
			dist = Math.sqrt(distSQ),
			force = p2.mass/distSQ,
			ax = dx/dist * force,
			ay = dy/dist * force;
		this.vx += ax;
		this.vy += ay;
	},
	springTo:function(point,k,length){
		var dx = point.x - this.x,
			dy = point.y - this.y,
			distance = Math.sqrt(dx*dx + dy*dy),
			springForce = (distance - length||0) * k;
		this.vx += dx / distance * springForce;
		this.vy += dy / distance * springForce;
	}
}