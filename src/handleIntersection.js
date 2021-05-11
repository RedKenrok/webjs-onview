// Import utils.
import addAttributes from './addAttributes.js'
import delayExecutions from './delayExecutions.js'
import executeCode from './executeCode.js'
import removeAttributes from './removeAttributes.js'
import removeFromObserving from './removeFromObserving.js'

/**
 * Handle intersection events.
 * @param {OnView} onView OnView instance.
 * @param {Array} entries Observed elements.
 * @param {IntersectionObserver} observer Intersection observer.
 */
export default function (onView, entries, observer) {
  entries.forEach(entry => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('OnView: Intersection change triggered for: ', entry)
    }

    // Get options.
    const { attributePrefix, eventContextName, selectorSplitCharacter } = onView._options

    // Get HTML element from entry.
    const element = entry.target

    // Get whether it has changed.
    const hasChanged = (element.getAttribute(attributePrefix + 'isintersecting') !== 'false') !== entry.isIntersecting
    element.setAttribute(attributePrefix + 'isintersecting', entry.isIntersecting.toString())

    // Store function that need execution.
    const functions = []
    let attribute, value

    // Execute code on view enter and exit.
    value = element.getAttribute(attributePrefix)
    if (value && value.length > 0) {
      const code = value
      functions.push(() => executeCode(code, { entry: entry }, eventContextName))
    }
    if (entry.isIntersecting) {
      // Execute code on view enter.
      attribute = attributePrefix + '-enter'
      value = element.getAttribute(attribute)
      if (value) {
        const code = value
        functions.push(() => executeCode(code, { entry: entry }, eventContextName))
        removeFromObserving(onView, element, observer, attribute)
      }
      // Add attributes on view enter.
      attribute = attributePrefix + '-enter-add'
      value = element.getAttribute(attribute)
      if (value) {
        const selectors = value
        functions.push(() => addAttributes(element, selectors, selectorSplitCharacter))
        removeFromObserving(onView, element, observer, attribute)
      }
      // Remove attributes on view enter.
      attribute = attributePrefix + '-enter-remove'
      value = element.getAttribute(attribute)
      if (value) {
        const selectors = value
        functions.push(() => removeAttributes(element, selectors, selectorSplitCharacter))
        removeFromObserving(onView, element, observer, attribute)
      }
    }

    // Add attributes when in view and remove attributes when out of view.
    attribute = attributePrefix + '-enter-toggle'
    value = element.getAttribute(attribute)
    if (value) {
      if (entry.isIntersecting) {
        const selectors = value
        functions.push(() => addAttributes(element, selectors, selectorSplitCharacter))
      } else if (hasChanged) {
        const selectors = value
        functions.push(() => removeAttributes(element, selectors, selectorSplitCharacter))
      }
    }

    if (hasChanged && !entry.isIntersecting) {
      // Execute code on view exit.
      attribute = attributePrefix + '-exit'
      value = element.getAttribute(attribute)
      if (value) {
        const code = value
        functions.push(() => executeCode(code, { entry: entry }, eventContextName))
        removeFromObserving(onView, element, observer, attribute)
      }
      // Add attributes on view exit.
      attribute = attributePrefix + '-exit-add'
      value = element.getAttribute(attribute)
      if (value) {
        const selectors = value
        functions.push(() => addAttributes(element, selectors, selectorSplitCharacter))
        removeFromObserving(onView, element, observer, attribute)
      }
      // Remove attributes on view exit.
      attribute = attributePrefix + '-exit-remove'
      value = element.getAttribute(attribute)
      if (value) {
        const selectors = value
        functions.push(() => removeAttributes(element, selectors, selectorSplitCharacter))
        removeFromObserving(onView, element, observer, attribute)
      }
    }

    // Remove attributes when in view and add attributes when out of view.
    attribute = attributePrefix + '-exit-toggle'
    value = element.getAttribute(attribute)
    if (value) {
      if (entry.isIntersecting) {
        const selectors = value
        functions.push(() => removeAttributes(element, selectors, selectorSplitCharacter))
      } else if (hasChanged) {
        const selectors = value
        functions.push(() => addAttributes(element, selectors, selectorSplitCharacter))
      }
    }

    // Execute functions with optional delay.
    delayExecutions(functions, element.getAttribute(attributePrefix + '-delay'))

    if (typeof (window.CustomEvent) === 'function') {
      // Dispatch custom event.
      element.dispatchEvent(new CustomEvent('onview-change', { detail: { entry: entry } }))
    }
  })
}
