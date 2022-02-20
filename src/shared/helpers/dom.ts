import * as R from 'ramda'

export function matchIsClientSide(): boolean {
  return typeof window !== 'undefined'
}

export function getAspectRatio(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  return R.min(R.divide(maxWidth, srcWidth), R.divide(maxHeight, srcHeight))
}
