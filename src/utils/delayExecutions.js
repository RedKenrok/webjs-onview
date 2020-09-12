
/**
 * Delay invocation of the method by the amount of delay.
 * @param _functions Functions to invoke after the delay has passed.
 * @param _delayText Interger parsable string with time in milliseconds.
 */
export default function (_functions, _delayText) {
  if (_functions.length <= 0) {
    return
  }

  if (!_delayText) {
    _functions.forEach(_function => {
      _function()
    })
    return
  }

  const delay = parseInt(_delayText, 10)
  if (delay <= 0) {
    _functions.forEach(_function => {
      _function()
    })
    return
  }

  setTimeout(() => {
    _functions.forEach(_function => {
      _function()
    })
  }, delay)
}
