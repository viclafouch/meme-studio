import { getPatternStyles, patternFns } from '../helpers.mjs';
import { css } from '../css/index.mjs';

const skeletonConfig = {
transform(props) {
  return {
    background: "linear-gradient(to right, #656871 0%, #888b94 20%, #656871 40%, #656871 100%)",
    backgroundSize: "200% 100%",
    animation: "1.5s skeletonLoading linear infinite",
    ...props
  };
}}

export const getSkeletonStyle = (styles = {}) => {
  const _styles = getPatternStyles(skeletonConfig, styles)
  return skeletonConfig.transform(_styles, patternFns)
}

export const skeleton = (styles) => css(getSkeletonStyle(styles))
skeleton.raw = getSkeletonStyle