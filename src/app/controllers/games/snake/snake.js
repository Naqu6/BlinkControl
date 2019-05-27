import React from "react";
// From: https://jordaneldredge.com/blog/the-game-snake-in-90-lines-of-javascript/

var SIZE = 500; // Size of the play-field in pixels
var GRID_SIZE = SIZE / 50;

function randomOffset() {
	return Math.floor(Math.random() * SIZE / GRID_SIZE) * GRID_SIZE;
}

function stringifyCoord(obj) {
	return [obj.x, obj.y].join(',');
}

export default class Snake extends React.Component {
	constructor(props) {
		super(props);

		this.componentDidMount = this.componentDidMount.bind(this);
		this.canvasRef = React.createRef();
		this.tick = this.tick.bind(this);

		this.gameData = {
			 // -2: up, 2: down, -1: left, 1: right
			
			direction: 1,
			newDirection: 1,
			snakeLength: 5,
			
			// Snake starts in the center
			snake: [{x: SIZE / 2, y: SIZE / 2}],
			
			candy: null,
			end: false,

		}
	}

	componentDidMount() {
		var c = this.canvasRef.current;
		
		c.height = c.width = SIZE * 2; // 2x our resolution so retina screens look good
		c.style.width = c.style.height = SIZE + 'px';
		
		this.gameData.context = c.getContext('2d');
		this.gameData.context.scale(2, 2); // Scale our canvas for retina screens

		setInterval(this.tick, 1500); // Kick off the game loop!
	}

	tick() {
		var c = this.canvasRef.current;

		var newHead = {x: this.gameData.snake[0].x, y: this.gameData.snake[0].y};

		// Only change directon if the new direction is a different axis
		if (Math.abs(this.gameData.direction) !== Math.abs(this.gameData.newDirection)) {
			this.gameData.direction = this.gameData.newDirection;
		}
		
		var axis = Math.abs(this.gameData.direction) === 1 ? 'x' : 'y'; // 1, -1 are X; 2, -2 are Y
		if (this.gameData.direction < 0) {
			newHead[axis] -= GRID_SIZE; // Move left or down
		} else {
			newHead[axis] += GRID_SIZE; // Move right or up
		}

		// Did we eat a candy? Detect if our head is in the same cell as the candy
		if (this.gameData.candy && this.gameData.candy.x === newHead.x && this.gameData.candy.y === newHead.y) {
			this.gameData.candy = null;
			this.gameData.snakeLength += 20;
		}

		this.gameData.context.fillStyle = '#002b36';
		this.gameData.context.fillRect(0, 0, SIZE, SIZE); // Reset the play area
		if (this.gameData.end) {
			this.gameData.context.fillStyle = '#eee8d5';
			this.gameData.context.font = '40px serif';
			this.gameData.context.textAlign = 'center';
			this.gameData.context.fillText('Refresh to play again', SIZE / 2, SIZE / 2);
		} else {
			this.gameData.snake.unshift(newHead); // Add the new head to the front
			this.gameData.snake = this.gameData.snake.slice(0, this.gameData.snakeLength); // Enforce the snake's max length
		}

		// Detect wall collisions
		if (newHead.x < 0 || newHead.x >= SIZE || newHead.y < 0 || newHead.y >= SIZE) {
			this.gameData.end = true;
		}

		this.gameData.context.fillStyle = '#268bd2';
		var snakeObj = {};
		for (var i = 0; i < this.gameData.snake.length; i++) {
			var a = this.gameData.snake[i];
			this.gameData.context.fillRect(a.x, a.y, GRID_SIZE, GRID_SIZE); // Paint the snake
			// Build a collision lookup object
			if (i > 0) snakeObj[stringifyCoord(a)] = true;
		}

		if (snakeObj[stringifyCoord(newHead)]) this.gameData.end = true; // Collided with our tail

		// Place a candy (not on the snake) if needed
		while (!this.gameData.candy || snakeObj[stringifyCoord(this.gameData.candy)]) {
			this.gameData.candy = {x: randomOffset(), y: randomOffset()};
		}

		this.gameData.context.fillStyle = '#b58900';
		this.gameData.context.fillRect(this.gameData.candy.x, this.gameData.candy.y, GRID_SIZE, GRID_SIZE); // Paint the candy
	}

	setDirection(direction) {
		this.gameData.newDirection = direction;
	}

	render() {
		return <canvas className="canvas" ref={this.canvasRef}/>
	}
}