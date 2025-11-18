---
title: useFullscreen
order: 2
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useFullscreen/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useFullscreen/index.ts
---

## useFullscreen

```tsx | pure
import * as React from 'react';

const { FullscreenButton, isFullscreen } = useFullscreen({
  onEnter: () => {
    xxx;
  },
  onExit: () => {
    xxx;
  },
  className: 'text-colorTextSecondary hover:text-link',
});

<FullscreenButton />;

'fixed inset-0 z-50 h-full w-full border-none': isFullscreen,
```

## Params

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |

## Result

| 属性          | 说明 | 类型         |
| ------------- | ---- | ------------ |
| useFullscreen | 全屏 | `() => void` |
