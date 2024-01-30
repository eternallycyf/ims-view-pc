import {
  MarkOptions,
  RangeMarkerItem,
  RangesMarkerOptions,
  RegExpMarkerOptions,
  UnmarkOptions,
} from './';

/* eslint-disable */
export class MarkJS {
  constructor(el: Element) {}
  mark(str: string | string[], options?: MarkOptions) {}
  markRanges(ranges: RangeMarkerItem[], options?: RangesMarkerOptions) {}
  markRegExp(regExp: RegExp, options?: RegExpMarkerOptions) {}
  unmark(markOptions?: UnmarkOptions) {}
}
