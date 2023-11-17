/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

type AnyFunction = (...args: any[]) => any

export function useEvent<T extends AnyFunction>(callback: T): T {
  const ref = React.useRef({
    stableFn: ((...args: any) => {
      return ref.current.callback(...args)
    }) as any,
    callback
  })
  // Or useInsertionEffect if it's React 18
  React.useLayoutEffect(() => {
    ref.current.callback = callback
  })

  return ref.current.stableFn
}
