import type { MaxSizes, MoveReturn, State } from './draggable.types'

export function move(
  event: MouseEvent,
  state: State,
  maxSizes: MaxSizes
): MoveReturn {
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
