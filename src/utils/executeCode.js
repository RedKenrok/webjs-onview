/**
 * Executes code relatively safely.
 * @param _code
 * @param _contextName
 * @param _context
 */
export default function (_code, _context, _contextName = 'context') {
  return Function('"use strict"; return (function(' + _contextName + ') { ' + _code + ' });')()(_context) // eslint-disable-line no-new-func
}
