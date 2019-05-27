import cv from "../../build/Release/blinkDetector";
import React from "react";

function choice(props) {
	return (
		<div className="choice">
			<div className={`choice-name ${props.highlighted ? "highlighted": ""}`}>
				{props.name}
			</div>
		</div>
	);

}


function BinaryOptions(props) {
	return (
		<div className="options binary-options"> 
			<div>
				Blink Option: {props.current.options.blinkingChoice.displayText}
			</div>

			<br/>

			<div>
				No-Blink Option: {props.current.options.notBlinkingChoice.displayText}
			</div>
		</div>
	);
}

function MultipleOptions(props) {
	return (
		<div className="options multiple-options">
			{
				props.current.options.map((option, index) => {
					if (index == props.highlightedIndex) {
						return (
							<div className="option highlighted">
								{option.displayText}
							</div>
						);
					} else {
						return (
							<div className="option">
								{option.displayText}
							</div>
						);
					}
				})
			}
		</div>
	);
}

function Options(props) {
	if (props.current.binaryChoice) {
		return BinaryOptions(props);
	} else {
		return MultipleOptions(props);
	}
}

function getHeightFromRatio(width, ratio) {
	return width * ratio;
}

class EyeStatus extends React.Component {
	constructor(props) {
		super(props);


		this.canvas = React.createRef();
		this.setRatio = this.setRatio.bind(this);
	}

	setRatio(ratio) {
		const width = 50;
		const height = getHeightFromRatio(width, ratio);

		var canvas = this.canvas.current;
		const context = canvas.getContext("2d");

		context.clearRect(0, 0, 200, 200);
		
		context.fillStyle = "black";
		context.beginPath()
		context.ellipse(100, 100, width, height, 0, 0, 2 * Math.PI);
		context.fill();
	}

	render() {
		return <canvas ref={this.canvas} width={200} height={200}/>
	}
}

export default class BlinkController extends React.Component {
	// Abstraction for blink controller

	constructor(props) {
		/* 
			Props:
			{
				values: {
					final: boolean,
					Display Text: string,
					Options: [this schema],

					// if final == true
					Callback: action
				},
					
				decisionTime: float, // in millis
			}
		*/

		super(props);

		const startTime = Date.now();

		this.state = {
			leftEyeRatio: null,
			rightEyeRatio: null,
			path: [],
			highlightedIndex: 0,
			blinkStartTime: startTime,
			updateTime: startTime,
			running: true,
		}

		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);

		this.processData = this.processData.bind(this);
		this.getCurrent = this.getCurrent.bind(this);
		this.updateEyeData = this.updateEyeData.bind(this);
		this.currentIsBinary = this.currentIsBinary.bind(this);
		this.getDecisionTime = this.getDecisionTime.bind(this);

		this.leftEyeDisplay = React.createRef();
		this.rightEyeDisplay = React.createRef();
	}

	getCurrent() {
		var current = this.props.values; 

		this.state.path.forEach((key) => {
			current = current.options[key];
		});

		return current;
	}

	getBlinkStatus(leftEyeRatio, rightEyeRatio) {
		if ((leftEyeRatio < this.state.leftEyeRatio && rightEyeRatio < this.state.rightEyeRatio) || (leftEyeRatio < 0.3 && rightEyeRatio < 0.3)) {
			return true;
		} else {
			return false;
		}
	}

	currentIsBinary() {
		return typeof this.state.path[this.state.path.length - 1] == "string";
	}

	getDecisionTime() {
		if (this.currentIsBinary) {
			return this.props.decisionTime;
		}

		return this.props.blinkTime;
	}

	updateEyeData(leftEyeRatio, rightEyeRatio) {
		this.setState({
			leftEyeRatio: parseFloat(leftEyeRatio),
			rightEyeRatio: parseFloat(rightEyeRatio),
		});

		this.leftEyeDisplay.current.setRatio(this.state.leftEyeRatio);
		this.rightEyeDisplay.current.setRatio(this.state.rightEyeRatio);
	}

	runAction(blinking, updateTime) {
		var options = this.getCurrent();
		var key;

		if (options.binaryChoice) {
			key = blinking ? "blinkingChoice" : "notBlinkingChoice";
		} else {
			if (!blinking) {
				var highlightedIndex = this.state.highlightedIndex + 1;

				if (highlightedIndex >= options.options.length) {
					highlightedIndex = 0;
				}

				this.setState({
					highlightedIndex: highlightedIndex
				});

				this.setState({
					updateTime: updateTime,
				});

				return;
			}

			key = this.state.highlightedIndex;
		}

		if (options.options[key]) {
			var callback = options.options[key].callback;
		
			if (callback) {
				callback();
			};
		} else {
			debugger;
		}

		var path = [];

		if (!options.final) {
			path = [...this.state.path, key];
		}

		this.setState({
			path: path,
			updateTime: updateTime,
			blinkStartTime: null,
			ready: !blinking,
			highlightedIndex: 0,
		});

	}

	processData(leftEyeRatio, rightEyeRatio) {
		let currentTime = Date.now();
		
		var blinking = this.getBlinkStatus(leftEyeRatio, rightEyeRatio);

		if (!this.state.ready) {
			if (blinking) {
				return;
			}

			this.setState({
				ready: true,
				updateTime: currentTime
			});

		}

		if (blinking) {
			if (!this.state.blinkStartTime) {
				this.setState({
					blinkStartTime: currentTime
				});
			} else if (currentTime - this.state.blinkStartTime >= this.props.blinkTime) {
				this.runAction(true, currentTime);
			}
		} else {
			this.setState({
				blinkStartTime: null
			});

			if (currentTime - this.state.updateTime >= this.props.decisionTime) {
				this.runAction(false, currentTime);
			}
		}

		this.updateEyeData(leftEyeRatio, rightEyeRatio);
	}

	start() {
		cv.start(this.processData);
	}

	stop() {
		cv.stop();
	}

	render() {
		return (
			<div className="blink-controller">
				<div className="controls">
					<button onClick={this.start}>
						Start
					</button>

					<button onClick={this.stop}>
						Stop
					</button>
				</div>

				<div className="flex eye-status">
					<EyeStatus ratio={this.state.leftEyeRatio} name="Left Eye" ref={this.rightEyeDisplay}/>
					<EyeStatus ratio={this.state.rightEyeRatio} name="Right Eye" ref={this.leftEyeDisplay}/>
				</div>

				<Options current={this.getCurrent()} highlightedIndex={this.state.highlightedIndex} />
			</div>
		);
	}
}