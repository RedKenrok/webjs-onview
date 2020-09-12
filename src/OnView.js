// Import static variables.
import ATTRIBUTES from './ATTRIBUTES.js'
import READY_STATES from './READY_STATES.js'
// Import utils.
import addAttributes from './utils/addAttributes.js'
import delayExecutions from './utils/delayExecutions.js'
import executeCode from './utils/executeCode.js'
import overrideProperties from './utils/overrideProperties.js'
import removeAttributes from './utils/removeAttributes.js'
import removeFromObserving from './utils/removeFromObserving.js'

class OnView {
  /**
   * Construct OnView instance.
   * @param _options Module options. (See: README.md)
   */
  constructor(_options) {
    this._initialized = false

    // Set default options.
    this._options = {
      debug: false,
      readyState: OnView.READY_STATES.complete,

      observedElement: document.body,
      observerElement: null,
      observerMargin: '0px',

      eventContextName: 'detail',
      selectorSplitCharacter: '?',
    }
    // If custom options given then override the defaults.
    if (_options && _options !== {}) {
      this._options = overrideProperties(this._options, _options)

      // Log changes to console.
      if (this._options.debug) {
        console.log('OnView: overwriting options, new options:', this._options)
      }
    }

    // Initialize module.
    if (this._options.readyState === OnView.READY_STATES.interactive) {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        // Initialize now.
        this.initialize()
      } else {
        // Wait for DOM interactive, then initialize.
        document.addEventListener('DOMContentLoaded', () => {
          this.initialize()
        })
      }
    } else if (this._options.readyState === OnView.READY_STATES.complete) {
      if (document.readyState === 'complete') {
        // Initialize now.
        this.initialize()
      } else {
        // Wait for window loaded, then initialize.
        window.addEventListener('load', () => {
          this.initialize()
        })
      }
    }
  }

  /**
   * Returns clone of current options.
   */
  getOptions () {
    return overrideProperties({}, this._options)
  }

  /**
   * Returns whether the instance has been initialized.
   */
  isInitialized () {
    return this._initialized
  }

  /**
   * Initialize module instance.
   */
  initialize () {
    // Check if already initialized.
    if (this._initialized) {
      if (this._options.debug) {
        console.warn('OnView: module instance already initialized, therefore re-initialization is ignored.')
      }

      return
    }
    this._initialized = true

    // Setup intersection observer.
    this._setupObserver()
    // Query documents for elements to track.
    this.queryDocument()

    if (this._options.debug) {
      console.log('OnView: module instance initialized.')
    }
  }

  /**
   * Destroy this instance.
   */
  destroy () {
    // Disable and discard observer.
    if (this._observer) {
      this._observer.disconnect()
    }
    this._observer = null

    // Set initialization to false.
    this._initialized = false

    // Reset options.
    this._options = null
  }

  /**
   * Query document for elements to track.
   */
  queryDocument () {
    // Get currently observed elements.
    const observedElements = this._observer.takeRecords().map((entry) => {
      return entry.target
    })
    // Query document of elements to track.
    const query = ATTRIBUTES.map((attribute) => {
      return '[' + attribute + ']'
    })
    const elements = this._options.observedElement.querySelectorAll(query.join(','))

    // If queried before.
    if (observedElements.length > 0) {
      // Compare previous list of elements to new elements.
      Array.prototype.forEach.call(elements, (element) => {
        // Filter elements out that are already being observer.
        if (observedElements.indexOf(element) >= 0) {
          return
        }

        // Add element to observer.
        this._observer.observe(element)
      })
    } else {
      // Add elements to observer.
      Array.prototype.forEach.call(elements, (element) => {
        this._observer.observe(element)
      })
    }

    if (this._options.debug) {
      console.log('OnView: queried document for elements, observered elements: ', elements)
    }
  }

  /**
   * Setup intersection observer.
   */
  _setupObserver () {
    // Ensure there is no previous observer active.
    if (this._observer) {
      this._observer.disconnect()
    }

    // Define observer options.
    const observerOptions = overrideProperties({
      threshold: 0,
    }, {
      root: this._options.observerElement,
      rootMargin: this._options.observerMargin,
    })

    // Create observer instance.
    this._observer = new IntersectionObserver(this._handleIntersect, observerOptions)
  }

  /**
   * Handle intersection events.
   * @param _entries
   * @param _observer
   */
  _handleIntersect (_entries, _observer) {
    Array.prototype.forEach.call(_entries, (entry) => {
      if (this._options.debug) {
        console.log('OnView: Intersection change triggered for: ', entry)
      }

      // Get time sensitive reused options.
      const splitCharacter = this._options.selectorSplitCharacter

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
        }, this._options.eventContextName))
      }
      if (entry.isIntersecting) {
        // Execute code on view enter.
        if (element.dataset.onviewEnter) {
          const code = element.dataset.onviewEnter
          functions.push(() => executeCode(code, {
            entry: entry,
          }, this._options.eventContextName))

          removeFromObserving(element, _observer, 'data-onview-enter')
        }
        // Add attributes on view enter.
        if (element.dataset.onviewEnterAdd) {
          const selectors = element.dataset.onviewEnterAdd
          functions.push(() => addAttributes(element, selectors, splitCharacter))

          removeFromObserving(element, _observer, 'data-onview-enter-add')
        }
        // Remove attributes on view enter.
        if (element.dataset.onviewEnterRemove) {
          const selectors = element.dataset.onviewEnterRemove
          functions.push(() => removeAttributes(element, selectors, splitCharacter))

          removeFromObserving(element, _observer, 'data-onview-enter-remove')
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
          }, this._options.eventContextName))

          removeFromObserving(element, _observer, 'data-onview-exit')
        }
        // Add attributes on view exit.
        if (element.dataset.onviewExitAdd) {
          const selectors = element.dataset.onviewExitAdd
          functions.push(() => addAttributes(element, selectors, splitCharacter))

          removeFromObserving(element, _observer, 'data-onview-exit-add')
        }
        // Remove attributes on view exit.
        if (element.dataset.onviewExitRemove) {
          const selectors = element.dataset.onviewExitRemove
          functions.push(() => removeAttributes(element, selectors, splitCharacter))

          removeFromObserving(element, _observer, 'data-onview-exit-remove')
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
  };
}

// Set pulbic static variables.
OnView.READY_STATES = READY_STATES

// Export module class.
export default OnView
