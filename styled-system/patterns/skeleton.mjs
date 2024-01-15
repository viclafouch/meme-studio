import { mapObject } from '../helpers.mjs';
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

export const getSkeletonStyle = (styles = {}) => skeletonConfig.transform(styles, { map: mapObject })

export const skeleton = (styles) => css(getSkeletonStyle(styles))
skeleton.raw = getSkeletonStyle