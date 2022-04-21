import React from 'react'

type WindowSize = {
  width: undefined | number
  height: undefined | number
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState<WindowSize>({
    width: undefined,
    height: undefined
  })

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    handleResize()
  }, [])

  return windowSize
}
