import React from "react";

export default class TextEntry extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: ""
		}

		this.addText = this.addText.bind(this);
	}

	addText(text) {
		this.setState({
			text: this.state.text + text
		});
	}

	backspace() {
		this.setState({
			text: this.state.text.substring(0, this.state.text.length)
		})
	} 

	render() {
		return (
			<div className="text-entry-container">
				<div>
					Text Entered so far:
				</div>

				<div>
					{this.state.text}
				</div>
			</div>
		);
	}
}