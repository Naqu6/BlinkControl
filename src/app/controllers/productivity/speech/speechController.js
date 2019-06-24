import React from "react";
import TextEntryController from "../textEntry/textEntryController";

import {minTreeOptions} from "../../helper.js";

var speechWords = [
	"Hi", "How are you?", "I'm doing well"
];

export default class SpeechController extends React.Component {
	constructor(props) {
		super(props);

		this.textEntryController = React.createRef();

		this.state = {
			speechValues: speechWords
		}

		this.speakAction = this.speakAction.bind(this);
		this.updateValues = this.updateValues.bind(this);
	}

	speakAction(text) {
		console.log("Spoke:", text);
	}

	updateValues(values) {
		this.props.updateValues([
			{
				displayText: "Speakable Words",
				options: minTreeOptions(speechWords, this.speakAction)
			}, {
				displayText: "Text Entry",
				options: [{
					displayText: "Speak & Clear Text",
					callback: () => {
						this.speakAction(this.textEntryController.current.getText());
					}
				}, {
					displayText: "",
					options: values
				}]
			}
		]);
	}

	render() {
		return <TextEntryController updateValues={this.updateValues} ref={this.textEntryController}/>;
	}
}