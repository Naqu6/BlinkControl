import React from "react";
import SnakeController from "../app/controllers/games/snake/snakeController";

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <SnakeController />;
	}
}