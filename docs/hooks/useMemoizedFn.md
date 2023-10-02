---
title: useMemoizedFn
order: 5
apiHeader:
  pkg: '@ims-view/hooks'
  defaultImport: true
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/docs/hooks/useMemoizedFn.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useMemoizedFn.ts
---

## useMemoizedFn

```ts
import { useMemo, useRef } from 'react';
type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

function useMemoizedFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);

  fnRef.current = useMemo(() => fn, [fn]);

  const memoizedFn = useRef<PickFunction<T>>();
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current as T;
}

export default useMemoizedFn;
```

## Params

| 属性 | 说明 | 类型       | 默认值 |
| ---- | ---- | ---------- | ------ |
| fn   | fn   | `Function` | -      |

## Result

| 属性       | 说明       | 类型       |
| ---------- | ---------- | ---------- |
| memoizedFn | memoizedFn | `Function` |
