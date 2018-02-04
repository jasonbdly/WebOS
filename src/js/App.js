import DOMNode from './dom-tool/dom-tool';
import { dom } from './dom-tool/dom-tool';
require('babelify-es6-polyfill');

window.DOMNode = DOMNode;
window.dom = dom;

dom(document).ready(() => {
	let testText = dom('<div/>')
		.text('TEST TEXT')
		.css({
			color: 'green',
			'fontSize': '20pt'
		})
		.appendTo(dom('body'));
});