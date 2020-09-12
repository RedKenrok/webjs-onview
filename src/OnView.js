// Import static variables.
import ATTRIBUTES from './ATTRIBUTES.js'
import READY_STATES from './READY_STATES.js'
// Import utils.
import overrideProperties from './utils/overrideProperties.js'
import setupObserver from './utils/setupObserver.js'

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
    setupObserver(this)
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
}

// Set pulbic static variables.
OnView.READY_STATES = READY_STATES

// Export module class.
export default OnView
