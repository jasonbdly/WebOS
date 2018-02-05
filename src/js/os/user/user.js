export default class User {
	constructor(name) {
		this._name = name;
		this._commandHistory = [];
	}

	addToCommandHistory(command) {
		this._commandHistory.push(command);
	}

	getCommandHistory() {
		return this._commandHistory;
	}

	getLastCommand() {
		return this._commandHistory[this._commandHistory.length - 1];
	}

	getCommandNAgo(n) {
		return this._commandHistory[this._commandHistory.length - 1 - n];
	}
}

var userRegistry = {};
export function getUser(username) {
	return userRegistry[username] || (userRegistry[username] = (new User(username)));
}