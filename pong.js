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


// get user input
var keysDown = {};

window.addEventListener("keydown", function(event) {
	keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
	delete keysDown[event.keyCode];
});


// define moveable objects
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

	this.move = function(x, y) {
		this.x += x;
		this.y += y;
		this.x_speed = x;
		this.y_speed = y;

		// all the way to the left
		if(this.x < 0) {
			this.x = 0;
			this.x_speed = 0;

		// all the way to the right
		} else if (this.x + this.w > WIDTH) {
			this.x = WIDTH - this.w;
			this.x_speed = 0;
		}
	}
}


function Player(x, y, w, h, move_left_key, move_right_key) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.move_left_key = move_left_key;
	this.move_right_key = move_right_key;
	this.paddle = new Paddle(this.x, this.y, this.w, this.h);


	this.render = function() {
		this.paddle.render();
	}

	this.update = function() {
		for (var key in keysDown) {
		    var value = Number(key);
		    // left arrow
		    if (value == move_left_key) {
		    	this.paddle.move(-4, 0);
		    // right arrow
		    } else if (value == move_right_key) {
		    	this.paddle.move(4, 0);
		    } else {
		    	this.paddle.move(0, 0);
		    }
		}

		this.x = this.paddle.x;
		this.y = this.paddle.y;
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

	this.stop = function() {
		this.x_speed = 0;
		this.y_speed = 0;
	}
}


// functions
var detect_ball_exit = function(ball_obj) {
	// upper exit
	if (ball_obj.y <= 0) {
		return true;
	}
	// lower exit
	else if (ball_obj.y + ball_obj.diameter >= HEIGHT) {
		return true;
	}
	else {
		return false;
	}
}


var detect_ball_player_collision = function(ball_obj, player_obj) {
	if (ball_obj.y + ball_obj.diameter >= player_obj.y && ball_obj.y <= player_obj.y + player_obj.h && ball_obj.x + ball_obj.diameter >= player_obj.x && ball_obj.x <= player_obj.x + player_obj.w) {
		ball_obj.y_speed += Math.abs(player_obj.paddle.x_speed) * 0.2;
		ball_obj.y_speed *= -1;
	}
}


// create objects
var board = new Board(WIDTH, HEIGHT)
var player1 = new Player(175, 580, 100, 10, 37, 39);
var player2 = new Player(175, 10, 100, 10, 65, 68);
var ball = new Ball(200, 300);
ball.spawn();

var keep_playing = true;


// main functions
var update = function() {
	ball.update();
	if (detect_ball_exit(ball) && keep_playing) {
		keep_playing = false;
		setTimeout(function() { 
	        delete ball;
	        ball = new Ball(200, 300);
	        ball.spawn();
	        keep_playing = true;
	    }, 3000);
	}
	detect_ball_player_collision(ball, player1);
	detect_ball_player_collision(ball, player2);
	player1.update();
	player2.update()
}

var render = function() {
	board.render();
	player1.render();
	player2.render();
	ball.render();
}

var step = function() {
	update();
	render();
	animate(step);
}
