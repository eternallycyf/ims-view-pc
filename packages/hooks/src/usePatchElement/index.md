---
title: usePatchElement
order: 2
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/usePatchElement/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/usePatchElement/index.ts
---

## usePatchElement

```ts
import * as React from 'react';

export default function usePatchElement(): [
  React.ReactElement[],
  (element: React.ReactElement) => () => void,
] {
  const [elements, setElements] = React.useState<React.ReactElement[]>([]);

  const patchElement = React.useCallback((element: React.ReactElement) => {
    // append a new element to elements (and create a new ref)
    setElements((originElements) => [...originElements, element]);

    // return a function that removes the new element out of elements (and create a new ref)
    // it works a little like useEffect
    return () => {
      setElements((originElements) => originElements.filter((ele) => ele !== element));
    };
  }, []);

  return [elements, patchElement];
}
```

## Params

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |

## Result

| 属性           | 说明           | 类型                                          |
| -------------- | -------------- | --------------------------------------------- |
| `elements`     | 元素           | `React.ReactElement[]`                        |
| `patchElement` | 添加元素的方法 | `(element: React.ReactElement) => () => void` |
