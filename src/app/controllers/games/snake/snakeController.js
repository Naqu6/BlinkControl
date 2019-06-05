import React from "react";
import Snake from "./snake";
import BlinkController from "../../blinkController";

export default class SnakeController extends React.Component {
	constructor(props) {
		super(props);

		this.lateralMoves = [{
				displayText: "Left",
				callback: () => {
					this.moveLeft();
				}
			}, {
				displayText: "Right",
				callback: () => {
					this.moveRight()
				}
			}
		];

		this.verticalMoves = [{
				displayText: "Up",
				callback: () => {
					this.moveUp();
				}
			}, {
				displayText: "Down",
				callback: () => {
					this.moveDown();
				}
			}
		];

		this.snakeGame = React.createRef();

		var toBind = ["moveUp", "moveDown", "moveLeft", "moveRight"];

		toBind.forEach((funcName) => {
			this[funcName] = this[funcName].bind(this);
		});
	}

	componentDidMount() {
		this.props.updateValues(this.verticalMoves);
	}

	moveUp() {
		this.snakeGame.current.setDirection(-2);
		this.props.updateValues(this.lateralMoves);
	}

	moveDown() {
		this.snakeGame.current.setDirection(2);
		this.props.updateValues(this.lateralMoves);
	}

	moveLeft() {
		this.snakeGame.current.setDirection(-1);
		this.props.updateValues(this.verticalMoves);
	}

	moveRight() {
		this.snakeGame.current.setDirection(1);
		this.props.updateValues(this.verticalMoves);
	}

	render() {
		return <Snake ref={this.snakeGame} />;
	}
}