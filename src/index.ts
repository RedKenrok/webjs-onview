// Module helpers.
import overrideProperties from './helpers/overrideProperties';
// Intersection handler helpers.
import executeCode from './helpers/executeCode';
import addAttributes from './helpers/addAttributes';
import removeAttributes from './helpers/removeAttributes';

/**
 * OnView class.
 */
class OnView {
	/**
	 * Private static variables.
	 */
	public static READY_STATES = {
		complete: `complete`,
		interactive: `interactive`,
		never: `never`,
	};
	private static ATTRIBUTES = [
		`data-onview`,
		`data-onview-enter`,
		`data-onview-enter-add`,
		`data-onview-enter-remove`,
		`data-onview-enter-toggle`,
		`data-onview-exit`,
		`data-onview-exit-add`,
		`data-onview-exit-remove`,
		`data-onview-exit-toggle`,
	];

	/**
	 * Private variables.
	 */
	private _initialized:boolean = false;
	private _options: {
		debug?:boolean;
		readyState?:string;

		observedElement?:Element;
		observerElement?:Element;
		observerMargin?:string;

		eventContextName?:string;
		selectorSplitCharacter?: string;
	};
	private _observer:IntersectionObserver;

	/**
	 * Construct OnView instance.
	 * @param _options Module options. (See: README.md)
	 */
	public constructor(_options:object) {
		// Set default options.
		this._options = {
			debug: false,
			readyState: OnView.READY_STATES.complete,

			observedElement: document.body,
			observerElement: null,
			observerMargin: `0px`,

			eventContextName: `detail`,
			selectorSplitCharacter: `?`,
		};
		// If custom options given then override the defaults.
		if (_options && _options !== {}) {
			this._options = overrideProperties(this._options, _options);

			// Log changes to console.
			if (this._options.debug) {
				console.log(`OnView: overwriting options, new options:`, this._options);
			}
		}

		// Initialize module.
		if (this._options.readyState === OnView.READY_STATES.interactive) {
			if (document.readyState === `interactive` || document.readyState === `complete`) {
				// Initialize now.
				this.initialize();
			} else {
				// Wait for DOM interactive, then initialize.
				document.addEventListener(`DOMContentLoaded`, () => {
					this.initialize();
				});
			}
		} else if (this._options.readyState === OnView.READY_STATES.complete) {
			if (document.readyState === `complete`) {
				// Initialize now.
				this.initialize();
			} else {
				// Wait for window loaded, then initialize.
				window.addEventListener(`load`, () => {
					this.initialize();
				});
			}
		}
	}

	/**
	 * Returns clone of current options.
	 */
	public getOptions() {
		return overrideProperties({}, this._options);
	}

	/**
	 * Initialize module instance.
	 */
	public initialize() {
		// Check if already initialized.
		if (this._initialized !== false) {
			if (this._options.debug) {
				console.warn(`OnView: module instance already initialized, therefore re-initialization is ignored.`);
			}

			return;
		}
		this._initialized = true;

		// Setup intersection observer.
		this.setupObserver();
		// Query documents for elements to track.
		this.queryDocument();

		if (this._options.debug) {
			console.log(`OnView: module instance initialized.`);
		}
	}
	/**
	 * Destroy this instance.
	 */
	public destroy() {
		// Disable and discard observer.
		this._observer.disconnect();
		this._observer = null;

		// Set initialization to false.
		this._initialized = false;

		// Reset options.
		this._options = null;
	}
	/**
	 * Query document for elements to track.
	 */
	public queryDocument() {
		// Get currently observed elements.
		const observedElements:Element[] = this._observer.takeRecords().map((entry:IntersectionObserverEntry) => {
			return entry.target;
		});
		// Query document of elements to track.
		const query:string[] = OnView.ATTRIBUTES.map((attribute) => {
			return `[` + attribute + `]`;
		});
		const elements:NodeListOf<Element> = this._options.observedElement.querySelectorAll(query.join(`,`));

		// If queried before.
		if (observedElements.length > 0) {
			// Compare previous list of elements to new elements.
			Array.prototype.forEach.call(elements, (element) => {
				// Filter elements out that are already being observer.
				if (observedElements.indexOf(element) >= 0) {
					return;
				}

				// Add element to observer.
				this._observer.observe(element);
			});
		} else {
			// Add elements to observer.
			Array.prototype.forEach.call(elements, (element) => {
				this._observer.observe(element);
			});
		}

		if (this._options.debug) {
			console.log(`OnView: queried document for elements, observered elements: `, elements);
		}
	}

	/**
	 * Setup intersection observer.
	 */
	private setupObserver() {
		// Define observer options.
		const observerOptions = overrideProperties({
			threshold: 0,
		}, {
			root: this._options.observerElement,
			rootMargin: this._options.observerMargin,
		});

		// Create observer instance.
		this._observer = new IntersectionObserver(this.handleIntersect, observerOptions);
	}
	/**
	 * Handle intersection events.
	 * @param _entries
	 * @param _observer
	 */
	private handleIntersect = (_entries: IntersectionObserverEntry[], _observer: IntersectionObserver) => {
		Array.prototype.forEach.call(_entries, (entry:IntersectionObserverEntry) => {
			if (this._options.debug) {
				console.log(`OnView: Intersection change triggered for: `, entry);
			}

			// Get time sensitive reused options.
			const splitCharacter:string = this._options.selectorSplitCharacter;

			// Get HTML element from entry.
			const element:HTMLElement = <HTMLElement> entry.target;

			// Get whether it has changed.
			const hasChanged:boolean = (element.dataset.onviewIsintersecting === `true`) != entry.isIntersecting;
			element.dataset.onviewIsintersecting = entry.isIntersecting.toString();

			// Store function that need execution.
			const functions:Function[] = [];

			// Execute code on view enter and exit.
			if (element.dataset.onview && element.dataset.onview.length > 0) {
				const code:string = element.dataset.onview;
				functions.push(() => executeCode(code, {
					entry: entry,
				}, this._options.eventContextName));
			}
			if (entry.isIntersecting) {
				// Execute code on view enter.
				if (element.dataset.onviewEnter) {
					const code: string = element.dataset.onviewEnter;
					functions.push(() => executeCode(code, {
						entry: entry,
					}, this._options.eventContextName));

					this.removeFromObserving(element, _observer, `data-onview-enter`);
				}
				// Add attributes on view enter.
				if (element.dataset.onviewEnterAdd) {
					const selectors: string = element.dataset.onviewEnterAdd;
					functions.push(() => addAttributes(element, selectors, splitCharacter));

					this.removeFromObserving(element, _observer, `data-onview-enter-add`);
				}
				// Remove attributes on view enter.
				if (element.dataset.onviewEnterRemove) {
					const selectors: string = element.dataset.onviewEnterRemove;
					functions.push(() => removeAttributes(element, selectors, splitCharacter));

					this.removeFromObserving(element, _observer, `data-onview-enter-remove`);
				}
			}
			// Add attributes when in view and remove attributes when out of view.
			if (element.dataset.onviewEnterToggle) {
				if (entry.isIntersecting) {
					const selectors:string = element.dataset.onviewEnterToggle;
					functions.push(() => addAttributes(element, selectors, splitCharacter));
				} else if (hasChanged) {
					const selectors:string = element.dataset.onviewEnterToggle;
					functions.push(() => removeAttributes(element, selectors, splitCharacter));
				}
			}
			if (hasChanged && !entry.isIntersecting) {
				// Execute code on view exit.
				if (element.dataset.onviewExit) {
					const code:string = element.dataset.onviewExit;
					functions.push(() => executeCode(code, {
						entry: entry,
					}, this._options.eventContextName));

					this.removeFromObserving(element, _observer, `data-onview-exit`);
				}
				// Add attributes on view exit.
				if (element.dataset.onviewExitAdd) {
					const selectors:string = element.dataset.onviewExitAdd;
					functions.push(() => addAttributes(element, selectors, splitCharacter));

					this.removeFromObserving(element, _observer, `data-onview-exit-add`);
				}
				// Remove attributes on view exit.
				if (element.dataset.onviewExitRemove) {
					const selectors:string = element.dataset.onviewExitRemove;
					functions.push(() => removeAttributes(element, selectors, splitCharacter));

					this.removeFromObserving(element, _observer, `data-onview-exit-remove`);
				}
			}
			// Remove attributes when in view and add attributes when out of view.
			if (element.dataset.onviewExitToggle) {
				if (entry.isIntersecting) {
					const selectors:string = element.dataset.onviewExitToggle;
					functions.push(() => removeAttributes(element, selectors, splitCharacter));
				} else if (hasChanged) {
					const selectors:string = element.dataset.onviewExitToggle;
					functions.push(() => addAttributes(element, selectors, splitCharacter));
				}
			}

			// Execute functions with optional delay.
			this.delayExecutions(functions, element.dataset.onviewDelay);

			if (typeof(window.CustomEvent) === `function`) {
				// Dispatch custom event.
				element.dispatchEvent(new CustomEvent(`onview-change`, {
					detail: {
						entry: entry,
					},
				}));
			}
		});
	};
	/**
	 * Delay invocation of the method by the amount of delay.
	 * @param _functions Functions to invoke after the delay has passed.
	 * @param _delayText Interger parsable string with time in milliseconds.
	 */
	private delayExecutions(_functions:Function[], _delayText:string) {
		if (_functions.length <= 0) {
			return;
		}

		if (!_delayText) {
			_functions.forEach(_function => {
				_function();
			});
			return;
		}

		const delay:number = parseInt(_delayText, 10);
		if (delay <= 0) {
			_functions.forEach(_function => {
				_function();
			});
			return;
		}

		setTimeout(() => {
			_functions.forEach(_function => {
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
	private removeFromObserving(_element: HTMLElement, _observer: IntersectionObserver, _attributeName: string) {
		// If repeat is set then do not remove.
		if (_element.dataset.onviewRepeat) {
			return;
		}

		// Remove attribute that got invoked.
		_element.removeAttribute(_attributeName);

		// Check for other OnView observable attributes, if any left then exit early.
		if (OnView.ATTRIBUTES.filter((attribute) => _element.hasAttribute(attribute)).length > 0) {
			return;
		}

		// Remove automatically added element.
		_element.removeAttribute(`data-onview-isintersecting`);
		// Remove element from being observed.
		_observer.unobserve(_element);
	}
}

// Export module class.
export default OnView;
