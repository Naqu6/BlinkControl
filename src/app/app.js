import React from "react";
import TextEntryController from "../app/controllers/productivity/textEntry/textEntryController";

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <TextEntryController />;
	}
}