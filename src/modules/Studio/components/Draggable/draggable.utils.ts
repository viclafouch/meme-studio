import { radToDegree } from '@shared/helpers/number'
import type { MaxSizes, State } from './Draggable.types'

export function move(
  event: MouseEvent,
  state: State,
  sizes: { height: number; width: number },
  maxSizes: MaxSizes
): { left: number; top: number } {
  const { pageY, pageX } = event
  const { downStartY, downStartX } = state
  const { height, width } = sizes
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
  sizes: { left: number; top: number; height: number; width: number },
  maxSizes: MaxSizes
): { left: number; top: number; height: number; width: number } {
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

  let { height, width, top, left } = sizes

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

export function rotate(event: MouseEvent, state: State): { rotateDeg: number } {
  const radian =
    Math.atan2(
      event.pageY - (state.startOffsetTop as number),
      event.pageX - (state.startOffsetLeft as number)
    ) -
    Math.atan2(
      (state.downPageY as number) - (state.startOffsetTop as number),
      (state.downPageX as number) - (state.startOffsetLeft as number)
    ) +
    (state.radOnDown as number)
  const degree = radToDegree(radian)

  return {
    rotateDeg: degree > -3.2 && degree < 3.2 ? 0 : degree
  }
}
