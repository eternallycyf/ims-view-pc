---
title: useSyncState
order: 2
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/docs/hooks/useSyncState/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useSyncState/index.ts
---

## useSyncState

```ts
import * as React from 'react';
import useForceUpdate from './useForceUpdate';

type UseSyncStateProps<T> = readonly [T, (newValue: T) => void];

export default function useSyncState<T>(initialValue: T): UseSyncStateProps<T> {
  const ref = React.useRef<T>(initialValue);
  const forceUpdate = useForceUpdate();

  return [
    ref.current,
    (newValue: T) => {
      ref.current = newValue;
      // re-render
      forceUpdate();
    },
  ] as const;
}
```

## Params

| 属性         | 说明   | 类型 | 默认值 |
| ------------ | ------ | ---- | ------ |
| initialValue | 初始值 | `T`  | -      |

## Result

| 属性            | 说明     | 类型                 |
| --------------- | -------- | -------------------- |
| state           | 状态值   | `T`                  |
| setState(value) | 设置状态 | `(value: T) => void` |
