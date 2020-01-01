/**
 * Add id, class, or other attribute using a query selector style query.
 * @param _element
 * @param _selectors
 * @param _splitCharacter
 */
export default function(_element:HTMLElement, _selectors:string, _splitCharacter:string = `,`) {
	let key:string, value:string;
	Array.prototype.forEach.call(_selectors.split(_splitCharacter), selector => {
		// Trim spaces.
		selector = selector.trim();

		// Base what to do of
		switch(selector[0]) {
			case `#`:
				// Remove starting character and replace spaces with dashes.
				selector = selector.substring(1).replace(` `, `-`);
				// Set id.
				_element.id = selector;
				break;
			case `.`:
				// Remove starting character and replace spaces with dashes.
				selector = selector.substring(1).replace(` `, `-`);
				// Add class if not part of classlist.
				if (!_element.classList.contains(selector)) {
					_element.classList.add(selector);
				}
				break;
			case `[`:
				// Remove brackets, split key and value, replace spaces with dashes in key.
				key = selector.substring(1, selector.indexOf(`=`));
				value = selector.substring(
					key.length + 2,
					selector.length - 1
				);
				key = key.replace(` `, `-`);

				// Set attribute.
				_element.setAttribute(key, value);
				break;
		}
	});
}
