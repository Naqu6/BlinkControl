import React from "react";

export default class TextEntry extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: ""
		}

		this.addText = this.addText.bind(this);
		this.currentWord = "";
	}

	addText(text) {
		this.setState({
			text: this.state.text + text.toUpperCase()
		});

		if (text.match(/[a-z]/i)) {
			this.currentWord += text;
		} else {
			this.currentWord = "";
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

	render() {
		return (
			<div className="text-entry-controller card">
				<div className="controller-title">
					Text Entry
				</div>

				<div>
					<div className="entered-text">
						{this.state.text}
					</div>
				</div>
			</div>
		);
	}
}