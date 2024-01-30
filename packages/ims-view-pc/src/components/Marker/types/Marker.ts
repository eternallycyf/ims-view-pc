import { ElementType } from 'react';
import { MarkOptions } from './MarkOptions';
import { UnmarkOptions } from './UnmarkOptions';

export interface MarkerProps<T> {
  children?: React.ReactNode;
  as?: string | ElementType;
  mark?: string | string[];
  options?: MarkOptions;
  unmarkOptions?: UnmarkOptions;
  elementProps?: T;
}
