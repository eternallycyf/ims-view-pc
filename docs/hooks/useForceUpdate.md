---
title: useForceUpdate
order: 3
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/docs/hooks/useForceUpdate.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useForceUpdate.ts
---

## useForceUpdate

```ts
import * as React from 'react';

export default function useForceUpdate() {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  return forceUpdate;
}
```

## Params

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |

## Result

| 属性           | 说明     | 类型         |
| -------------- | -------- | ------------ |
| useForceUpdate | 强制更新 | `() => void` |
