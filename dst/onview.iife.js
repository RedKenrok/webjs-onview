var OnView = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var ATTRIBUTES = ['', '-enter', '-enter-add', '-enter-remove', '-enter-toggle', '-exit', '-exit-add', '-exit-remove', '-exit-toggle'];

  /**
   * Add id, class, or other attribute using a query selector style query.
   * @param {HTMLElement} element Element to add the attributes to.
   * @param {String} selectors All selectors as single string.
   * @param {String} splitCharacter Character indicating next selector. Default is ','.
   */
  function addAttributes (element, selectors) {
    var splitCharacter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
    var key, value;
    Array.prototype.forEach.call(selectors.split(splitCharacter), function (selector) {
      // Trim spaces.
      selector = selector.trim(); // Base what to do of

      switch (selector[0]) {
        case '#':
          // Remove starting character and replace spaces with dashes.
          selector = selector.substring(1).replace(' ', '-'); // Set id.

          element.id = selector;
          break;

        case '.':
          // Remove starting character and replace spaces with dashes.
          selector = selector.substring(1).replace(' ', '-'); // Add class if not part of classlist.

          if (!element.classList.contains(selector)) {
            element.classList.add(selector);
          }

          break;

        case '[':
          // Remove brackets, split key and value, replace spaces with dashes in key.
          key = selector.substring(1, selector.indexOf('='));
          value = selector.substring(key.length + 2, selector.length - 1);
          key = key.replace(' ', '-'); // Set attribute.

          element.setAttribute(key, value);
          break;
      }
    });
  }

  /**
   * Delay invocation of the method by the amount of delay.
   * @param {Array<Function>} functions Functions to invoke after the delay has passed.
   * @param {String} delayText Interger parsable string with time in milliseconds. Default is null.
   */
  function delayExecutions (functions) {
    var delayText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (functions.length <= 0) {
      return;
    }

    if (!delayText) {
      functions.forEach(function (_function) {
        _function();
      });
      return;
    }

    var delay = parseInt(delayText, 10);

    if (delay <= 0) {
      functions.forEach(function (_function) {
        _function();
      });
      return;
    }

    setTimeout(function () {
      functions.forEach(function (_function) {
        _function();
      });
    }, delay);
  }

  /**
   * Executes code relatively safely.
   * @param {String} code Code to execute.
   * @param {any} context Context variable of the code.
   * @param {String} contextName Name of context variable. Default is 'context'.
   * @returns {Any} Returns the return of code.
   */
  function executeCode (code, context) {
    var contextName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'context';
    return Function('"use strict"; return (function(' + contextName + ') { ' + code + ' });')()(context); // eslint-disable-line no-new-func
  }

  /**
   * Remove id, class, or other attribute using a query selector style query.
   * @param {HTMLElement} element Element to remove the attributes from.
   * @param {String} selectors All selectors as single string.
   * @param {String} splitCharacter Character indicating next selector. Default is ','.
   */
  function removeAttributes (element, selectors) {
    var splitCharacter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
    var index, key;
    Array.prototype.forEach.call(selectors.split(splitCharacter), function (selector) {
      // Trim spaces.
      selector = selector.trim(); // Base what to do of

      switch (selector[0]) {
        case '#':
          // Remove starting character and replace spaces with dashes.
          selector = selector.substring(1).replace(' ', '-'); // Remove id attribute.

          element.removeAttribute(selector);
          break;

        case '.':
          // Remove starting character and replace spaces with dashes.
          selector = selector.substring(1).replace(' ', '-'); // Remove class if part of classlist.

          if (element.classList.contains(selector)) {
            element.classList.remove(selector);
          }

          break;

        case '[':
          // Remove brackets, split key from value, replace spaces with dashes in key.
          index = selector.indexOf('=');

          if (index < 0) {
            index = selector.length - 1;
          }

          key = selector.substring(1, index);
          key = key.replace(' ', '-'); // Set attribute.

          element.removeAttribute(key);
          break;
      }
    });
  }

  /**
   * Removes attribute from element and disable observing if no OnView attributes are left.
   * @param {OnView} onView OnView instance.
   * @param {HTMLElement} element Element to stop observer.
   * @param {IntersectionObserver} observer Observer observing the element.
   * @param {String} attributeName Name of the attribute to remove.
   */

  function removeFromObserving (onView, element, observer, attributeName) {
    // If repeat is set then do not remove.
    if (element.getAttribute(onView._options.attributePrefix + '-repeat') !== 'false') {
      return;
    } // Remove attribute that got invoked.


    element.removeAttribute(attributeName); // Check for other OnView observable attributes, if any left then exit early.

    if (ATTRIBUTES.filter(function (attribute) {
      return element.hasAttribute(onView._options.attributePrefix + attribute);
    }).length > 0) {
      return;
    } // Remove automatically added element.


    element.removeAttribute('data-onview-isintersecting'); // Remove element from being observed.

    observer.unobserve(element);
  }

  // Import utils.
  /**
   * Handle intersection events.
   * @param {OnView} onView OnView instance.
   * @param {Array} entries Observed elements.
   * @param {IntersectionObserver} observer Intersection observer.
   */

  function handleIntersection (onView, entries, observer) {
    entries.forEach(function (entry) {


      var _onView$_options = onView._options,
          attributePrefix = _onView$_options.attributePrefix,
          eventContextName = _onView$_options.eventContextName,
          splitCharacter = _onView$_options.splitCharacter; // Get HTML element from entry.

      var element = entry.target; // Get whether it has changed.

      var hasChanged = element.getAttribute(attributePrefix + 'isintersecting') !== 'false' !== entry.isIntersecting;
      element.setAttribute(attributePrefix + 'isintersecting', entry.isIntersecting.toString()); // Store function that need execution.

      var functions = [];
      var attribute, value; // Execute code on view enter and exit.

      value = element.getAttribute(attributePrefix);

      if (value && value.length > 0) {
        var code = value;
        functions.push(function () {
          return executeCode(code, {
            entry: entry
          }, eventContextName);
        });
      }

      if (entry.isIntersecting) {
        // Execute code on view enter.
        attribute = attributePrefix + '-enter';
        value = element.getAttribute(attribute);

        if (value) {
          var _code = value;
          functions.push(function () {
            return executeCode(_code, {
              entry: entry
            }, eventContextName);
          });
          removeFromObserving(onView, element, observer, attribute);
        } // Add attributes on view enter.


        attribute = attributePrefix + '-enter-add';
        value = element.getAttribute(attribute);

        if (value) {
          var selectors = value;
          functions.push(function () {
            return addAttributes(element, selectors, splitCharacter);
          });
          removeFromObserving(onView, element, observer, attribute);
        } // Remove attributes on view enter.


        attribute = attributePrefix + '-enter-remove';
        value = element.getAttribute(attribute);

        if (value) {
          var _selectors = value;
          functions.push(function () {
            return removeAttributes(element, _selectors, splitCharacter);
          });
          removeFromObserving(onView, element, observer, attribute);
        }
      } // Add attributes when in view and remove attributes when out of view.


      attribute = attributePrefix + '-enter-toggle';
      value = element.getAttribute(attribute);

      if (value) {
        if (entry.isIntersecting) {
          var _selectors2 = value;
          functions.push(function () {
            return addAttributes(element, _selectors2, splitCharacter);
          });
        } else if (hasChanged) {
          var _selectors3 = value;
          functions.push(function () {
            return removeAttributes(element, _selectors3, splitCharacter);
          });
        }
      }

      if (hasChanged && !entry.isIntersecting) {
        // Execute code on view exit.
        attribute = attributePrefix + '-exit';
        value = element.getAttribute(attribute);

        if (value) {
          var _code2 = value;
          functions.push(function () {
            return executeCode(_code2, {
              entry: entry
            }, eventContextName);
          });
          removeFromObserving(onView, element, observer, attribute);
        } // Add attributes on view exit.


        attribute = attributePrefix + '-exit-add';
        value = element.getAttribute(attribute);

        if (value) {
          var _selectors4 = value;
          functions.push(function () {
            return addAttributes(element, _selectors4, splitCharacter);
          });
          removeFromObserving(onView, element, observer, attribute);
        } // Remove attributes on view exit.


        attribute = attributePrefix + '-exit-remove';
        value = element.getAttribute(attribute);

        if (value) {
          var _selectors5 = value;
          functions.push(function () {
            return removeAttributes(element, _selectors5, splitCharacter);
          });
          removeFromObserving(onView, element, observer, attribute);
        }
      } // Remove attributes when in view and add attributes when out of view.


      attribute = attributePrefix + '-exit-toggle';
      value = element.getAttribute(attribute);

      if (value) {
        if (entry.isIntersecting) {
          var _selectors6 = value;
          functions.push(function () {
            return removeAttributes(element, _selectors6, splitCharacter);
          });
        } else if (hasChanged) {
          var _selectors7 = value;
          functions.push(function () {
            return addAttributes(element, _selectors7, splitCharacter);
          });
        }
      } // Execute functions with optional delay.


      delayExecutions(functions, element.getAttribute(attributePrefix + '-delay'));

      if (typeof window.CustomEvent === 'function') {
        // Dispatch custom event.
        element.dispatchEvent(new CustomEvent('onview-change', {
          detail: {
            entry: entry
          }
        }));
      }
    });
  }

  var READY_STATES = {
    complete: 'complete',
    interactive: 'interactive',
    never: 'never'
  };

  var OnView = /*#__PURE__*/function () {
    /**
     * Construct OnView instance.
     * @param {Object} options Module options. (See: README.md)
     * @returns {Object} OnView instance.
     */
    function OnView(options) {
      var _this = this;

      _classCallCheck(this, OnView);

      this._initialized = false; // Set default options.

      this._options = {
        debug: false,
        readyState: READY_STATES.complete,
        observedElement: document.body,
        observerElement: null,
        observerMargin: '0px',
        attributePrefix: 'data-onview',
        eventContextName: 'detail',
        selectorSplitCharacter: ','
      }; // If custom options given then override the defaults.

      if (options && options !== {}) {
        this._options = Object.assign(this._options, options); // Log changes to console.
      } // Initialize module.


      if (this._options.readyState === READY_STATES.interactive) {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
          // Initialize now.
          this.initialize();
        } else {
          // Wait for DOM interactive, then initialize.
          document.addEventListener('DOMContentLoaded', function () {
            _this.initialize();
          });
        }
      } else if (this._options.readyState === READY_STATES.complete) {
        if (document.readyState === 'complete') {
          // Initialize now.
          this.initialize();
        } else {
          // Wait for window loaded, then initialize.
          window.addEventListener('load', function () {
            _this.initialize();
          });
        }
      }
    }
    /**
     * Returns clone of current options.
     * @returns {Object} Current options.
     */


    _createClass(OnView, [{
      key: "getOptions",
      value: function getOptions() {
        return Object.assign({}, this._options);
      }
      /**
       * Returns whether the instance has been initialized.
       * @returns {Boolean} Whether the instance has been initialized
       */

    }, {
      key: "isInitialized",
      value: function isInitialized() {
        return this._initialized;
      }
      /**
       * Initialize module instance.
       */

    }, {
      key: "initialize",
      value: function initialize() {
        var _this2 = this;

        // Check if already initialized.
        if (this._initialized) {

          return;
        }

        this._initialized = true; // Define observer options.

        var observerOptions = Object.assign({
          threshold: 0
        }, {
          root: this._options.observerElement,
          rootMargin: this._options.observerMargin
        }); // Create observer instance.

        this._observer = new IntersectionObserver(function (_entries, _observer) {
          handleIntersection(_this2, _entries, _observer);
        }, observerOptions); // Query documents for elements to track.

        this.queryDocument();
      }
      /**
       * Destroy this instance.
       */

    }, {
      key: "destroy",
      value: function destroy() {
        // Disable and discard observer.
        if (this._observer) {
          this._observer.disconnect();
        }

        this._observer = null; // Set initialization to false.

        this._initialized = false; // Reset options.

        this._options = null;
      }
      /**
       * Query document for elements to track.
       */

    }, {
      key: "queryDocument",
      value: function queryDocument() {
        var _this3 = this;

        // Get currently observed elements.
        var observedElements = this._observer.takeRecords().map(function (entry) {
          return entry.target;
        }); // Query document of elements to track.


        var queries = ATTRIBUTES.map(function (attribute) {
          return '[' + _this3._options.attributePrefix + attribute + ']';
        });

        var elements = this._options.observedElement.querySelectorAll(queries.join(',')); // If queried before.


        if (observedElements.length > 0) {
          // Compare previous list of elements to new elements.
          Array.prototype.forEach.call(elements, function (element) {
            // Filter elements out that are already being observer.
            if (observedElements.indexOf(element) >= 0) {
              return;
            } // Add element to observer.


            _this3._observer.observe(element);
          });
        } else {
          // Add elements to observer.
          Array.prototype.forEach.call(elements, function (element) {
            _this3._observer.observe(element);
          });
        }
      }
    }]);

    return OnView;
  }(); // Set public static variables.


  OnView.READY_STATES = READY_STATES;
  OnView.VERSION = '1.0.5'; // Export module class.

  return OnView;

}());
//# sourceMappingURL=onview.iife.js.map
