// Import utils.
import addAttributes from './addAttributes.js'
import delayExecutions from './delayExecutions.js'
import executeCode from './executeCode.js'
import removeAttributes from './removeAttributes.js'
import removeFromObserving from './removeFromObserving.js'

/**
 * Handle intersection events.
 * @param {OnView} onView OnView instance.
 * @param {Array} entries Observerd elements.
 * @param {IntersectionObserver} observer Intersection observer.
 */
export default function (onView, entries, observer) {
  entries.forEach(entry => {
    if (onView._options.debug) {
      console.log('OnView: Intersection change triggered for: ', entry)
    }

    // Get time sensitive reused options.
    const splitCharacter = onView._options.selectorSplitCharacter

    // Get HTML element from entry.
    const element = entry.target

    // Get whether it has changed.
    const hasChanged = (element.dataset.onviewIsintersecting === 'true') !== entry.isIntersecting
    element.dataset.onviewIsintersecting = entry.isIntersecting.toString()

    // Store function that need execution.
    const functions = []

    // Execute code on view enter and exit.
    if (element.dataset.onview && element.dataset.onview.length > 0) {
      const code = element.dataset.onview
      functions.push(() => executeCode(code, {
        entry: entry,
      }, onView._options.eventContextName))
    }
    if (entry.isIntersecting) {
      // Execute code on view enter.
      if (element.dataset.onviewEnter) {
        const code = element.dataset.onviewEnter
        functions.push(() => executeCode(code, {
          entry: entry,
        }, onView._options.eventContextName))

        removeFromObserving(element, observer, 'data-onview-enter')
      }
      // Add attributes on view enter.
      if (element.dataset.onviewEnterAdd) {
        const selectors = element.dataset.onviewEnterAdd
        functions.push(() => addAttributes(element, selectors, splitCharacter))

        removeFromObserving(element, observer, 'data-onview-enter-add')
      }
      // Remove attributes on view enter.
      if (element.dataset.onviewEnterRemove) {
        const selectors = element.dataset.onviewEnterRemove
        functions.push(() => removeAttributes(element, selectors, splitCharacter))

        removeFromObserving(element, observer, 'data-onview-enter-remove')
      }
    }
    // Add attributes when in view and remove attributes when out of view.
    if (element.dataset.onviewEnterToggle) {
      if (entry.isIntersecting) {
        const selectors = element.dataset.onviewEnterToggle
        functions.push(() => addAttributes(element, selectors, splitCharacter))
      } else if (hasChanged) {
        const selectors = element.dataset.onviewEnterToggle
        functions.push(() => removeAttributes(element, selectors, splitCharacter))
      }
    }
    if (hasChanged && !entry.isIntersecting) {
      // Execute code on view exit.
      if (element.dataset.onviewExit) {
        const code = element.dataset.onviewExit
        functions.push(() => executeCode(code, {
          entry: entry,
        }, onView._options.eventContextName))

        removeFromObserving(element, observer, 'data-onview-exit')
      }
      // Add attributes on view exit.
      if (element.dataset.onviewExitAdd) {
        const selectors = element.dataset.onviewExitAdd
        functions.push(() => addAttributes(element, selectors, splitCharacter))

        removeFromObserving(element, observer, 'data-onview-exit-add')
      }
      // Remove attributes on view exit.
      if (element.dataset.onviewExitRemove) {
        const selectors = element.dataset.onviewExitRemove
        functions.push(() => removeAttributes(element, selectors, splitCharacter))

        removeFromObserving(element, observer, 'data-onview-exit-remove')
      }
    }
    // Remove attributes when in view and add attributes when out of view.
    if (element.dataset.onviewExitToggle) {
      if (entry.isIntersecting) {
        const selectors = element.dataset.onviewExitToggle
        functions.push(() => removeAttributes(element, selectors, splitCharacter))
      } else if (hasChanged) {
        const selectors = element.dataset.onviewExitToggle
        functions.push(() => addAttributes(element, selectors, splitCharacter))
      }
    }

    // Execute functions with optional delay.
    delayExecutions(functions, element.dataset.onviewDelay)

    if (typeof (window.CustomEvent) === 'function') {
      // Dispatch custom event.
      element.dispatchEvent(new CustomEvent('onview-change', {
        detail: {
          entry: entry,
        },
      }))
    }
  })
}
