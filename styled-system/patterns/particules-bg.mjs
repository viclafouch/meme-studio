import { getPatternStyles, patternFns } from '../helpers.mjs';
import { css } from '../css/index.mjs';

const particulesBgConfig = {
transform() {
  return {
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundRepeat: "repeat-y",
    backgroundImage: "url('/images/particles.svg')"
  };
}}

export const getParticulesBgStyle = (styles = {}) => {
  const _styles = getPatternStyles(particulesBgConfig, styles)
  return particulesBgConfig.transform(_styles, patternFns)
}

export const particulesBg = (styles) => css(getParticulesBgStyle(styles))
particulesBg.raw = getParticulesBgStyle