import { useCallback, useRef } from 'react'

export const useDebounce = (timeout = 500) => {
  const timer = useRef(null)
  const debounce = useCallback(
    (fn) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      timer.current = setTimeout(() => {
        fn()
      }, timeout)
    },
    [timeout],
  )
  return debounce
}
