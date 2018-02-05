export default class Stream {
	constructor(mutatorFunction) {
		this._mutatorFunction = mutatorFunction;
		this._pipedTo = [];
		this._awaits = [];
	}

	pipeTo(otherStream) {
		this._pipedTo.push(otherStream);
	}

	push(value) {
		if (this._mutatorFunction) {
			value = this._mutatorFunction(value);
		}

		if (this._awaits.length) {
			while (this._awaits.length > 0) {
				var nextAwait = this._awaits.shift();
				nextAwait(value);
			}
		} else {
			for (var i = 0; i < this._pipedTo.length; i++) {
				this._pipedTo[i].push(value);
			}
		}
	}

	nextLine() {
		return new Promise((resolve, reject) => {
			this._awaits.push(resolve);
		});
	}
}

/*
	Needs to:
	1. Receive data
	2. Send data
	3. Allow chaining of streams

	Buffered Stream Needs to:
	1. Take configurable buffer size
	2. Force producer to wait if buffer is full
	3. Force consumer to wait if buffer is empty

	Mutation Stream Needs to:
	1. Allow custom function to process each data item before being piped forwards
*/

/*
export class Stream {
	constructor() {
		this._pipedTo = [];
	}

	pipeTo(otherStream) {
		this._pipedTo.push(otherStream);
	}

	push(value) {
		for (var i = 0; i < this._pipedTo.length; i++) {
			this._pipedTo[i].push(value);
		}
	}
}

function createDeferredPush(resolve, value, stream) {
	return () => {
		if (stream._buffer.length < stream._bufferSize) {
			stream._buffer.push(value);
			resolve();
			return true;
		}
	}
}

export class BufferedStream {
	constructor(bufferSize) {
		super();
		this._bufferSize = bufferSize;
		this._buffer = [];
		this._deferredPushes = [];
	}

	push(value) {
		return new Promise((resolve, reject) => {
			if (this._buffer.length < this._bufferSize) {
				this._buffer.push(value);
				resolve();
			} else {
				this._deferredPushes.push(createDeferredPush(resolve, value, this));
			}
		});
	}
}

export class MutationStream extends Stream {
	constructor(mutatorFunction) {
		this._mutatorFunction = mutatorFunction;
	}
}*/