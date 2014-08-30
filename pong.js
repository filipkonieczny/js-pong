// define default values
var WIDTH = 400;
var HEIGHT = 600;
var BOARD_COLOR = "#FF00FF";
var PADDLE_COLOR = "#0000FF";
var BALL_COLOR = "#000000";
var MAX_BALL_SPEED = 6;


// setup canvas
var animate = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
var context = canvas.getContext('2d');

window.onload = function() {
	document.body.appendChild(canvas);
	animate(step);
};


// define 
function Board(w, h, color) {
	this.w = w;
	this.h = h;
	this.color = color;

	// define default color value
	if (this.color === undefined) {
		this.color = BOARD_COLOR;
	}


	this.render = function() {
		context.fillStyle = this.color;
		context.fillRect(0, 0, w, h);
	}
}


function Paddle(x, y, w, h, color) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;
	this.x_speed = 0;
	this.y_speed = 0;

	// define default color value
	if (this.color === undefined) {
		this.color = PADDLE_COLOR;
	}


	this.render = function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.w, this.h);
	}
}


function Player(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.paddle = new Paddle(this.x, this.y, this.w, this.h);


	this.render = function() {
		this.paddle.render();
	}
}


function Ball(x, y, color) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.x_speed = 0;
	this.y_speed = 0;
	this.radius = 5;
	this.diameter = this.radius * 2;

	// define default color value
	if (this.color === undefined) {
		this.color = BALL_COLOR;
	}


	this.spawn = function() {
		vertical_direction = Math.random()
		if (vertical_direction >= 0.5) {
			vertical_direction = 1;
		}
		else {
			vertical_direction = -1;
		}

		horizontal_direction = Math.random()
		if (horizontal_direction >= 0.5) {
			horizontal_direction = 1;
		}
		else {
			horizontal_direction = -1;
		}

		// determine the angle at which the ball is supposed to 
		angle = (Math.random() * 8 + 2) / 10;

		this.x_speed = angle * MAX_BALL_SPEED * horizontal_direction;
		this.y_speed = Math.pow(Math.pow(MAX_BALL_SPEED, 2) - Math.pow(this.x_speed, 2), 1/2) * vertical_direction;


		// LOG
		console.log("x speed: %s", this.x_speed);
		console.log("y speed: %s", this.y_speed);
		total_speed = Math.abs(this.x_speed) + Math.abs(this.y_speed);
		console.log("total speed: %s", total_speed);
		actual_speed = Math.pow(Math.pow(this.x_speed, 2) + Math.pow(this.y_speed, 2), 1/2);
		console.log("speed - max defined: %s, actual: %s", MAX_BALL_SPEED, actual_speed);
	}


	this.update = function() {
		this.x += this.x_speed;
		this.y += this.y_speed;
		this.detect_walls_collision();
	}

	this.render = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
		context.fillStyle = this.color;
		context.fill();
	}

	this.detect_walls_collision = function() {
		// left wall
		if (this.x <= 0) {
			this.x_speed *= -1;
		}

		// right wall
		if (this.x + this.diameter >= WIDTH) {
			this.x_speed *= -1;
		}
	}
}


//
var detect_ball_exit = function(ball_obj) {
	// upper exit
	if (ball_obj.y <= 0) {
		return true;
	}
	// lower exit
	else if (ball_obj.y + ball_obj.h >= HEIGHT) {
		return true;
	}
	else {
		return false;
	}
}


// create objects
var board = new Board(WIDTH, HEIGHT)
var player = new Player(175, 580, 50, 10);
var computer = new Player(175, 10, 50, 10);
var ball = new Ball(200, 300);

ball.spawn();


// main functions
var update = function() {
	ball.update();
	if (detect_ball_exit(ball)) {
		console.log('win!')
		setTimeout(function(){ 
	        console.log('wat');
	    }, 3000);  
	}
}

var render = function() {
	board.render();
	player.render();
	computer.render();
	ball.render();
}

var step = function() {
	update();
	render();
	animate(step);
}