---
title: useDebounce
order: 2
---

## useDebounce

```ts
import { useEffect, useState } from 'react';
function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
export default useDebounce;
```

## Params

| 属性  | 说明         | 类型     | 默认值 |
| ----- | ------------ | -------- | ------ |
| value | 需要防抖的值 | `any`    | -      |
| delay | 防抖时间     | `number` | 300    |

## Result

| 属性           | 说明       | 类型  |
| -------------- | ---------- | ----- |
| debouncedValue | 防抖后的值 | `any` |
