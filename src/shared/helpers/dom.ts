import * as R from 'ramda'

export function matchIsClientSide(): boolean {
  return typeof window !== 'undefined'
}

export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = R.multiply(
    R.min(R.divide(maxWidth, srcWidth), R.divide(maxHeight, srcHeight))
  )
  return {
    width: Math.round(ratio(srcWidth)),
    height: Math.round(ratio(srcHeight))
  }
}
