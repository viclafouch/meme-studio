import { mapObject } from '../helpers.mjs';
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

export const getParticulesBgStyle = (styles = {}) => particulesBgConfig.transform(styles, { map: mapObject })

export const particulesBg = (styles) => css(getParticulesBgStyle(styles))
particulesBg.raw = getParticulesBgStyle