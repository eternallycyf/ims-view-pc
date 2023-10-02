---
title: 使用方式
order: 0
nav:
  title: hooks
---

## 使用方式

### install

```shell
pnpm i @ims-view/hooks
```

### start

```tsx
import * as hooks from '@ims-view/hooks';
import React from 'react';

const Demo = () => {
  let [number, setNumber] = hooks.useSyncState<number>(5);

  return (
    <div>
      <div>{number}</div>
      <button onClick={() => setNumber(number + 1)}>+</button>
      <button onClick={() => setNumber(number - 1)}>-</button>
    </div>
  );
};
export default Demo;
```
