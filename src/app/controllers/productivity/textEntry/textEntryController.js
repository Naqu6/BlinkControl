import React from "react";
import TextEntry from "./textEntry";
import predictor from "../../../../build/Release/letterPredictor";

import {minTreeOptions} from "../../helper.js";

var possibleLetters = Array(26).fill(1).map((_, i) => String.fromCharCode(65 + i));


function generateTextValues(callback) {
	var letterOptions = minTreeOptions(possibleLetters, callback);
	// var letterOptions = gridLetterDisplay(possibleLetters, callback)

	return {
		displayText: "Letters",
		options: letterOptions
	}
}

function getPuncuationValues(callback, deleteCallback) {
	return {
		displayText: "Puncuation",
		options: [{
			options: [{
				displayText: "Space",
				callback: () => {
					callback(" ");
				}
			}, {
				displayText: "Backspace",
				callback: deleteCallback,
			}, {
				displayText: "Linebreak",
				callback: () => {
					callback("\n");
				}
			}]
		}, {
			options: [{
				displayText: "Period",
				callback: () => {
					callback(". ");
				}
			}, {
				displayText: "Comma",
				callback: () => {
					callback(", ");
				}
			}, {
				displayText: "Question Mark",
				callback: () => {
					callback("? ");
				}
			}]
		}]
	}
}



export default class TextEntryController extends React.Component {
	constructor(props) {
		super(props);

		this.addText = this.addText.bind(this);
		this.deleteText = this.deleteText.bind(this);
		
		this.textEntry = React.createRef();
		this.resetTextEntryValues = this.resetTextEntryValues.bind(this);
		this.letterSuggestions = this.letterSuggestions.bind(this);
		this.getText = this.getText.bind(this);
	}

	componentDidMount() {
		this.resetTextEntryValues()
	}

	resetTextEntryValues() {
		this.props.updateValues([
			generateTextValues(this.addText),
			getPuncuationValues(this.addText, this.deleteText),
		]);
	}

	letterSuggestions(currentWord) {
		if (currentWord) {
			var predictorResults = predictor.nextLetters(currentWord.toLowerCase());

			var letterOptions = minTreeOptions(predictorResults.letters.sort(), this.addText);
			var wordPredictions = minTreeOptions(predictorResults.words, (text) => {
				this.addText(text.substr(currentWord.length) + " ");

				this.textEntry.current.setCurrentWord("");
				this.letterSuggestions("");
			});

			this.props.updateValues([
				{
					displayText: "Letters",
					options: letterOptions
				}, {
					displayText: "Word Predictions",
					options: wordPredictions,
				}, getPuncuationValues(this.addText, this.deleteText),
				{
					displayText: "All Letters",
					options: [],
					callback: this.resetTextEntryValues
				}
			]);
		} else {
			this.resetTextEntryValues();
		}
	}

	addText(text) {
		this.letterSuggestions(this.textEntry.current.addText(text));
	}

	deleteText() {
		this.letterSuggestions(this.textEntry.current.backspace());
	}

	getText() {
		return this.textEntry.current.getText();
	}

	render() {
		return (
			<TextEntry ref={this.textEntry} />
		);
	}
}