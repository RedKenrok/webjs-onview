import ATTRIBUTES from '../ATTRIBUTES.js'

/**
 * Removes attribute from element and disable observing if no OnView attributes are left.
 * @param {HTMLElement} element Element to stop observer.
 * @param {IntersectionObserver} observer Observer observing the element.
 * @param {String} attributeName Name of the attribute to remove.
 */
export default function (element, observer, attributeName) {
  // If repeat is set then do not remove.
  if (element.dataset.onviewRepeat) {
    return
  }

  // Remove attribute that got invoked.
  element.removeAttribute(attributeName)

  // Check for other OnView observable attributes, if any left then exit early.
  if (ATTRIBUTES.filter((attribute) => element.hasAttribute(attribute)).length > 0) {
    return
  }

  // Remove automatically added element.
  element.removeAttribute('data-onview-isintersecting')
  // Remove element from being observed.
  observer.unobserve(element)
}
