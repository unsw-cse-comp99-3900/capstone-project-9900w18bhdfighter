// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (fn: Function, delay: number) => {
  let timer: NodeJS.Timeout
  return (..._args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(..._args)
    }, delay)
  }
}

export { debounce }
