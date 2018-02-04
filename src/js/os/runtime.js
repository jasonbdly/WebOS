import * as programs from './programs/programs';

export default class OS {
	constructor($input, $output, awaitingInputSymbol) {
		this.$input = $input;
		this.$output = $output;

		this.$input.value(awaitingInputSymbol).focus();

		this.$input.keypress(e => {
			if (e.which === 13) {
				var inputValue = this.$input.value();
				inputValue = inputValue.substring(awaitingInputSymbol.length, inputValue.length);
				this.processCommand(inputValue);
				this.$input.value(awaitingInputSymbol).focus();
			}
		});

		this.$input.keydown(e => {
			if (e.which === 8) {
				if (this.$input.value().length === awaitingInputSymbol.length) {
					e.preventDefault();
				}
			}
		});
	}

	processCommand(command) {
		let commandArgs = command.split(' ');
		let programName = commandArgs.splice(0, 1)[0];

		try {
			if (!programs[programName]) {
				throw new Error(programName + ': command not found');
			}

			var result = programs[programName].apply(this, commandArgs);

			this.$output.append(
				dom('<div/>')
				.addClass('status')
				.text(result)
			);
		} catch (error) {
			this.$output.append(
				dom('<div/>')
				.addClass('error')
				.text(error.message)
			);
		}
	}
}