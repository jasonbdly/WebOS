export function isType(val, target) {
	return typeof val === target;
}

export function isString(val) {
	return isType(val, 'string');
}

export function isObject(val) {
	return isType(val, 'object');
}

export function isUndf(val) {
	return isType(val, 'undefined');
}

export function isInst(val, target) {
	return val instanceof target;
}

export function isNode(val) {
	return isInst(val, Node);
}

export function isNodeList(val) {
	return isInst(val, NodeList) || isInst(val, HTMLCollection);
}

export function parseHTML(htmlString) {
	var tmpElement = document.implementation.createHTMLDocument('');
	tmpElement.body.innerHTML = htmlString;
	return tmpElement.body.children;
}