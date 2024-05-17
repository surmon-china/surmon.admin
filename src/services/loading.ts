import { useState } from 'react'

export const useLoading = (initState = false) => {
  const [state, setState] = useState(initState)

  const start = () => setState(true)
  const stop = () => setState(false)
  const handlePromise = <T>(promise: Promise<T>): Promise<T> => {
    start()
    return promise.finally(stop)
  }

  return {
    state,
    start,
    stop,
    promise: handlePromise
  }
}
