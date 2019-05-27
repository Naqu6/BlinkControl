import React from "react";
import TextEntry from "./textEntry";
import BlinkController from "../../blinkController";

export default class TextEntryController extends React.Component {
	constructor(props) {
		super(props);
		
		this.textEntry = React.createRef();
	}

	render() {
		return (
			<div className="flex">
				<TextEntry ref={this.textEntry} />

				<BlinkController decisionTime={1000} blinkTime={350} values={
					{
						displayText: "root",
						binaryChoice: false,
						final: false,
						options: [{
							binaryChoice: true,
							final: false,
							displayText: "Start Selecting Text",
							options: {
								blinkingChoice: {
									displayText: "A,B",
									binaryChoice: false,
									final: true,
									options: [{
										displayText: "A",
										callback: () => {
											this.textEntry.current.addText("A")
										}
									}, {
										displayText: "B",
										callback: () => {
											this.textEntry.current.addText("B")
										}
									}, {
										displayText: "back"
									}]
								}, notBlinkingChoice: {
									displayText: "C,D",
									binaryChoice: false,
									final: true,
									options: [{
										displayText: "C",
										callback: () => {
											this.textEntry.current.addText("C")
										}
									}, {
										displayText: "D",
										callback: () => {
											this.textEntry.current.addText("D")
										}
									}, {
										displayText: "Back"
									}]
								}
							}
						}]
					}
				}/>
			</div>
		);
	}
}