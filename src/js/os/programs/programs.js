import OS from './../runtime';

export async function writeFile(name, content) {
	return OS.getOS()._fileSystem.writeFile(name, content)
		.then(file => undefined);
}

export async function echo(value) {
	return value;
}

export async function clear() {
	OS.getOS().clearOutput();
}

export async function ls() {
	return OS.getOS()._fileSystem.listFiles()
		.then(files => ['------------------', '| NAME\t| SIZE (B)', '------------------'].concat(
			files.map(file => '| ' + file.name + '\t| ' + file.content.length)
		).join('\r\n'));
}

export async function cd() {

}

export async function touch(name) {
	return OS.getOS()._fileSystem.writeFile(name, '')
		.then(file => undefined);
}

export async function cat(name) {
	return OS.getOS()._fileSystem.readFile(name)
		.then(file => file.content);
}

export async function mv() {

}

export async function rm(fileName) {
	return OS.getOS()._fileSystem.deleteFile(fileName)
		.then(file => undefined);
}

export async function mkdir() {

}

export async function rmdir() {

}

export async function man() {

}