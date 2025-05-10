// deno-lint-ignore-file
export class PageBuilder {
  /**
   * @param {keyof HTMLElementTagNameMap} tagNames
   */
  createHTMLElements(...tagNames) {
    const htmlElements = [];
    for (const tagName of tagNames) {
      htmlElements.push(document.createElement(tagName));
    }
    return htmlElements;
  }

  /**
   * @param {string} tagName
   * @param {number} howMuch
   */
  createSameHTMLElements(tagName, howMuch) {
    const htmlElements = [];
    for (let i = 0; i < howMuch; i++) {
      htmlElements.push(document.createElement(tagName));
    }
    return htmlElements;
  }

  /**
   * @param {string} attr
   * @param {string | number | boolean} value
   * @param {HTMLElement[]} elements
   */
  setSameHTMLElementAttributes(attr, value, ...elements) {
    if (elements.length === 1) {
      value === true
        ? elements[0].setAttribute(attr, "")
        : elements[0][attr] = value;
      return;
    }

    for (const element of elements) {
      value === true ? element.setAttribute(attr, "") : element[attr] = value;
    }
  }

  /**
   * @param {Node} root parent node
   * @param {HTMLElement[]} children
   */
  insertChildren(root, ...children) {
    for (const child of children) {
      root.appendChild(child);
    }
  }
}
