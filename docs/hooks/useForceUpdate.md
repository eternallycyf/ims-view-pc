---
title: useForceUpdate
order: 3
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
