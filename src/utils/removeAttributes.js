/**
 * Remove id, class, or other attribute using a query selector style query.
 * @param {HTMLElement} element Element to remove the attributes from.
 * @param {String} selectors All selectors as single string.
 * @param {String} splitCharacter Character indicating next selector. Default is ','.
 */
export default function (element, selectors, splitCharacter = ',') {
  let index, key
  Array.prototype.forEach.call(selectors.split(splitCharacter), selector => {
    // Trim spaces.
    selector = selector.trim()

    // Base what to do of
    switch (selector[0]) {
      case '#':
        // Remove starting character and replace spaces with dashes.
        selector = selector.substring(1).replace(' ', '-')
        // Remove id attribute.
        element.removeAttribute(selector)
        break
      case '.':
        // Remove starting character and replace spaces with dashes.
        selector = selector.substring(1).replace(' ', '-')
        // Remove class if part of classlist.
        if (element.classList.contains(selector)) {
          element.classList.remove(selector)
        }
        break
      case '[':
        // Remove brackets, split key from value, replace spaces with dashes in key.
        index = selector.indexOf('=')
        if (index < 0) {
          index = selector.length - 1
        }
        key = selector.substring(1, index)
        key = key.replace(' ', '-')

        // Set attribute.
        element.removeAttribute(key)
        break
    }
  })
}
