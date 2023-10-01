---
title: useResizeEffect
order: 9
---

## useResizeEffect

```ts
import { RefObject } from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import useMemoizedFn from './useMemoizedFn';

const useResizeEffect = <T extends HTMLElement>(
  effect: (target: T) => void,
  targetRef: RefObject<T>,
) => {
  const fn = useMemoizedFn(effect);
  useIsomorphicLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    if (window.ResizeObserver) {
      let animationFrame: number;
      const observer = new ResizeObserver(() => {
        animationFrame = window.requestAnimationFrame(() => fn(target));
      });
      observer.observe(target);
      return () => {
        window.cancelAnimationFrame(animationFrame);
        observer.disconnect();
      };
    } else {
      fn(target);
    }
  }, [targetRef]);
};

export default useResizeEffect;
```

## Params

| 属性      | 说明           | 类型           | 默认值 |
| --------- | -------------- | -------------- | ------ |
| target    | 目标元素       | `RefObject<T>` | -      |
| targetRef | 目标元素的 ref | `RefObject<T>` | -      |

## Result

| 属性 | 说明 | 类型 |
| ---- | ---- | ---- |
