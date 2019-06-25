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

function getKey(path) {
	return btoa(JSON.stringify(path));
}

function MultipleOptions(props) {
	if (!props.options) return <div/>;

	return (
		<div className={`options ${props.flexDisplay ? "flex" : "" } multiple-options`}>
			{
				props.options.map((option, index) => {
					var activePath = index == props.path[0];
					var highlighted = (props.highlightedIndex == index && props.path.length == 0) ? "highlighted" : "";
					var options = option.options;

					return (
						<div className={`option ${highlighted}`} key={getKey([...props.path, index])}>
							<div className="option-title">
								{option.displayText}
							</div>

							<Options options={option.options} path={props.path.slice(1)} flexDisplay={option.flexDisplay} highlightedIndex={activePath ? props.highlightedIndex : -1}/>
						</div>
					);
				})
			}
		</div>
	);
}

function Options(props) {
	return MultipleOptions(props);
	// if (props.current.binaryChoice) {
	// 	return BinaryOptions(props);
	// } else {
	// 	return MultipleOptions(props);
	// }
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

		this.running = false;

		this.eyeData = {
			current: {
				left: null,
				right: null,
			}, calibration: {
				left: {
					open: 0.35,
					closed: 0.25,
					mid: 0.3,
				}, right: {
					open: 0.35,
					closed: 0.25,
					mid: 0.3,
				}
			}
		}

		this.state = {
			path: [],
			highlightedIndex: 0,
			blinkStartTime: startTime,
			updateTime: startTime,
			ready: false,
			sensitivity: 0.5,
			selectionValues: [],
			blinking: false,
		}

		this.start = this.start.bind(this);
		this.startCV = this.startCV.bind(this);
		this.stop = this.stop.bind(this);

		this.processData = this.processData.bind(this);
		this.getCurrent = this.getCurrent.bind(this);
		this.updateEyeData = this.updateEyeData.bind(this);
		this.currentIsBinary = this.currentIsBinary.bind(this);
		this.getDecisionTime = this.getDecisionTime.bind(this);

		this.calibrate = this.calibrate.bind(this);
		this.calibrateOpenEye = this.calibrateOpenEye.bind(this);
		this.calibrateClosedEye = this.calibrateClosedEye.bind(this);

		this.leftEyeDisplay = React.createRef();
		this.rightEyeDisplay = React.createRef();
	}

	componentDidMount() {
		this.updateValues(this.props.values);
	}

	calibrate() {
		this.eyeData.calibration.left.mid = this.state.sensitivity * this.eyeData.calibration.left.open + (1 - this.state.sensitivity) * this.eyeData.calibration.left.closed;
		this.eyeData.calibration.right.mid = this.state.sensitivity * this.eyeData.calibration.right.open + (1 - this.state.sensitivity) * this.eyeData.calibration.right.closed;
	}

	calibrateOpenEye() {
		this.eyeData.calibration.left.open = this.eyeData.current.left;
		this.eyeData.calibration.right.open = this.eyeData.current.right;

		this.calibrate();
	}

	calibrateClosedEye() {
		this.eyeData.calibration.left.closed = this.eyeData.current.left;
		this.eyeData.calibration.right.closed = this.eyeData.current.right;
		
		this.calibrate();
	}

	getCurrent() {
		var current = this.state.selectionValues; 

		this.state.path.forEach((key) => {
			current = current.options[key];
		});

		return current;
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

	isBlinking(currentRatio, calibratedRatio) {
		return currentRatio <= calibratedRatio;
	}

	updateEyeData(leftEyeRatio, rightEyeRatio) {
		var blinking = this.isBlinking(leftEyeRatio, this.eyeData.calibration.left.mid) && this.isBlinking(rightEyeRatio, this.eyeData.calibration.right.mid);

		this.eyeData.current = {
			left: leftEyeRatio,
			right: rightEyeRatio
		}

		return blinking;
		// this.setState({
		// 	leftEyeRatio: parseFloat(leftEyeRatio),
		// 	rightEyeRatio: parseFloat(rightEyeRatio),
		// });

		// this.leftEyeDisplay.current.setRatio(this.eyeData.leftEyeRatio);
		// this.rightEyeDisplay.current.setRatio(this.eyeData.rightEyeRatio);
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
		} else {
			debugger;
		}

		if (this.state.path.length) {
			options.options.pop();			
		}

		var path = [];

		if (options.options[key] && options.options[key].options && !options.final) {
			path = [...this.state.path, key];

			options.options[key].options.push({
				"displayText": "Back",
			});
		}

		this.setState({
			path: path,
			updateTime: updateTime,
			blinkStartTime: null,
			ready: !blinking,
			highlightedIndex: 0,
		});

		if (callback) {
			callback();
		}
	}

	processData(leftEyeRatio, rightEyeRatio) {
		var blinking = this.updateEyeData(leftEyeRatio, rightEyeRatio);

		this.setState({
			blinking: blinking,
		});

		if (!this.running) {
			return;
		}

		let currentTime = Date.now();

		if (!this.state.ready) {
			if (blinking) {
				return;
			}

			this.setState({
				ready: true,
				updateTime: currentTime,
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
	}

	cleanValues(values) {
		var bottomOfTree = true;

		values.options.forEach((value) => {
			if (value.options) {
				bottomOfTree = false;
				this.cleanValues(value);
			}
		});

		values.flexDisplay = bottomOfTree;
	}

	updateValues(values) {
		const currentTime = Date.now();

		values = {
			options: values,
		};
		
		this.cleanValues(values);

		this.setState({
			selectionValues: values,
			path: [],
			highlightedIndex: 0,
			blinkStartTime: currentTime,
			updateTime: currentTime,
			ready: false,
		});
	}

	startCV() {
		cv.start((a, b) => {
			this.processData(parseFloat(a), parseFloat(b));
		});
	}

	start() {
		this.setState({
			path: [],
			blinkStartTime: null,
			highlightedIndex: 0,
		});

		this.running = true;
	}

	stop() {
		this.running = false;
	}

	render() {
		return (
			<div className="blink-controller card flex">
				<div class="controller-data">
					<div className="controller-title">
						Blink Controller
					</div>

					<div className="controls-container">
						<div className="sub-title">
							Setup
						</div>

						<div className="controls">
							<button onClick={this.startCV}>
								Enable CV
							</button>

							<button onClick={this.start}>
								Start
							</button>

							<button onClick={this.stop}>
								Stop
							</button>

							<button onClick={this.calibrateOpenEye}>
								Calibrate Open Eye
							</button>

							<button onClick={this.calibrateClosedEye}>
								Calibrate Closed Eye
							</button>
						</div>
					</div>

					<div className="eye-status">
						Status: {this.state.blinking ? "Blinking": "Not Blinking"}
					</div>
				</div>

				<div className="options-container">
					<Options options={this.state.selectionValues.options} flexDisplay={this.state.selectionValues.flexDisplay} path={this.state.path} highlightedIndex={this.state.highlightedIndex}
						makeVisible={(ref) => {
							window.scrollTo(0, ref.current.offsetTop);
						}}
					/>
				</div>
			</div>
		);
	}

	componentDidUpdate() {
		const element = document.querySelector(".option.highlighted");

		if (element) {
			element.scrollIntoView();
		}
  }
}