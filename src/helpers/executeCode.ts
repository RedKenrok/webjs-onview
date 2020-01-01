/**
 * Executes code relatively safely.
 * @param _code
 * @param _contextName
 * @param _context
 */
export default function(_code:string, _context:object, _contextName:string = `context`) {
	return Function(`"use strict"; return (function(` + _contextName + `) { ` + _code + ` });`)()(_context);
}
