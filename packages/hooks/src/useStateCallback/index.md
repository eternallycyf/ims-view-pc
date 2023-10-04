---
title: useStateCallback
order: 2
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/docs/hooks/useStateCallback/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useStateCallback/index.ts
---

## useStateCallback

```ts
import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

const useStateCallback = <T = any>(defaultVal: T) => {
  const [state, setState] = useState(defaultVal);
  const listenRef = useRef<(state: SetStateAction<T>) => any>(); // 监听新状态的回调器
  const _setState = useCallback(
    (newVal: SetStateAction<T>, callback: (state: SetStateAction<T>) => any) => {
      // 更新业务
      listenRef.current = callback;
      setState(newVal);
    },
    [],
  );
  useEffect(() => {
    listenRef.current && listenRef.current(state); // 回调新状态
  }, [state]);

  return [state, _setState];
};

export default useStateCallback;
```

## Params

| 属性       | 说明   | 类型 | 默认值 |
| ---------- | ------ | ---- | ------ |
| defaultVal | 默认值 | `T`  | -      |

## Result

| 属性     | 说明       | 类型                                                                               |
| -------- | ---------- | ---------------------------------------------------------------------------------- |
| state    | 状态值     | `T`                                                                                |
| setState | 设置状态值 | `(newVal: SetStateAction<T>, callback: (state: SetStateAction<T>) => any) => void` |
