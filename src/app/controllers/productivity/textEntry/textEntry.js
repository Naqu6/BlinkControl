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

	render() {
		return (
			<div>
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