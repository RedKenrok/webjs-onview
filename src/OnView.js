// Import constants.
import ATTRIBUTES from './ATTRIBUTES.js'
// Import utils.
import handleIntersection from './handleIntersection.js'

const READY_STATES = {
  complete: 'complete',
  interactive: 'interactive',
  never: 'never',
}

class OnView {
  /**
   * Construct OnView instance.
   * @param {Object} options Module options. (See: README.md)
   * @returns {Object} OnView instance.
   */
  constructor(options) {
    this._initialized = false

    // Set default options.
    this._options = {
      debug: false,
      readyState: READY_STATES.complete,

      observerElement: null,
      observerMargin: '0px',

      attributePrefix: 'data-onview',
      eventContextName: 'detail',
      selectorSplitCharacter: ',',
    }
    // If custom options given then override the defaults.
    if (options && options !== {}) {
      this._options = Object.assign(this._options, options)

      // Log changes to console.
      if (process.env.NODE_ENV !== 'production') {
        console.log('OnView: overwriting options, new options:', this._options)
      }
    }

    // Initialize module.
    if (this._options.readyState === READY_STATES.interactive) {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        // Initialize now.
        this.initialize()
      } else {
        // Wait for DOM interactive, then initialize.
        document.addEventListener('DOMContentLoaded', () => {
          this.initialize()
        })
      }
    } else if (this._options.readyState === READY_STATES.complete) {
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
   * @returns {Object} Current options.
   */
  getOptions () {
    return Object.assign({}, this._options)
  }

  /**
   * Returns whether the instance has been initialized.
   * @returns {Boolean} Whether the instance has been initialized
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
      if (process.env.NODE_ENV !== 'production') {
        console.warn('OnView: module instance already initialized, therefore re-initialization is ignored.')
      }

      return
    }
    this._initialized = true

    // Define observer options.
    const observerOptions = Object.assign({
      threshold: 0,
    }, {
      root: this._options.observerElement,
      rootMargin: this._options.observerMargin,
    })

    // Create observer instance.
    this._observer = new IntersectionObserver((_entries, _observer) => {
      handleIntersection(this, _entries, _observer)
    }, observerOptions)

    // Query documents for elements to track.
    this.queryDocument()

    if (process.env.NODE_ENV !== 'production') {
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
    const queries = ATTRIBUTES.map((attribute) => {
      return '[' + this._options.attributePrefix + attribute + ']'
    })
    const elements = this._options.observedElement.querySelectorAll(queries.join(','))

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

    if (process.env.NODE_ENV !== 'production') {
      console.log('OnView: queried document for elements, observered elements: ', elements)
    }
  }
}

// Set public static variables.
OnView.READY_STATES = READY_STATES
OnView.VERSION = process.env.PKG_VERSION

// Export module class.
export default OnView
