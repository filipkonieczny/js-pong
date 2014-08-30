// define default values
var WIDTH = 400;
var HEIGHT = 600;
var BOARD_COLOR = "#FF00FF";
var PADDLE_COLOR = "#0000FF";
var BALL_COLOR = "#000000";


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
	this.y_speed = 3;
	this.radius = 5;

	// define default color value
	if (this.color === undefined) {
		this.color = BALL_COLOR;
	}


	this.render = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
		context.fillStyle = this.color;
		context.fill();
	}
}


// create objects
var board = new Board(WIDTH, HEIGHT)
var player = new Player(175, 580, 50, 10);
var computer = new Player(175, 10, 50, 10);
var ball = new Ball(200, 300);


// main functions
var update = function() {}

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