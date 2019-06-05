import React from "react";
import TextEntryController from "../app/controllers/productivity/textEntry/textEntryController";
import SnakeController from "../app/controllers/games/snake/snakeController";
import BlinkController from "../app/controllers/blinkController";

export default class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			currentController: null,
		}

		this.blinkController = React.createRef();

		this.updateValues = this.updateValues.bind(this);
		this.buildApplicationOptions = this.buildApplicationOptions.bind(this);
	}

	componentDidMount() {
		this.setState({
		 	currentController: <TextEntryController updateValues={this.updateValues}/>
		 });

		this.buildApplicationOptions();
	}

	buildApplicationOptions() {
		this.applicationOptions = [{
			displayText: "Text Entry",
			callback: () => {
				this.setState({
					currentController: <TextEntryController updateValues={this.updateValues} />
				})
			}
		}, {
			displayText: "Snake",
			callback: () => {
				this.setState({
					currentController: <SnakeController updateValues={this.updateValues} />
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
				{this.state.currentController}
				<BlinkController decisionTime={700} blinkTime={350} values={[]} ref={this.blinkController}/>
			</div>
		); 
	}
}