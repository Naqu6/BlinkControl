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
			displayText += letter;
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
			binaryChoice: false,
			final: true,
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
			displayText: `${start[0]} through ${start[start.length - 1]}`,
			options: blinkingOptions,
			binaryChoice: false,
			final: final,
		}, {
			displayText: `${end[0]} through ${end[end.length - 1]}`,
			options: notBlinkingOptions,
			binaryChoice: false,
			final: final,
		}];/*{
			blinkingChoice: {
				displayText: `${start[0]} through ${start[start.length - 1]}`,
				options: blinkingOptions,
				binaryChoice: binaryChoice,
				final: !binaryChoice,
			}, notBlinkingChoice: {
				displayText: `${end[0]} through ${end[end.length - 1]}`,
				options: notBlinkingOptions,
				binaryChoice: binaryChoice,
				final: !binaryChoice,
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

		options.push({
			displayText: "Back",
		});

		return options;
	}
}

function generateTextValues(callback) {
	var letterOptions = gridLetterDisplay(possibleLetters, callback)
	// var binaryChoice = options.constructor != Array;

	return {
		displayText: "Letters",
		binaryChoice: false,
		final: false,
		options: letterOptions
	}
}

function getPuncuationValues(callback, deleteCallback) {
	return {
		displayText: "Puncuation",
		binaryChoice: false,
		final: false,
		options: [{
			displayText: "Space, Backspace, Linebreak",
			binaryChoice: false,
			final: true,
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
			binaryChoice: false,
			final: true,
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
	}

	resetTextEntryValues() {
		this.blinkController.current.updateValues({
			displayText: "root",
			binaryChoice: false,
			final: false,
			options: [
				generateTextValues(this.addText),
				getPuncuationValues(this.addText, this.deleteText),
			]
		});
	}

	addText(text) {
		var currentWord = this.textEntry.current.addText(text);

		if (currentWord) {
			var possibleLetters = predictor.nextLetters(currentWord.toLowerCase()).sort();

			var newOptions = gridLetterDisplay(possibleLetters, this.addText);

			this.blinkController.current.updateValues({
				displayText: "root",
				binaryChoice: false,
				final: false,
				options: [
					{
						displayText: "Letters",
						binaryChoice: false,
						final: false,
						options: newOptions
					}, 
					getPuncuationValues(this.addText, this.deleteText),
					{
						displayText: "Back",
						binaryChoice: false,
						final: true,
						options: [],
						callback: this.resetTextEntryValues
					}

				]
			});
		} else {
			this.resetTextEntryValues()
		}
	}

	deleteText() {
		this.textEntry.current.backspace();
	}

	render() {
		debugger;
		return (
			<div className="flex">
				<TextEntry ref={this.textEntry} />

				<BlinkController decisionTime={700} blinkTime={350} values={{
					displayText: "root",
					binaryChoice: false,
					final: false,
					options: [
						generateTextValues(this.addText),
						getPuncuationValues(this.addText, this.deleteText),
					]
				}} ref={this.blinkController}/>
			</div>
		);
	}
}