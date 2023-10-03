---
title: useVirtualList
order: 12
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/docs/hooks/useVirtualList.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useVirtualList.ts
---

## useVirtualList

```tsx | pure
// 虚拟列表
import { RefObject, useEffect, useState } from 'react';
interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}
/**
 *
 * @param {ReactRef} elementRef 传入虚拟列表父盒子的 ref
 * @param {object}
 * threshold         阀值 0-1 1表示完全出现在屏幕可视区域才触发
 * root              表示指定根元素 默认为浏览器视口  用于检查目标可见性
 * rootMargin        root的外边距 '0 0 0 0'
 * freezeOnceVisible 是否缓存 再次滑动不重新渲染
 * @returns {Object} entry 这个对象具有当前可视区的信息
 * 例如 entry.isIntersecting 是否在可视区范围
 */
function useVirtualList(
  elementRef: RefObject<Element>,
  { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false }: Args,
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const frozen = entry?.isIntersecting && freezeOnceVisible;
  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };
  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;
    if (!hasIOSupport || frozen || !node) return;
    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);
    observer.observe(node);
    return () => observer.disconnect();
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen]);

  return entry;
}

export default useVirtualList;
```

## Params

| 属性                      | 说明                         | 类型                        | 默认值 |
| ------------------------- | ---------------------------- | --------------------------- | ------ |
| elementRef                | 传入虚拟列表父盒子的 ref     | `RefObject<Element>`        | -      |
| IntersectionObserverEntry | 这个对象具有当前可视区的信息 | `IntersectionObserverEntry` | -      |

## IntersectionObserverEntry

| 属性              | 说明                                               | 类型       |
| ----------------- | -------------------------------------------------- | ---------- |
| threshold         | 阀值 0-1 1 表示完全出现在屏幕可视区域才触发        | `number`   |
| root              | 表示指定根元素 默认为浏览器视口 用于检查目标可见性 | `document` |
| rootMargin        | root 的外边距 '0 0 0 0'                            | `string`   |
| freezeOnceVisible | 是否缓存 再次滑动不重新渲染                        | `boolean`  |

## Result

- `entry.isIntersecting` 是否在可视区范围

| 属性  | 说明                         | 类型                        |
| ----- | ---------------------------- | --------------------------- |
| entry | 这个对象具有当前可视区的信息 | `IntersectionObserverEntry` |

## 参考地址

- https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
