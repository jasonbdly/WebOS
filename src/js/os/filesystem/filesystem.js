import Dexie from 'dexie';

export default class FileSystem {
	constructor() {
		this._db = new Dexie('FileSystem');

		this._db.version(1).stores({
			testfiles: '++id, name, content'
		});
	}

	async writeFile(name, content) {
		return this._db.transaction('rw', this._db.testfiles, function*() {
			var existingFiles = yield this.db.testfiles
				.where('name').equals(name);

			return existingFiles.count()
				.then(count => {
					if (count > 0) {
						return existingFiles.modify({ content: content });
					} else {
						return this.db.testfiles
							.add({
								name: name,
								content: content
							});
					}
				});
		});
	}

	async readFile(name) {
		return this._db.transaction('r', this._db.testfiles, function*() {
			let matchingFiles = yield this.db.testfiles
				.where('name').equals(name);

			return matchingFiles.count()
				.then(count => {
					if (count === 0) {
						throw new Error('Could not find file: ' + name);
					} else {
						return matchingFiles.first();
					}
				});
		});
	}

	async deleteFile(name) {
		return this._db.transaction('rw', this._db.testfiles, function*() {
			return this.db.testfiles.where('name').equals(name).delete();
		});
	}
}