import { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    ga: any
  }
}

export function useWindowWidth(): {
  isMinMdSize: boolean
  isMinLgSize: boolean
  isMinXlSize: boolean
  width: number
} {
  const [width, setWidth] = useState<number>(window.innerWidth)

  const isMinMdSize: boolean = useMemo(() => width >= 768, [width])
  const isMinLgSize: boolean = useMemo(() => width >= 992, [width])
  const isMinXlSize: boolean = useMemo(() => width >= 1200, [width])

  useEffect(() => {
    const handleResize = (): void => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return { width, isMinMdSize, isMinLgSize, isMinXlSize }
}

export function usePageViews(): void {
  const location = useLocation()
  useEffect(() => {
    if (window.ga) {
      window.ga('send', {
        hitType: 'pageview',
        page: location.pathname
      })
    }
  }, [location.pathname])
}
