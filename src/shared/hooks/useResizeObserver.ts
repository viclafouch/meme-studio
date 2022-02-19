import React from 'react'

export function useResizeObserver(ref: React.RefObject<Element>) {
  const [dimensions, setDimensions] = React.useState<Dimensions>({
    width: 0,
    height: 0
  })

  React.useEffect(() => {
    const element = ref.current
    const resizeObserver = new ResizeObserver(([event]) => {
      const { inlineSize, blockSize } = event.contentBoxSize[0]
      setDimensions({
        width: inlineSize,
        height: blockSize
      })
    })
    if (element) {
      resizeObserver.observe(element)
      return () => {
        resizeObserver.unobserve(element)
      }
    }
    return () => {}
  }, [ref])

  return dimensions
}
