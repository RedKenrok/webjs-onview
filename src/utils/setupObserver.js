// Import utils.
import handleIntersection from './handleIntersection.js'

/**
 * Sets up intersection observer.
 * @param {OnView} OnView instance.
 */
export default function (onView) {
  // Ensure there is no previous observer active.
  if (onView._observer) {
    onView._observer.disconnect()
  }

  // Define observer options.
  const observerOptions = Object.assign({
    threshold: 0,
  }, {
    root: onView._options.observerElement,
    rootMargin: onView._options.observerMargin,
  })

  // Create observer instance.
  onView._observer = new IntersectionObserver(function (_entries, _observer) {
    handleIntersection(onView, _entries, _observer)
  }, observerOptions)
}
