import * as utils from './../utils/utils';

let _id = 0;

export function dom(target) {
	return new DOMNode(target);
}

// TODO: Clean up the duplicated logic between Node and NodeList functionality.

export default class DOMNode {
	constructor(target) {
		this._id = _id++;
		this._originalTarget = target;

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

					this.elem = tempElements.length === 1 ? tempElements[0] : tempElements;
				}
			}
		} else if (utils.isNode(target) || utils.isNodeList(target)) {
			this.elem = target;
		} else {
			throw new Error('Unsupported target type.', target);
		}
	}

	attr(name, value) {
		if (utils.isNodeList(this.elem)) {
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

	value(value) {
		if (utils.isNodeList(this.elem)) {
			if (!utils.isUndf(value)) {
				Array.from(this.elem).forEach(node => dom(node).value(value));
			} else {
				return Array.from(this.elem).map(node => dom(node).value());
			}
		} else {
			if (!utils.isUndf(value)) {
				this.elem.value = value;
			} else {
				return this.elem.value;
			}
		}
		return this;
	}

	append(elem) {
		if (utils.isNodeList(this.elem)) {
			Array.from(this.elem).forEach(node => dom(node).append(elem));
		} else {
			if (utils.isNodeList(elem.elem || elem)) {
				Array.from(elem.elem || elem).forEach(node => this.elem.append(node));
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
				Array.from(elem.elem || elem).forEach(node => dom(node).append(this.elem));
			} else {
				dom(elem).append(this.elem);
			}
		}
		return this;
	}

	parent() {
		if (utils.isNodeList(this.elem)) {
			return Array.from(this.elem).map(node => dom(node).parent());
		} else {
			return dom(this.elem.parentNode);
		}
	}

	hide() {
		if (utils.isNodeList(this.elem)) {
			Array.from(this.elem).forEach(node => dom(node).hide());
		} else {
			dom(this.elem).css('display', 'none');
		}
		return this;
	}

	show() {
		if (utils.isNodeList(this.elem)) {
			Array.from(this.elem).forEach(node => dom(node).show());
		} else {
			dom(this.elem).css('display', '');
		}
		return this;
	}

	addClass(className) {
		if (className.indexOf(' ') > -1) {
			className.split(' ').forEach(classNamePart => this.addClass(classNamePart));
		} else if (utils.isNodeList(this.elem)) {
			Array.from(this.elem).forEach(node => dom(node).addClass(className));
		} else {
			if (this.elem.classList) {
				this.elem.classList.add(className);
			} else {
				this.elem.className += ' ' + className;
			}
		}
		return this;
	}

	removeClass(className) {
		if (className.indexOf(' ') > -1) {
			className.split(' ').forEach(classNamePart => this.removeClass(classNamePart));
		} else if (utils.isNodeList(this.elem)) {
			Array.from(this.elem).forEach(node => dom(node).removeClass(className));
		} else {
			if (this.elem.classList) {
				this.elem.classList.remove(className);
			} else {
				this.elem.className = this.elem.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		}
		return this;
	}

	focus() {
		if (utils.isNodeList(this.elem)) {
			this.elem[this.elem.length - 1].focus();
		} else {
			this.elem.focus();
		}
		return this;
	}

	on(eventName, eventHandler) {
		if (utils.isNodeList(this.elem)) {
			Array.from(this.elem).forEach(node => dom(node).on(eventName, eventHandler));
		} else {
			this.elem.addEventListener(eventName, eventHandler);
		}
	}

	off(eventName, eventHandler) {
		if (utils.isNodeList(this.elem)) {
			Array.from(this.elem).forEach(node => dom(node).off(eventName, eventHandler));
		} else {
			this.elem.removeEventListener(eventName, eventHandler);
		}
	}

	ready(evtHandler) {
		if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
			evtHandler();
		} else {
			document.addEventListener('DOMContentLoaded', evtHandler);
		}
		return this;
	}

	keypress(eventHandler) {
		this.on('keypress', eventHandler);
	}

	keyup(eventHandler) {
		this.on('keyup', eventHandler);
	}

	keydown(eventHandler) {
		this.on('keydown', eventHandler);
	}
}