import React from 'react'

export function useWindowSizeCallback(
  callback: (windowSize: Dimensions) => void
) {
  React.useEffect(() => {
    function handleResize() {
      callback({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      return window.removeEventListener('resize', handleResize)
    }
  }, [])
}
