---
title: useResize
order: 8
---

## useResize

```ts
import React, { useEffect } from 'react';

const map = new WeakMap();
const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    const handler = map.get(entry.target);
    if (handler) {
      handler(entry, { width, height });
    }
  }
});

interface IProps {
  node: React.RefObject<any>;
  cb: (entry: ResizeObserverEntry, size: { width: number; height: number }) => void;
}

const useResize = (props: IProps) => {
  const { node, cb } = props;
  useEffect(() => {
    ob.observe(node.current);
    map.set(node.current, cb);
    return () => {
      ob.unobserve(node.current);
    };
  }, []);
};

export default useResize;
```

## Params

| 属性 | 说明 | 类型                                                                            | 默认值 |
| ---- | ---- | ------------------------------------------------------------------------------- | ------ |
| node | 节点 | `React.RefObject<any>`                                                          | -      |
| cb   | 回调 | `(entry: ResizeObserverEntry, size: { width: number; height: number }) => void` | -      |

## Result

| 属性 | 说明 | 类型 |
| ---- | ---- | ---- |
