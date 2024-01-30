import MarkJS from 'mark.js';
import { createElement, useEffect, useRef, useState } from 'react';
import { DivAttributes, RangesMarkerProps } from './types';

/**
 * @public
 */
export function RangesMarker<T = DivAttributes>({
  as = 'div',
  mark: ranges = [],
  options = {},
  unmarkOptions = {},
  children,
  elementProps,
}: RangesMarkerProps<T>) {
  const markerRef = useRef<null | HTMLDivElement>(null);

  const [markJSInstance, setMarkJSInstance] = useState<MarkJS>();

  useEffect(() => {
    if (markerRef.current) {
      const markJSInstance = new MarkJS(markerRef.current);
      setMarkJSInstance(markJSInstance);
    }
  }, []);

  useEffect(() => {
    if (markJSInstance) {
      Promise.resolve(markJSInstance.unmark(unmarkOptions)).then(() => {
        markJSInstance.markRanges(ranges, options);
      });
    }
  }, [ranges, markJSInstance, options, unmarkOptions]);

  // eslint-disable-next-line react/no-children-prop
  return createElement(as, {
    ref: markerRef,
    children,
    ...elementProps,
  });
}
