import { createElement, forwardRef } from 'react'
import { mergeCss } from '../css/css.mjs';
import { splitProps } from '../helpers.mjs';
import { getParticulesBgStyle } from '../patterns/particules-bg.mjs';
import { styled } from './factory.mjs';

export const ParticulesBg = /* @__PURE__ */ forwardRef(function ParticulesBg(props, ref) {
  const [patternProps, restProps] = splitProps(props, [])

const styleProps = getParticulesBgStyle(patternProps)
const mergedProps = { ref, ...styleProps, ...restProps }

return createElement(styled.div, mergedProps)
  })