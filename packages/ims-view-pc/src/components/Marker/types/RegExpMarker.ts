import { ElementType } from 'react';
import { BaseOptions } from './BaseOptions';
import { UnmarkOptions } from './UnmarkOptions';

/**
 * @public
 */
interface UniqueRegExpMarkerOptions {
  /**
   * Whether to search for matches across elements
   * @defaultValue `false`
   */
  acrossElements: boolean;
  /**
   * Indicates the number of matching groups to ignore in the replacement. Can be used e.g. to implement non-capturing lookbehind groups. Note that when the value is > 0 (when groups should be ignored), it expects a total amount of groups in the RegExp of `ignoreGroups` + 1
   */
  ignoreGroups: number;
}

/**
 * @public
 */
export type RegExpMarkerOptions = Partial<BaseOptions> & Partial<UniqueRegExpMarkerOptions>;

/**
 * @public
 */
export type RegExpMarkerProps<T> = {
  mark?: RegExp;
  options?: RegExpMarkerOptions;
  as?: string | ElementType;
  unmarkOptions?: UnmarkOptions;
  children: React.ReactNode;
  elementProps?: T;
};
