import React from "react";

export default class TextEntry extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: ""
		}

		this.addText = this.addText.bind(this);
		this.currentWord = "";

		this.setCurrentWord = this.setCurrentWord.bind(this);
		this.getText = this.getText.bind(this);
	}

	setCurrentWord(word) {
		this.currentWord = word;
	}

	addText(text) {
		this.setState({
			text: this.state.text + text.toUpperCase()
		});

		if (text.match(/[a-z]/i)) {
			this.setCurrentWord(this.currentWord + text);
		} else {
			this.setCurrentWord("");
		}

		return this.currentWord;
	}

	backspace() {
		this.setState({
			text: this.state.text.substring(0, this.state.text.length - 1)
		});

		this.currentWord.substring(this.currentWord.length - 1);

		return this.currentWord;
	}

	getText() {
		return this.state.text;
	}

	render() {
		return (
			<div className="text-entry-controller">
				<div className="entered-text">
					{this.state.text}
				</div>
			</div>
		);
	}
}