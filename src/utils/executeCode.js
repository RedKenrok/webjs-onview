/**
 * Executes code relatively safely.
 * @param {String} code Code to execute.
 * @param {any} context Context variable of the code.
 * @param {String} contextName Name of context variable. Default is 'context'.
 * @returns {Any} Returns the return of code.
 */
export default function (code, context, contextName = 'context') {
  return Function('"use strict"; return (function(' + contextName + ') { ' + code + ' });')()(context) // eslint-disable-line no-new-func
}
