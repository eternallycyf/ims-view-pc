import { useLayoutEffect, useMemo, useRef, useState } from 'react';

type SearchSize = 'small' | 'middle' | 'large';
const SizeMap = {
  large: 4,
  middle: 6,
  small: 12,
};

interface UseSizeProps {
  wrapperRef: React.MutableRefObject<HTMLDivElement>;
}

type UseSizeReturn = {
  size: SearchSize;
  span: number;
  calcSpan: number;
};

const useSize = (props: UseSizeProps): UseSizeReturn => {
  const timerRef = useRef<number>(0);
  const [size, setSize] = useState<SearchSize>('small');
  const calcSpan: number = useMemo(() => {
    return SizeMap[size];
  }, [size]);

  const { wrapperRef } = props;

  const getSpanByWrap = () => {
    try {
      let width: number = wrapperRef.current.offsetWidth;
      let size: SearchSize = 'large';

      if (width > 1300) {
        size = 'large';
      } else if (width > 900) {
        size = 'middle';
      } else {
        size = 'small';
      }

      setSize(size);
    } catch {}
  };

  const handleResize = () => {
    let now = Date.now();
    if (now - timerRef.current > 100) {
      getSpanByWrap();
      timerRef.current = now;
    }
  };

  useLayoutEffect(() => {
    let observe = new window.ResizeObserver(() => {
      handleResize();
    });
    observe.observe(wrapperRef.current);
    return () => {
      observe.disconnect();
    };
  }, []);

  return {
    size,
    span: SizeMap[size],
    calcSpan,
  };
};

export default useSize;
