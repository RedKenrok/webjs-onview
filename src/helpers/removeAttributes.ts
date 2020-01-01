/**
 * Remove id, class, or other attribute using a query selector style query.
 * @param _element
 * @param _selectors
 * @param _splitCharacter
 */
export default function(_element:HTMLElement, _selectors:string, _splitCharacter:string = `,`) {
	let index:number, key:string;
	Array.prototype.forEach.call(_selectors.split(_splitCharacter), selector => {
		// Trim spaces.
		selector = selector.trim();

		// Base what to do of
		switch(selector[0]) {
			case `#`:
				// Remove starting character and replace spaces with dashes.
				selector = selector.substring(1).replace(` `, `-`);
				// Remove id attribute.
				_element.removeAttribute(selector);
				break;
			case `.`:
				// Remove starting character and replace spaces with dashes.
				selector = selector.substring(1).replace(` `, `-`);
				// Remove class if part of classlist.
				if (_element.classList.contains(selector)) {
					_element.classList.remove(selector);
				}
				break;
			case `[`:
				// Remove brackets, split key from value, replace spaces with dashes in key.
				index = selector.indexOf(`=`);
				if (index < 0) {
					index = selector.length - 1;
				}
				key = selector.substring(1, index);
				key = key.replace(` `, `-`);

				// Set attribute.
				_element.removeAttribute(key);
				break;
		}
	});
}
