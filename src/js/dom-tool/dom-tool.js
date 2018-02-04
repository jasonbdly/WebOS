import * as utils from './../utils/utils';

let _id = 0;

export function dom(target) {
	return new DOMNode(target);
}

export default class DOMNode {
	constructor(target) {
		this.id = _id++;
		if (utils.isInst(target, DOMNode)) {
			return target;
		} else if (utils.isString(target)) {
			if (target.startsWith('#')) {
				this.elem = document.getElementById(target);
			} else {
				try {
					this.elem = document.querySelector(target);
				} catch (error) {
					var tempElements = utils.parseHTML(target);
					if (!tempElements.length) {
						throw error;
					}

					this.elem = tempElements;
				}
			}
		} else if (utils.isNode(target) || utils.isNodeList(target)) {
			this.elem = target;
		} else {
			throw new Error('Unsupported target type.', target);
		}
	}

	attr(name, value) {
		if (isNodeList(this.elem)) {
			if (!arguments.length || (arguments.length === 1 && !utils.isObject(name))) {
				return Array.from(this.elem).map(node => dom(node).attr(name, value));
			} else {
				Array.from(this.elem).forEach(node => dom(node).attr(name, value));
			}
		} else {
			if (!arguments.length) {
				var allAttrs = {};

				if (this.elem.hasAttributes()) {
					let elemAttributes = this.elem.attributes;
					for (var i = 0; i < elemAttributes.length; i++) {
						allAttrs[elemAttributes[i].name] = elemAttributes[i].value;
					}
				}

				return allAttrs;
			} else if (arguments.length === 1) {
				if (utils.isObject(name)) {
					let allAttrs = name;
					for (var attrName in allAttrs) {
						var attrValue = allAttrs[attrName];
						this.attr(attrName, attrValue);
					}
				} else {
					return this.elem.getAttribute(name);
				}
			}
			this.elem.setAttribute(name, value);
		}
		return this;
	}

	css(name, value) {
		if (utils.isNodeList(this.elem)) {
			if (!arguments.length || (arguments.length === 1 && !utils.isObject(name))) {
				return Array.from(this.elem).map(node => dom(node).css(name, value));
			} else {
				Array.from(this.elem).forEach(node => dom(node).css(name));
			}
		} else {
			if (!arguments.length) {
				var allCSSProps = {};

				var elemStyles = this.elem.style;
				if (elemStyles) {
					for (var styleName in elemStyles) {
						allCSSProps[styleName] = elemStyles[styleName];
					}
				}

				return allCSSProps;
			} else if (arguments.length === 1) {
				if (utils.isObject(name)) {
					let allCSSProps = name;
					for (var cssProp in allCSSProps) {
						var cssPropValue = allCSSProps[cssProp];
						this.css(cssProp, cssPropValue);
					}
				} else {
					return this.elem.style[name];
				}
			} else {
				this.elem.style[name] = value;
			}
		}
		return this;
	}

	text(value) {
		if (utils.isNodeList(this.elem)) {
			if (!utils.isUndf(value)) {
				Array.from(this.elem).forEach(node => dom(node).text(value));
			} else {
				return Array.from(this.elem).map(node => dom(node).text());
			}
		} else {
			if (!utils.isUndf(value)) {
				this.elem.textContent = value;
			} else {
				return this.elem.textContent;
			}
		}
		return this;
	}

	html(value) {
		if (utils.isNodeList(this.elem)) {
			if (!utils.isUndf(value)) {
				Array.from(this.elem).forEach(node => dom(node).html(value));
			} else {
				return Array.from(this.elem).map(node => dom(node).html());
			}
		} else {
			if (!utils.isUndf(value)) {
				this.elem.innerHTML = value;
			} else {
				return this.elem.innerHTML;
			}
		}
		return this;
	}

	append(elem) {
		if (utils.isNodeList(this.elem)) {
			Array.from(this.elem).forEach(node => dom(node).append(elem));
		} else {
			if (utils.isNodeList(elem)) {
				Array.from(elem).forEach(node => this.elem.append(node));
			} else {
				this.elem.appendChild(elem.elem || elem);
			}
		}
		return this;
	}

	appendTo(elem) {
		if (utils.isNodeList(this.elem)) {
			Array.from(this.elem).forEach(node => dom(node).appendTo(elem));
		} else {
			if (utils.isNodeList(elem)) {
				Array.from(elem).forEach(node => dom(node).append(this.elem));
			} else {
				dom(elem).append(this.elem);
			}
		}
		return this;
	}

	ready(evtHandler) {
		if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
			evtHandler();
		} else {
			document.addEventListener('DOMContentLoaded', evtHandler);
		}
		return this;
	}
}