// Import utils.
import overrideProperties from './overrideProperties.js'
import handleIntersection from './handleIntersection.js'

/**
 * Setup intersection observer.
 */
export default function (_onview) {
  // Ensure there is no previous observer active.
  if (_onview._observer) {
    _onview._observer.disconnect()
  }

  // Define observer options.
  const observerOptions = overrideProperties({
    threshold: 0,
  }, {
    root: _onview._options.observerElement,
    rootMargin: _onview._options.observerMargin,
  })

  // Create observer instance.
  _onview._observer = new IntersectionObserver(function (_entries, _observer) {
    handleIntersection(_onview, _entries, _observer)
  }, observerOptions)
}
