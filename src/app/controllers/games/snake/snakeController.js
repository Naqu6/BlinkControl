import React from "react";
import Snake from "./snake";
import BlinkController from "../../blinkController";

export default class SnakeController extends React.Component {
	constructor(props) {
		super(props);

		this.lateralMoves = {
			displayText: "root",
			binaryChoice: false,
			final: false,
			options: [{
				binaryChoice: false,
				final: true,
				displayText: "Make Move",
				options: [{
					displayText: "Left",
					callback: () => {
						this.moveLeft();
					}
				}, {
					displayText: "Right",
					callback: () => {
						this.moveRight()
					}
				}]
			}]
		};

		this.verticalMoves = {
			displayText: "root",
			binaryChoice: false,
			final: false,
			options: [{
				binaryChoice: false,
				final: true,
				displayText: "Make Move",
				options: [{
					displayText: "Up",
					callback: () => {
						this.moveUp();
					}
				}, {
					displayText: "Down",
					callback: () => {
						this.moveDown();
					}
				}]
			}]
		};

		this.snakeGame = React.createRef();
		this.blinkController = React.createRef();

		var toBind = ["moveUp", "moveDown", "moveLeft", "moveRight"];

		toBind.forEach((funcName) => {
			this[funcName] = this[funcName].bind(this);
		});
	}

	componentDidMount() {
		window.onkeydown = (e) => {
			var newDirection = {37: -1, 38: -2, 39: 1, 40: 2}[e.keyCode]

			if (newDirection) {
				this.snakeGame.current.setDirection(newDirection);
			}
    	};
	}

	moveUp() {
		this.snakeGame.current.setDirection(-2);
		this.blinkController.current.updateValues(this.lateralMoves);
	}

	moveDown() {
		this.snakeGame.current.setDirection(2);
		this.blinkController.current.updateValues(this.lateralMoves);
	}

	moveLeft() {
		this.snakeGame.current.setDirection(-1);
		this.blinkController.current.updateValues(this.verticalMoves);
	}

	moveRight() {
		this.snakeGame.current.setDirection(1);
		this.blinkController.current.updateValues(this.verticalMoves);
	}

	render() {
		return <div className="flex">
			<Snake ref={this.snakeGame} />
			<BlinkController decisionTime={450} blinkTime={350} values={this.verticalMoves} ref={this.blinkController}/>
		</div>;
	}
}