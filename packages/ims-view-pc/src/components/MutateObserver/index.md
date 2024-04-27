---
title: MutateObserver
description: MutateObserver
toc: content
group:
  title: 其他
---

# MutateObserver

## 介绍

`MutateObserver` 组件可以将内容渲染到指定的节点上，通常用于弹出层、全局提示等场景。

## 引入

```js
import { MutateObserver } from 'ims-view-pc';
```

## 代码演示

<code src='./demo/index.tsx'></code>

## API

### Props

| 参数     | 说明                        | 类型                          | 默认值 |
| -------- | --------------------------- | ----------------------------- | ------ |
| options  | MutationObserver 的配置项   | MutationObserverInit          | -      |
| onMutate | MutationObserver 的回调函数 | (mutations, observer) => void | -      |
| children | 需要观察的节点              | React.ReactElement            | -      |

### 类型定义

组件导出以下类型定义：

```ts
import type { MutateObserverProps } from 'ims-view-pc';
```
