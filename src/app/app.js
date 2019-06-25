import React from "react";

import SpeechController from "../app/controllers/productivity/speech/speechController";
import TextEntryController from "../app/controllers/productivity/textEntry/textEntryController";

import SnakeController from "../app/controllers/games/snake/snakeController";

import BlinkController from "../app/controllers/blinkController";

export default class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			currentController: {},
		}

		this.blinkController = React.createRef();

		this.updateValues = this.updateValues.bind(this);
		this.buildApplicationOptions = this.buildApplicationOptions.bind(this);
	}

	componentDidMount() {
		this.setState({
		 	currentController: {
		 		controller: <TextEntryController updateValues={this.updateValues} />,
		 		name: "Text Entry"
		 	}
		 });

		this.buildApplicationOptions();
	}

	buildApplicationOptions() {
		this.applicationOptions = [{
			displayText: "Speech Controller",
			callback: (name) => {
				this.setState({
					currentController: {
						controller: <SpeechController updateValues={this.updateValues} />,
						name: name
					}
				});
			}
		}, {
			displayText: "Text Entry",
			callback: (name) => {
				this.setState({
					currentController: {
						controller: <TextEntryController updateValues={this.updateValues} />,
						name: name
					}
				})
			}
		}, {
			displayText: "Snake",
			callback: (name) => {
				this.setState({
					currentController: {
						controller: <SnakeController updateValues={this.updateValues} />,
						name: name
					}
				})
			}
		}];
	}

	updateValues(values) {
		this.blinkController.current.updateValues([
			...values,
			{
				displayText: "Change Application",
				options: this.applicationOptions
			}
		]);
	}

	render() {
		return (
			<div className="application-container flex">
				<BlinkController decisionTime={800} blinkTime={350} values={[]} ref={this.blinkController} />
				<div className="current-app-container card">
					<div className="controller-title">
						{this.state.currentController.name}
					</div>
					{this.state.currentController.controller}
				</div>
			</div>
		); 
	}
}