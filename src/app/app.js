import React from "react";
import BlinkController from "../app/controllers/blinkController";

export default class App extends React.Component {
	render() {
		var options = {
			displayText: "root",
			binaryChoice: false,
			final: false,
			options: [{
				binaryChoice: true,
				final: false,
				displayText: "Start",
				options: {
					blinkingChoice: {
						displayText: "Blink for this choice",
						binaryChoice: false,
						final: true,
						options: [{
							displayText: "You blink!"
						}, {
							displayText: "Back",
						}]
					}, notBlinkingChoice: {
						displayText: "Don't blink for this choice",
						binaryChoice: false,
						final: true,
						options: [{
							displayText: "You didn't blink!"
						}, {
							displayText: "Back",
						}]
					}
				}
			}]
		};

		return (
			<BlinkController decisionTime={500} values={options}/>
		);
	}
}