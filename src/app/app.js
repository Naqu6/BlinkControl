import React from "react";
import TextEntryController from "../app/controllers/productivity/textEntry/textEntryController";
import SnakeController from "../app/controllers/games/snake/snakeController";

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		// return <SnakeController />
		return <TextEntryController />;
	}
}