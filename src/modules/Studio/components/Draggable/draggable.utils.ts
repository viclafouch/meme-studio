import type { MaxSizes, State } from './draggable.types'

export function move(
  event: MouseEvent,
  state: State,
  maxSizes: MaxSizes
): Pick<State, 'left' | 'top'> {
  const { pageY, pageX } = event
  const { downStartY, downStartX, height, width } = state
  let top = pageY - (downStartY || 0)
  let left = pageX - (downStartX || 0)
  if (top < 0) {
    top = 0
  } else if (top + height >= maxSizes.height) {
    top = maxSizes.height - height
  }
  if (left < 0) {
    left = 0
  } else if (left + width >= maxSizes.width) {
    left = maxSizes.width - width
  }

  return {
    left,
    top
  }
}

export function resize(
  event: MouseEvent,
  state: State,
  maxSizes: MaxSizes
): Pick<State, 'height' | 'width' | 'top' | 'left'> {
  const {
    topOnDown,
    leftOnDown,
    heightOnDown,
    widthOnDown,
    downPageY,
    downPageX,
    mode
  } = state as NoNullFields<State>
  const spacingHeight = event.pageY - downPageY
  const spacingWidth = event.pageX - downPageX
  const right = maxSizes.width - (leftOnDown + widthOnDown)
  const bottom = maxSizes.height - (topOnDown + heightOnDown)

  let { height, width, top, left } = state

  if (mode === 'resizing-se' || mode === 'resizing-sw') {
    if (heightOnDown + spacingHeight > 10) {
      height = heightOnDown + spacingHeight
      if (top + height >= maxSizes.height) {
        height = maxSizes.height - top
      }
    } else {
      height = 10
    }
  } else if (heightOnDown - spacingHeight > 10) {
    top = topOnDown + spacingHeight
    if (top < 0) {
      top = 0
      height = maxSizes.height - bottom
    } else {
      height = heightOnDown - spacingHeight
    }
  } else {
    height = 10
    top = maxSizes.height - bottom - height
  }

  if (mode === 'resizing-ne' || mode === 'resizing-se') {
    if (widthOnDown + spacingWidth > 10) {
      width = widthOnDown + spacingWidth
      if (left + width >= maxSizes.width) {
        width = maxSizes.width - left
      }
    } else {
      width = 10
    }
  } else if (widthOnDown - spacingWidth > 10) {
    left = leftOnDown + spacingWidth
    if (left <= 0) {
      left = 0
      width = maxSizes.width - right
    } else {
      width = widthOnDown - spacingWidth
    }
  } else {
    width = 10
    left = maxSizes.width - right - width
  }

  return {
    height,
    width,
    top,
    left
  }
}
