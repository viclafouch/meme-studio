import { createElement, forwardRef } from 'react'
import { styled } from './factory.mjs';
import { getParticulesBgStyle } from '../patterns/particules-bg.mjs';

export const ParticulesBg = /* @__PURE__ */ forwardRef(function ParticulesBg(props, ref) {
  const styleProps = getParticulesBgStyle()
return createElement(styled.div, { ref, ...styleProps, ...props })
})