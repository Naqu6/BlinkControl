import cv from "../../build/Release/blinkDetector";
import React from "react";

export default class BlinkController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			leftEyeRatio: null,
			rightEyeRatio: null,
			startTime: Date.now(),
			aselected: true,
			running: true
		}

		this.start = this.start.bind(this);
		this.stop = this.start.bind(this);
	}

	start() {
		cv.start((leftEyeRatio, rightEyeRatio) => {
			let currentTime = Date.now();

			if (this.state.running) {
				if (leftEyeRatio < 0.3 && rightEyeRatio < 0.3) {
					this.setState({running: false})
				} else if (currentTime - this.state.startTime > 500) {
					this.setState({
						aselected: !this.state.aselected,
						startTime: currentTime,
					});
				}
			}

			this.setState({
				leftEyeRatio: parseFloat(leftEyeRatio),
				rightEyeRatio: parseFloat(rightEyeRatio)
			})			
		});
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

					<button onClick={this.resetGame}>

					</button>
				</div>

				<div>
					Left Eye: {this.state.leftEyeRatio}

					<br />

					Right Eye: {this.state.rightEyeRatio}
				</div>

				<div class="a">
					A {this.state.aselected ? "- Selected" : ""}
				</div>

				<div class="b">
					B {this.state.aselected ? "" : "- Selected"}
				</div>

			</div>
		);
	}
}