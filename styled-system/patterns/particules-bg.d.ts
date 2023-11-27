/* eslint-disable */
import type { SystemStyleObject, ConditionalValue } from '../types/index';
import type { Properties } from '../types/csstype';
import type { PropertyValue } from '../types/prop-type';
import type { DistributiveOmit } from '../types/system-types';
import type { Tokens } from '../tokens/index';

export interface ParticulesBgProperties {
   
}


interface ParticulesBgStyles extends ParticulesBgProperties, DistributiveOmit<SystemStyleObject, keyof ParticulesBgProperties > {}

interface ParticulesBgPatternFn {
  (styles?: ParticulesBgStyles): string
  raw: (styles?: ParticulesBgStyles) => SystemStyleObject
}


export declare const particulesBg: ParticulesBgPatternFn;
