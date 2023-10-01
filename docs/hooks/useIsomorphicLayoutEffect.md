---
title: useIsomorphicLayoutEffect
order: 4
---

## useIsomorphicLayoutEffect

```ts
import { useEffect, useLayoutEffect } from 'react';
const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
```

## Params

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |

## Result

| 属性 | 说明 | 类型 |
| ---- | ---- | ---- |
