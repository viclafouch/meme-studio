import { useIsomorphicLayoutEffect } from '@shared/hooks/useIsomorphicLayoutEffect'

type Options = {
  elementRef?: React.RefObject<HTMLElement>
}

export function useWindowSizeCallback(
  callback: (windowSize: { width: number; height: number }) => void,
  { elementRef }: Options = {}
) {
  const handleChangeResize = () => {
    const element = elementRef?.current || window
    callback({
      width:
        element instanceof HTMLElement
          ? element.clientWidth
          : element.innerWidth,
      height:
        element instanceof HTMLElement
          ? element.clientHeight
          : element.innerHeight
    })
  }

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('resize', handleChangeResize, false)

    handleChangeResize()

    return () => {
      window.removeEventListener('resize', handleChangeResize, false)
    }
  }, [elementRef])
}
