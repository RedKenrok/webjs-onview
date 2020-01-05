(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.OnView = factory());
}(this, (function () { 'use strict';

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /**
   * Simplified object.assign function.
   * @param _a
   * @param _b
   */
  function overrideProperties (_a, _b) {
    Object.keys(_b).forEach(function (key) {
      _a[key] = _b[key];
    });
    return _a;
  }

  /**
   * Executes code relatively safely.
   * @param _code
   * @param _contextName
   * @param _context
   */
  function executeCode (_code, _context) {
    var _contextName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "context";

    return Function("\"use strict\"; return (function(" + _contextName + ") { " + _code + " });")()(_context);
  }

  /**
   * Add id, class, or other attribute using a query selector style query.
   * @param _element
   * @param _selectors
   * @param _splitCharacter
   */
  function addAttributes (_element, _selectors) {
    var _splitCharacter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ",";

    var key, value;
    Array.prototype.forEach.call(_selectors.split(_splitCharacter), function (selector) {
      // Trim spaces.
      selector = selector.trim(); // Base what to do of

      switch (selector[0]) {
        case "#":
          // Remove starting character and replace spaces with dashes.
          selector = selector.substring(1).replace(" ", "-"); // Set id.

          _element.id = selector;
          break;

        case ".":
          // Remove starting character and replace spaces with dashes.
          selector = selector.substring(1).replace(" ", "-"); // Add class if not part of classlist.

          if (!_element.classList.contains(selector)) {
            _element.classList.add(selector);
          }

          break;

        case "[":
          // Remove brackets, split key and value, replace spaces with dashes in key.
          key = selector.substring(1, selector.indexOf("="));
          value = selector.substring(key.length + 2, selector.length - 1);
          key = key.replace(" ", "-"); // Set attribute.

          _element.setAttribute(key, value);

          break;
      }
    });
  }

  /**
   * Remove id, class, or other attribute using a query selector style query.
   * @param _element
   * @param _selectors
   * @param _splitCharacter
   */
  function removeAttributes (_element, _selectors) {
    var _splitCharacter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ",";

    var index, key;
    Array.prototype.forEach.call(_selectors.split(_splitCharacter), function (selector) {
      // Trim spaces.
      selector = selector.trim(); // Base what to do of

      switch (selector[0]) {
        case "#":
          // Remove starting character and replace spaces with dashes.
          selector = selector.substring(1).replace(" ", "-"); // Remove id attribute.

          _element.removeAttribute(selector);

          break;

        case ".":
          // Remove starting character and replace spaces with dashes.
          selector = selector.substring(1).replace(" ", "-"); // Remove class if part of classlist.

          if (_element.classList.contains(selector)) {
            _element.classList.remove(selector);
          }

          break;

        case "[":
          // Remove brackets, split key from value, replace spaces with dashes in key.
          index = selector.indexOf("=");

          if (index < 0) {
            index = selector.length - 1;
          }

          key = selector.substring(1, index);
          key = key.replace(" ", "-"); // Set attribute.

          _element.removeAttribute(key);

          break;
      }
    });
  }

  /**
   * OnView class.
   */

  var OnView =
  /*#__PURE__*/
  function () {
    /**
     * Private static variables.
     */

    /**
     * Private variables.
     */

    /**
     * Construct OnView instance.
     * @param _options Module options. (See: README.md)
     */
    function OnView(_options) {
      var _this = this;

      _classCallCheck(this, OnView);

      _defineProperty(this, "_initialized", false);

      _defineProperty(this, "_options", void 0);

      _defineProperty(this, "_observer", void 0);

      _defineProperty(this, "handleIntersect", function (_entries, _observer) {
        Array.prototype.forEach.call(_entries, function (entry) {
          if (_this._options.debug) {
            console.log("OnView: Intersection change triggered for: ", entry);
          } // Get time sensitive reused options.


          var splitCharacter = _this._options.selectorSplitCharacter; // Get HTML element from entry.

          var element = entry.target; // Get whether it has changed.

          var hasChanged = element.dataset.onviewIsintersecting === "true" != entry.isIntersecting;
          element.dataset.onviewIsintersecting = entry.isIntersecting.toString(); // Store function that need execution.

          var functions = []; // Execute code on view enter and exit.

          if (element.dataset.onview && element.dataset.onview.length > 0) {
            var code = element.dataset.onview;
            functions.push(function () {
              return executeCode(code, {
                entry: entry
              }, _this._options.eventContextName);
            });
          }

          if (entry.isIntersecting) {
            // Execute code on view enter.
            if (element.dataset.onviewEnter) {
              var _code = element.dataset.onviewEnter;
              functions.push(function () {
                return executeCode(_code, {
                  entry: entry
                }, _this._options.eventContextName);
              });

              _this.removeFromObserving(element, _observer, "data-onview-enter");
            } // Add attributes on view enter.


            if (element.dataset.onviewEnterAdd) {
              var selectors = element.dataset.onviewEnterAdd;
              functions.push(function () {
                return addAttributes(element, selectors, splitCharacter);
              });

              _this.removeFromObserving(element, _observer, "data-onview-enter-add");
            } // Remove attributes on view enter.


            if (element.dataset.onviewEnterRemove) {
              var _selectors = element.dataset.onviewEnterRemove;
              functions.push(function () {
                return removeAttributes(element, _selectors, splitCharacter);
              });

              _this.removeFromObserving(element, _observer, "data-onview-enter-remove");
            }
          } // Add attributes when in view and remove attributes when out of view.


          if (element.dataset.onviewEnterToggle) {
            if (entry.isIntersecting) {
              var _selectors2 = element.dataset.onviewEnterToggle;
              functions.push(function () {
                return addAttributes(element, _selectors2, splitCharacter);
              });
            } else if (hasChanged) {
              var _selectors3 = element.dataset.onviewEnterToggle;
              functions.push(function () {
                return removeAttributes(element, _selectors3, splitCharacter);
              });
            }
          }

          if (hasChanged && !entry.isIntersecting) {
            // Execute code on view exit.
            if (element.dataset.onviewExit) {
              var _code2 = element.dataset.onviewExit;
              functions.push(function () {
                return executeCode(_code2, {
                  entry: entry
                }, _this._options.eventContextName);
              });

              _this.removeFromObserving(element, _observer, "data-onview-exit");
            } // Add attributes on view exit.


            if (element.dataset.onviewExitAdd) {
              var _selectors4 = element.dataset.onviewExitAdd;
              functions.push(function () {
                return addAttributes(element, _selectors4, splitCharacter);
              });

              _this.removeFromObserving(element, _observer, "data-onview-exit-add");
            } // Remove attributes on view exit.


            if (element.dataset.onviewExitRemove) {
              var _selectors5 = element.dataset.onviewExitRemove;
              functions.push(function () {
                return removeAttributes(element, _selectors5, splitCharacter);
              });

              _this.removeFromObserving(element, _observer, "data-onview-exit-remove");
            }
          } // Remove attributes when in view and add attributes when out of view.


          if (element.dataset.onviewExitToggle) {
            if (entry.isIntersecting) {
              var _selectors6 = element.dataset.onviewExitToggle;
              functions.push(function () {
                return removeAttributes(element, _selectors6, splitCharacter);
              });
            } else if (hasChanged) {
              var _selectors7 = element.dataset.onviewExitToggle;
              functions.push(function () {
                return addAttributes(element, _selectors7, splitCharacter);
              });
            }
          } // Execute functions with optional delay.


          _this.delayExecutions(functions, element.dataset.onviewDelay);

          if (typeof window.CustomEvent === "function") {
            // Dispatch custom event.
            element.dispatchEvent(new CustomEvent("onview-change", {
              detail: {
                entry: entry
              }
            }));
          }
        });
      });

      // Set default options.
      this._options = {
        debug: false,
        readyState: OnView.READY_STATES.complete,
        observedElement: document.body,
        observerElement: null,
        observerMargin: "0px",
        eventContextName: "detail",
        selectorSplitCharacter: "?"
      }; // If custom options given then override the defaults.

      if (_options && _options !== {}) {
        this._options = overrideProperties(this._options, _options); // Log changes to console.

        if (this._options.debug) {
          console.log("OnView: overwriting options, new options:", this._options);
        }
      } // Initialize module.


      if (this._options.readyState === OnView.READY_STATES.interactive) {
        if (document.readyState === "interactive" || document.readyState === "complete") {
          // Initialize now.
          this.initialize();
        } else {
          // Wait for DOM interactive, then initialize.
          document.addEventListener("DOMContentLoaded", function () {
            _this.initialize();
          });
        }
      } else if (this._options.readyState === OnView.READY_STATES.complete) {
        if (document.readyState === "complete") {
          // Initialize now.
          this.initialize();
        } else {
          // Wait for window loaded, then initialize.
          window.addEventListener("load", function () {
            _this.initialize();
          });
        }
      }
    }
    /**
     * Returns clone of current options.
     */


    _createClass(OnView, [{
      key: "getOptions",
      value: function getOptions() {
        return overrideProperties({}, this._options);
      }
      /**
       * Returns whether the instance has been initialized.
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
        // Check if already initialized.
        if (this._initialized) {
          if (this._options.debug) {
            console.warn("OnView: module instance already initialized, therefore re-initialization is ignored.");
          }

          return;
        }

        this._initialized = true; // Setup intersection observer.

        this.setupObserver(); // Query documents for elements to track.

        this.queryDocument();

        if (this._options.debug) {
          console.log("OnView: module instance initialized.");
        }
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
        var _this2 = this;

        // Get currently observed elements.
        var observedElements = this._observer.takeRecords().map(function (entry) {
          return entry.target;
        }); // Query document of elements to track.


        var query = OnView.ATTRIBUTES.map(function (attribute) {
          return "[" + attribute + "]";
        });

        var elements = this._options.observedElement.querySelectorAll(query.join(",")); // If queried before.


        if (observedElements.length > 0) {
          // Compare previous list of elements to new elements.
          Array.prototype.forEach.call(elements, function (element) {
            // Filter elements out that are already being observer.
            if (observedElements.indexOf(element) >= 0) {
              return;
            } // Add element to observer.


            _this2._observer.observe(element);
          });
        } else {
          // Add elements to observer.
          Array.prototype.forEach.call(elements, function (element) {
            _this2._observer.observe(element);
          });
        }

        if (this._options.debug) {
          console.log("OnView: queried document for elements, observered elements: ", elements);
        }
      }
      /**
       * Setup intersection observer.
       */

    }, {
      key: "setupObserver",
      value: function setupObserver() {
        // Ensure there is no previous observer active.
        if (this._observer) {
          this._observer.disconnect();
        } // Define observer options.


        var observerOptions = overrideProperties({
          threshold: 0
        }, {
          root: this._options.observerElement,
          rootMargin: this._options.observerMargin
        }); // Create observer instance.

        this._observer = new IntersectionObserver(this.handleIntersect, observerOptions);
      }
      /**
       * Handle intersection events.
       * @param _entries
       * @param _observer
       */

    }, {
      key: "delayExecutions",

      /**
       * Delay invocation of the method by the amount of delay.
       * @param _functions Functions to invoke after the delay has passed.
       * @param _delayText Interger parsable string with time in milliseconds.
       */
      value: function delayExecutions(_functions, _delayText) {
        if (_functions.length <= 0) {
          return;
        }

        if (!_delayText) {
          _functions.forEach(function (_function) {
            _function();
          });

          return;
        }

        var delay = parseInt(_delayText, 10);

        if (delay <= 0) {
          _functions.forEach(function (_function) {
            _function();
          });

          return;
        }

        setTimeout(function () {
          _functions.forEach(function (_function) {
            _function();
          });
        }, delay);
      }
      /**
       * Removes attribute from element and disable observing if no OnView attributes are left.
       * @param _element
       * @param _observer
       * @param _attributeName
       */

    }, {
      key: "removeFromObserving",
      value: function removeFromObserving(_element, _observer, _attributeName) {
        // If repeat is set then do not remove.
        if (_element.dataset.onviewRepeat) {
          return;
        } // Remove attribute that got invoked.


        _element.removeAttribute(_attributeName); // Check for other OnView observable attributes, if any left then exit early.


        if (OnView.ATTRIBUTES.filter(function (attribute) {
          return _element.hasAttribute(attribute);
        }).length > 0) {
          return;
        } // Remove automatically added element.


        _element.removeAttribute("data-onview-isintersecting"); // Remove element from being observed.


        _observer.unobserve(_element);
      }
    }]);

    return OnView;
  }(); // Export module class.


  _defineProperty(OnView, "READY_STATES", {
    complete: "complete",
    interactive: "interactive",
    never: "never"
  });

  _defineProperty(OnView, "ATTRIBUTES", ["data-onview", "data-onview-enter", "data-onview-enter-add", "data-onview-enter-remove", "data-onview-enter-toggle", "data-onview-exit", "data-onview-exit-add", "data-onview-exit-remove", "data-onview-exit-toggle"]);

  return OnView;

})));
