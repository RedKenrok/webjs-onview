/**
 * Delay invocation of the method by the amount of delay.
 * @param {Array<Function>} functions Functions to invoke after the delay has passed.
 * @param {String} delayText Interger parsable string with time in milliseconds. Default is null.
 */
export default function (functions, delayText = null) {
  if (functions.length <= 0) {
    return
  }

  if (!delayText) {
    functions.forEach(_function => {
      _function()
    })
    return
  }

  const delay = parseInt(delayText, 10)
  if (delay <= 0) {
    functions.forEach(_function => {
      _function()
    })
    return
  }

  setTimeout(() => {
    functions.forEach(_function => {
      _function()
    })
  }, delay)
}
