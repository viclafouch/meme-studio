/* eslint-disable */
import type { FunctionComponent } from 'react'
import type { SkeletonProperties } from '../patterns/skeleton';
import type { HTMLStyledProps } from '../types/jsx';
import type { DistributiveOmit } from '../types/system-types';

export interface SkeletonProps extends SkeletonProperties, DistributiveOmit<HTMLStyledProps<'div'>, keyof SkeletonProperties > {}


export declare const Skeleton: FunctionComponent<SkeletonProps>