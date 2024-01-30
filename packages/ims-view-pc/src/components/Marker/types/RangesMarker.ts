import { ElementType } from 'react';
import { BaseOptions } from './BaseOptions';
import { UnmarkOptions } from './UnmarkOptions';

/**
 * @public
 */
export type RangeMarkerItem = {
  start: number;
  length: number;
};

/**
 * @public
 */
interface UniqueRangesMarkerOptions {
  className: string;
  debug: boolean;
  element: string;
  exclude: string[];
  iframes: boolean;
  iframesTimeout: number;
}

/**
 * @public
 */
export type RangesMarkerOptions = Partial<UniqueRangesMarkerOptions> & Partial<BaseOptions>;

/**
 * @public
 */
export interface RangesMarkerProps<T> {
  children?: React.ReactNode;
  as?: string | ElementType;
  mark?: RangeMarkerItem[];
  options?: RangesMarkerOptions;
  unmarkOptions?: UnmarkOptions;
  elementProps?: T;
  style?: React.CSSProperties;
}
