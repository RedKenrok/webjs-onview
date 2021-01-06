/**
 * Add id, class, or other attribute using a query selector style query.
 * @param {HTMLElement} element Element to add the attributes to.
 * @param {String} selectors All selectors as single string.
 * @param {String} splitCharacter Character indicating next selector. Default is ','.
 */
export default function (element, selectors, splitCharacter = ',') {
  let key, value
  Array.prototype.forEach.call(selectors.split(splitCharacter), selector => {
    // Trim spaces.
    selector = selector.trim()

    // Base what to do of
    switch (selector[0]) {
      case '#':
        // Remove starting character and replace spaces with dashes.
        selector = selector.substring(1).replace(' ', '-')
        // Set id.
        element.id = selector
        break
      case '.':
        // Remove starting character and replace spaces with dashes.
        selector = selector.substring(1).replace(' ', '-')
        // Add class if not part of classlist.
        if (!element.classList.contains(selector)) {
          element.classList.add(selector)
        }
        break
      case '[':
        // Remove brackets, split key and value, replace spaces with dashes in key.
        key = selector.substring(1, selector.indexOf('='))
        value = selector.substring(
          key.length + 2,
          selector.length - 1
        )
        key = key.replace(' ', '-')

        // Set attribute.
        element.setAttribute(key, value)
        break
    }
  })
}
