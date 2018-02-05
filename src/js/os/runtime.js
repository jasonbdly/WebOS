import * as programs from './programs/programs';
import Stream from './stream/stream';
import User from './user/user';
import { getUser } from './user/user';

import FileSystem from './filesystem/filesystem';

import * as MSGS from './messages/messages';

var osInst = null;

export default class OS {
	static getOS() {
		return osInst;
	}

	constructor($input, $output, awaitingInputSymbol) {
		if (osInst) {
			return osInst;
		} else {
			osInst = this;
			this._hasInit = false;

			this._machineName = 'WebOS';
			this._awaitingInputSymbol = awaitingInputSymbol;
			this._cursorPrefix = 'guest@' + this._machineName + this._awaitingInputSymbol;

			this._user = null;
			this._commandIndex = -1;

			this.$input = $input;
			this.$output = $output;

			this.resetInput();
			this.$input.keydown(e => {
				if (e.which === 8) {
					// BACKSPACE
					if (this.$input.value().length === this._cursorPrefix.length) {
						e.preventDefault();
					}
				} else if (e.which === 38) {
					// UP
					this._commandIndex++;

					var lastCommand = this._user.getCommandNAgo(this._commandIndex);

					if (lastCommand) {
						this.setInput(lastCommand);
					} else {
						this._commandIndex--;
					}

					e.preventDefault();
				} else if (e.which === 40) {
					// DOWN
					this._commandIndex--;

					var lastCommand = this._user.getCommandNAgo(this._commandIndex);

					if (lastCommand) {
						this.setInput(lastCommand);
					} else {
						this.setInput('');
						this._commandIndex = -1;
					}

					e.preventDefault();
				}
			});

			this.$input.on('select', e => {
				this.$input.setSelectionRange(Math.max(e.target.selectionStart, this._cursorPrefix.length), e.target.selectionEnd);
			});

			this._inputStreamReader = new StandardInputReaderStream(this.$input, nextLine => {
				this._commandIndex = -1;
				return nextLine.substring(this._cursorPrefix.length, nextLine.length);
			});

			this._commandProcessorStream = new Stream(nextLine => {
				this.writeOutput('\r\n' + this._awaitingInputSymbol + nextLine);
				this.processCommand(nextLine);
				this.$input.value(this._cursorPrefix).focus();
			});

			this._inputStreamReader.pipeTo(this._commandProcessorStream);

			dom(document.body).click(e => {
				this.$input.focus();
				e.preventDefault();
			});

			this._outputStreamWriter = new Stream(nextLineData => {
				this.$output.append(
					dom('<div/>')
					.addClass(nextLineData.type)
					.text(nextLineData.value)
				);
			});

			this.init();
		}
	}

	async init() {
		if (!this._hasInit) {

			if (!this._user) {
				this.writeOutput(MSGS.LOG_IN_PROMPT);
				var userName = await this._inputStreamReader.nextLine();
				var user = getUser(userName);
				this._user = user;

				this.writeOutput(MSGS.WELCOME + ' ' + userName);
				this._cursorPrefix = userName + '@' + this._machineName + this._awaitingInputSymbol;
				this.resetInput();
			}

			this._fileSystem = new FileSystem();

			this._hasInit = true;
		}
	}

	getInputStream() {
		return this._inputStreamReader;
	}

	resetInput() {
		this.$input.value(this._cursorPrefix).focus();
	}

	setInput(value) {
		this.resetInput();
		this.$input.value(this.$input.value() + value);
	}

	writeOutput(value, type) {
		this._outputStreamWriter.push({
			value: value,
			type: type || 'status'
		});
	}

	clearOutput() {
		this.$output.empty();
	}

	async processCommand(command) {
		this._user.addToCommandHistory(command);

		let commandArgs = command.split(' ');
		let programName = commandArgs.splice(0, 1)[0];

		try {
			if (!programs[programName]) {
				throw new Error(programName + ': command not found');
			}

			var result = await programs[programName].apply(this, commandArgs);

			if (result) {
				this.writeOutput(result, 'status');
			}
		} catch (error) {
			this.writeOutput(error.message, 'error');
		}
	}
}

class StandardInputReaderStream extends Stream {
	constructor($elem, mutatorFunction) {
		super(mutatorFunction);

		$elem.inputLine(e => {
			this.push(e.detail.value);
		});
	}
}