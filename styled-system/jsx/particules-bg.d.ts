/* eslint-disable */
import type { FunctionComponent } from 'react'
import type { ParticulesBgProperties } from '../patterns/particules-bg';
import type { HTMLStyledProps } from '../types/jsx';
import type { DistributiveOmit } from '../types/system-types';

export interface ParticulesBgProps extends ParticulesBgProperties, DistributiveOmit<HTMLStyledProps<'div'>, keyof ParticulesBgProperties > {}


export declare const ParticulesBg: FunctionComponent<ParticulesBgProps>