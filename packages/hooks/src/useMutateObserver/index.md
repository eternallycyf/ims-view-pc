---
title: useMutateObserver
order: 2
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useMutateObserver/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useMutateObserver/index.ts
---

## useMutateObserver

```ts
import { useEffect } from "react";

const defaultOptions: MutationObserverInit = {
  subtree: true,
  childList: true,
  attributeFilter: ['style', 'class'],
};

export default function useMutateObserver(
  nodeOrList: HTMLElement | HTMLElement[],
  callback: MutationCallback,
  options: MutationObserverInit = defaultOptions,
) {
  useEffect(() => {
    if (!nodeOrList) {
      return;
    }

    let instance: MutationObserver;

    const nodeList = Array.isArray(nodeOrList) ? nodeOrList : [nodeOrList];

    if ('MutationObserver' in window) {
      instance = new MutationObserver(callback);

      nodeList.forEach(element => {
        instance.observe(element, options);
      });
    }
    return () => {
      instance?.takeRecords();
      instance?.disconnect();
    };
  }, [options, nodeOrList]);
}

```

## Params

| 属性 | 说明 | 类型       | 默认值 |
| ---- | ---- | ---------- | ------ |
| nodeOrList | 节点或节点列表 | `HTMLElement | HTMLElement[]` | -      |
| callback | 回调函数 | `MutationCallback` | -      |
| options | MutationObserverInit | `MutationObserverInit` | `defaultOptions` |

## Result

| 属性       | 说明       | 类型       |
| ---------- | ---------- | ---------- |
| -          | -          | -          |
