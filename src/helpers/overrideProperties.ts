/**
 * Simplified object.assign function.
 * @param _a
 * @param _b
 */
export default function(_a, _b) {
	Object.keys(_b).forEach(function(key) {
		_a[key] = _b[key];
	});
	return _a;
}
