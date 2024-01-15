import { createElement, forwardRef } from 'react'
import { mergeCss } from '../css/css.mjs';
import { splitProps } from '../helpers.mjs';
import { getSkeletonStyle } from '../patterns/skeleton.mjs';
import { styled } from './factory.mjs';

export const Skeleton = /* @__PURE__ */ forwardRef(function Skeleton(props, ref) {
  const [patternProps, restProps] = splitProps(props, [])

const styleProps = getSkeletonStyle(patternProps)
const mergedProps = { ref, ...styleProps, ...restProps }

return createElement(styled.div, mergedProps)
  })