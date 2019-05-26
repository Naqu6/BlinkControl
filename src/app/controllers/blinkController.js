import cv from "../../build/Release/blinkDetector";
import React from "react";

export default class BlinkController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			leftEyeRatio: null,
			rightEyeRatio: null
		}

		this.start = this.start.bind(this);
		this.stop = this.start.bind(this);
	}

	start() {
		cv.start((leftEyeRatio, rightEyeRatio) => {
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
				</div>

				<div>
					Left Eye: {this.state.leftEyeRatio}

					<br />

					Right Eye: {this.state.rightEyeRatio}
				</div>

				<div>

				</div>

			</div>
		);
	}
}