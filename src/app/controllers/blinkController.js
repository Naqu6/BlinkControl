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
				Blink Options: {props.current.options.blinkingChoice.displayText}
			</div>

			<br/>

			<div>
				No-Blink Options: {props.current.options.notBlinkingChoice.displayText}
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
							<div>
								<b>
									{option.displayText}
								</b>
							</div>
						);
					} else {
						return (
							<div>
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
		this.updateBlinkData = this.updateBlinkData.bind(this);
	}

	getCurrent() {
		var current = this.props.values; 

		this.state.path.forEach((key) => {
			current = current.options[key];
		});

		return current;
	}

	getBlinkStatus(leftEyeRatio, rightEyeRatio) {
		if (leftEyeRatio < 0.3 && rightEyeRatio < 0.3) {
			return true;
		} else {
			return false;
		}
	}

	updateBlinkData(leftEyeRatio, rightEyeRatio) {
		this.setState({
			leftEyeRatio: parseFloat(leftEyeRatio),
			rightEyeRatio: parseFloat(rightEyeRatio),
		});
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

			key  = this.state.highlightedIndex;
		}

		var callback = options.options[key].callback;
		
		if (callback) {
			callback();
		};

		var path = [];

		if (!options.final) {
			path = [...this.state.path, key];
		}

		this.setState({
			path: path
		});

		this.setState({
			updateTime: updateTime + this.props.decisionTime,
			blinkStartTime: null
		});

	}

	processData(leftEyeRatio, rightEyeRatio) {
		let currentTime = Date.now();

		this.updateBlinkData(leftEyeRatio, rightEyeRatio)

		var timeDelta = currentTime - this.state.updateTime;

		if (timeDelta < 0) {
			return;
		}
		
		var blinking = this.getBlinkStatus(leftEyeRatio, rightEyeRatio);

		if (blinking) {
			if (!this.state.blinkStartTime) {
				this.setState({
					blinkStartTime: currentTime
				});
			} else if (currentTime - this.state.blinkStartTime >= this.props.decisionTime) {
				this.runAction(true, currentTime);
			}
		} else {
			this.setState({
				blinkStartTime: null
			});

			if (timeDelta >= this.props.decisionTime) {
				this.runAction(false, currentTime);
			}
		}
	}

	start() {
		cv.start(this.processData);
	}

	stop() {
		cv.stop();
	}

	render() {
		return (
			<div>
				<div>
					<button onClick={this.start}>
						Start
					</button>

					<button onClick={this.stop}>
						Stop
					</button>
				</div>

				<div>
					Left Eye: {this.state.leftEyeRatio}

					<br />

					Right Eye: {this.state.rightEyeRatio}
				</div>

				<Options current={this.getCurrent()} highlightedIndex={this.state.highlightedIndex} />
			</div>
		);
	}
}