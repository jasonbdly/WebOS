import Dexie from 'dexie';

var tableDefs = {
	testfiles: '++id, name, content',
	users: '++id, name',
	files: '++id, name, content, folder',
	folders: '++id, name, parent'
};

export default class FileSystem {
	constructor() {
		this._db = new Dexie('WebOS');
		this._db.version(1).stores(tableDefs);
	}

	async write(table, path, pathField, content, contentField) {
		return this._db.transaction('rw', this._db[table], function*() {
			var existingFiles = yield this.db[table]
				.where(pathField).equals(path);

			return existingFiles.count()
				.then(count => {
					if (count > 0) {
						var modification = {};
						modification[contentField] = content;
						return existingFiles.modify(modification);
					} else {
						var newData = {};
						newData[pathField] = path;
						newData[contentField] = content;
						return this.db[table]
							.add(newData);
					}
				})
		});
	}

	async writeFile(name, content) {
		// TODO: Convert to write to separate table per-user
		//return this.write();
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

	async listFiles() {
		return this._db.transaction('r', this._db.testfiles, function*() {
			return this.db.testfiles.toArray();
		});
	}

	async createUser(username) {

	}
}