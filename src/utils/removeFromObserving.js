import ATTRIBUTES from '../ATTRIBUTES.js'

/**
 * Removes attribute from element and disable observing if no OnView attributes are left.
 * @param _element
 * @param _observer
 * @param _attributeName
 */
export default function (_element, _observer, _attributeName) {
  // If repeat is set then do not remove.
  if (_element.dataset.onviewRepeat) {
    return
  }

  // Remove attribute that got invoked.
  _element.removeAttribute(_attributeName)

  // Check for other OnView observable attributes, if any left then exit early.
  if (ATTRIBUTES.filter((attribute) => _element.hasAttribute(attribute)).length > 0) {
    return
  }

  // Remove automatically added element.
  _element.removeAttribute('data-onview-isintersecting')
  // Remove element from being observed.
  _observer.unobserve(_element)
}
