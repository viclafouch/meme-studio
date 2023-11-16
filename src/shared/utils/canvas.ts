export const calculateAspectRatioFit = (
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) => {
  const aspectRatio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)

  return {
    aspectRatio,
    width: srcWidth * aspectRatio,
    height: srcHeight * aspectRatio
  }
}
