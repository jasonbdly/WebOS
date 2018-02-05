import 'babelify-es6-polyfill';

import DOMNode from './dom-tool/dom-tool';
import { dom } from './dom-tool/dom-tool';

import OS from './os/runtime';

window.DOMNode = DOMNode;
window.dom = dom;

dom(document).ready(() => {
	let $input = dom('<input/>')
		.attr('type', 'text')
		.addClass('terminal terminal-input');

	let $output = dom('<div/>')
		.addClass('terminal terminal-output');

	dom(document.body)
		.append($output)
		.append($input);

	var os = new OS($input, $output, ' $ ');
});