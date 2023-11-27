import { createElement, forwardRef } from 'react'
import { styled } from './factory.mjs';
import { getSkeletonStyle } from '../patterns/skeleton.mjs';

export const Skeleton = /* @__PURE__ */ forwardRef(function Skeleton(props, ref) {
  const styleProps = getSkeletonStyle()
return createElement(styled.div, { ref, ...styleProps, ...props })
})