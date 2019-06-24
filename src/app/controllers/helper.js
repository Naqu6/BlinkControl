// Binary search implementation
export function minTreeOptions(values, callbackMethod) {
	var halfIndex = Math.ceil(values.length/2);

	if (halfIndex > 2) {
		var start = values.slice(0, halfIndex);
		var end = values.slice(halfIndex, values.length);
		
		var blinkingOptions = minTreeOptions(start, callbackMethod);
		var notBlinkingOptions = minTreeOptions(end, callbackMethod);

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
		var options = values.map((value) => {
			return {
				displayText: value,
				callback: () => {
					callbackMethod(value)
				}
			};
		});

		return options;
	}
}

export function gridDisplay(letters, callbackMethod) {
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

		results.push({
			options: options,
			displayText: displayText,
		});
	}

	return results;
}