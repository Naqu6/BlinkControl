import React from "react";
import Snake from "./snake";
import BlinkController from "../../blinkController";

export default class SnakeController extends React.Component {
	constructor(props) {
		super(props);

		this.snakeGame = React.createRef();
	}

	componentDidMount() {
		window.onkeydown = (e) => {
			var newDirection = {37: -1, 38: -2, 39: 1, 40: 2}[e.keyCode]

			if (newDirection) {
				this.snakeGame.current.setDirection(newDirection);
			}
    	};
	}

	render() {
		return <div className="flex">
			<Snake ref={this.snakeGame}/>
			<BlinkController decisionTime={750} blinkTime={350} values={
				{
					displayText: "root",
					binaryChoice: false,
					final: false,
					options: [{
						binaryChoice: true,
						final: false,
						displayText: "Make Move",
						options: {
							blinkingChoice: {
								displayText: "Left - Right",
								binaryChoice: false,
								final: true,
								options: [{
									displayText: "Left",
									callback: () => {
										console.log("Left");
										this.snakeGame.current.setDirection(-1);
									}
								}, {
									displayText: "Right",
									callback: () => {
										console.log("Right");
										this.snakeGame.current.setDirection(1);
									}
								}]
							}, notBlinkingChoice: {
								displayText: "Up - Down",
								binaryChoice: false,
								final: true,
								options: [{
									displayText: "Up",
									callback: () => {
										console.log("Up");
										this.snakeGame.current.setDirection(-2);
									}
								}, {
									displayText: "Down",
									callback: () => {
										console.log("Down");
										this.snakeGame.current.setDirection(2);
									}
								}]
							}
						}
					}]
				}
			}/>
		</div>
	}
}