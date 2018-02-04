import DOMNode from './dom-tool/dom-tool';
import { dom } from './dom-tool/dom-tool';

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