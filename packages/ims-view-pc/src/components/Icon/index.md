---
title: Icon
description: 图标
order: 0
toc: content
demo:
  cols: 2
---

## Icon 图标

在 `Icon` 的基础上，我们封装了一些项目中常用的图标，提供 `typescript` 提示 以便在开发中更加方便的使用。

### 何时使用

- 当需要在界面上展示一系列的图标时 (例如：按钮、菜单、导航等)。

### 如何使用

- 通过 `import { Icon } from 'ims-view-pc'` 的方式引入组件，然后可以直接使用 `Icon`

## 示例

<code src='./demo.tsx'></code>

## 图标列表

```tsx
/**
 * compact: true
 */
import React from 'react';
export default () => (
  <>
    <iframe
      style={{ width: '100%', height: '100vh' }}
      src="https://www.ims-view.site/iconfont/index.html"
    />
  </>
);
```

## API

### props

| 参数                     | 说明           | 类型                | 默认值 |
| ------------------------ | -------------- | ------------------- | ------ |
| type                     | 图标类型       | string              | -      |
| spin                     | 是否有旋转动画 | boolean             | false  |
| rotate                   | 旋转角度       | number              | -      |
| style                    | 样式           | React.CSSProperties | -      |
| className                | 类名           | string              | -      |
| 剩余属性请参考 span 元素 | ...            | ...                 | -      |
