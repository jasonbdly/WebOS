import OS from './../runtime';

export async function writeFile(name, content) {
	return OS.getOS()._fileSystem.writeFile(name, content);
}

export async function echo(value) {
	return value;
}

export async function clear() {
	OS.getOS().clearOutput();
}

export async function ls() {

}

export async function cd() {

}

export async function touch(name) {
	return OS.getOS()._fileSystem.writeFile(name, '');
}

export async function cat(name) {
	return OS.getOS()._fileSystem.readFile(name)
		.then(file => file.content);
}

export async function mv() {

}

export async function rm(fileName) {
	return OS.getOS()._fileSystem.deleteFile(fileName);
}

export async function mkdir() {

}

export async function rmdir() {

}

export async function man() {

}