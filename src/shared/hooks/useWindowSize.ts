import React from 'react'
import { matchIsClientSide } from '@shared/helpers/dom'

export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    width: matchIsClientSide() ? window.innerWidth : 0,
    height: matchIsClientSide() ? window.innerHeight : 0
  })

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      return window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}
