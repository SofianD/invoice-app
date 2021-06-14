/**
 * @exports createElement
 * @description Create HTML element.
 * @param {HTMLElement} parent 
 * @param {string} element Type of the new HTML element.
 * @param {Array} arrayOfParams Params of the new HTML element.
 * @returns 
 */
exports.createElement = (parent, element, arrayOfParams) => {
    const newElmnt = document.createElement(element);
    const arrLength = arrayOfParams.length;
    for (let i = 0; i < arrLength; i++) {
        newElmnt[arrayOfParams[i].key] = arrayOfParams[i].value;
    }
    parent.appendChild(newElmnt);
    return;
};

/**
 * @description Hide Html element.
 * @param {HTMLElement} el 
 * @returns 
 */
exports.hideElement = (el) => {
    if (el.target.style.display !== 'none') {
        el.target.style.display = 'none';
    } else {
        el.target.style.display = 'flex';
    }
    return;
};
