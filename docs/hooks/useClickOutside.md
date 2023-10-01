---
title: useClickOutside
order: 1
---

## useClickOutside

```ts
import { RefObject, useEffect } from 'react';
function useClickOutside(ref: RefObject<HTMLElement>, handler: (event: MouseEvent) => any) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('click', listener);
    return () => {
      document.removeEventListener('click', listener);
    };
  }, [ref, handler]);
}
export default useClickOutside;
```

## Params

| 属性    | 说明           | 类型                         | 默认值 |
| ------- | -------------- | ---------------------------- | ------ |
| ref     | 需要监听的元素 | `RefObject<HTMLElement>`     | -      |
| handler | 点击外部的回调 | `(event: MouseEvent) => any` | -      |
