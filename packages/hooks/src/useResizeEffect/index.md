---
title: useResizeEffect
order: 2
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useResizeEffect/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useResizeEffect/index.ts
---

## useResizeEffect

```ts
import { RefObject } from 'react';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import useMemoizedFn from '../useMemoizedFn';

export default function useResizeEffect<T extends HTMLElement>(
  effect: (target: T) => void,
  targetRef: RefObject<T>,
) {
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
}
```

## Params

| 属性        | 说明             | 类型                  | 默认值 |
| ----------- | ---------------- | --------------------- | ------ |
| `effect`    | 变化时触发的事件 | `(target: T) => void` |
| `targetRef` | 监听的元素       | `HTMLDivElement`      |

## Result

| 属性 | 说明 | 类型 |
| ---- | ---- | ---- |
