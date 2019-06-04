import React from "react";
import TextEntry from "./textEntry";
import BlinkController from "../../blinkController";
import predictor from "../../../../build/Release/letterPredictor";

var possibleLetters = Array(26).fill(1).map((_, i) => String.fromCharCode(65 + i));

function gridLetterDisplay(letters, callbackMethod) {
	var numberOfRows = Math.ceil(Math.sqrt(letters.length));

	var results = [];


	for (var i = 0; i < numberOfRows; i++) {
		var counter = i * numberOfRows;
		const stop = counter + numberOfRows;

		var options = [];

		var displayText = "";

		while (counter < letters.length && counter < stop) {
			const letter = letters[counter]

			options.push({
				displayText: letter,
				callback: () => {
					callbackMethod(letter);
				},
			});

			counter++;
		}

		options.push({
			displayText: "Back"
		});

		results.push({
			options: options,
			displayText: displayText,
		});
	}

	return results;
}

// Binary search implementation
function textOptions(letters, callbackMethod) {
	var halfIndex = Math.ceil(letters.length/2);

	if (halfIndex > 2) {
		var start = letters.slice(0, halfIndex);
		var end = letters.slice(halfIndex, letters.length);
		
		var blinkingOptions = textOptions(start, callbackMethod);
		var notBlinkingOptions = textOptions(end, callbackMethod);

		var final = !(Math.ceil(halfIndex/2) > 2);

		return [{
			// displayText: `${start[0]} through ${start[start.length - 1]}`,
			displayText: "",
			options: blinkingOptions,
		}, {
			// displayText: `${end[0]} through ${end[end.length - 1]}`,
			displayText: "",
			options: notBlinkingOptions,
		}];/*{
			blinkingChoice: {
				displayText: `${start[0]} through ${start[start.length - 1]}`,
				options: blinkingOptions,
			}, notBlinkingChoice: {
				displayText: `${end[0]} through ${end[end.length - 1]}`,
				options: notBlinkingOptions,
			}
		}*/
	} else {
		var options = letters.map((letter) => {
			return {
				displayText: letter,
				callback: () => {
					callbackMethod(letter)
				}
			};
		});

		return options;
	}
}

function generateTextValues(callback) {
	var letterOptions = textOptions(possibleLetters, callback);
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
			displayText: "Space, Backspace, Linebreak",
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
			}, {
				displayText: "Back",
			}]
		}, {
			displayText: "Puncuation",
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
			}, {
				displayText: "Back"
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
		this.blinkController = React.createRef();
		this.resetTextEntryValues = this.resetTextEntryValues.bind(this);
		this.letterSuggestions = this.letterSuggestions.bind(this);
	}

	resetTextEntryValues() {
		this.blinkController.current.updateValues([
			generateTextValues(this.addText),
			getPuncuationValues(this.addText, this.deleteText),
		]);
	}

	letterSuggestions(currentWord) {
		if (currentWord) {
			var possibleLetters = predictor.nextLetters(currentWord.toLowerCase()).sort();

			var newOptions = textOptions(possibleLetters, this.addText);

			this.blinkController.current.updateValues([
				{
					displayText: "Letters",
					options: newOptions
				}, getPuncuationValues(this.addText, this.deleteText),
				{
					displayText: "Back",
					options: [],
					callback: this.resetTextEntryValues
				}
			]);
		} else {
			this.resetTextEntryValues()
		}
	}

	addText(text) {
		this.letterSuggestions(this.textEntry.current.addText(text));
	}

	deleteText() {
		this.letterSuggestions(this.textEntry.current.backspace());
	}

	render() {
		return (
			<div className="flex">
				<TextEntry ref={this.textEntry} />

				<BlinkController decisionTime={700} blinkTime={350} values={[
					generateTextValues(this.addText),
					getPuncuationValues(this.addText, this.deleteText),
				]} ref={this.blinkController}/>
			</div>
		);
	}
}