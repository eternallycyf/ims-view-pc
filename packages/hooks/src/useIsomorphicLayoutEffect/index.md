---
title: useIsomorphicLayoutEffect
order: 2
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useIsomorphicLayoutEffect/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useIsomorphicLayoutEffect/index.ts
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
