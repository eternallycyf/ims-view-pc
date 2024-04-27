---
title: Portal
description: Portal
toc: content
group:
  title: 其他
---

# Portal

## 介绍

`Portal` 组件可以将内容渲染到指定的节点上，通常用于弹出层、全局提示等场景。

## 引入

```js
import { Portal } from 'ims-view-pc';
```

## 代码演示

<code src='./demo/index.tsx'></code>

## API

### Props

| 参数     | 说明                           | 类型                    | 默认值 |
| -------- | ------------------------------ | ----------------------- | ------ |
| attach   | 挂载的节点，可以是节点或选择器 | _HTMLElement \| string_ | -      |
| children | 需要挂载的内容                 | _ReactNode_             | -      |

### 类型定义

组件导出以下类型定义：

```ts
import type { PortalProps } from 'ims-view-pc';
```
