export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  callback: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout>

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      return callback(...args)
    }, waitFor)
  }

  return debounced
}
