---
title: Clipboard
description: Clipboard
toc: content
group:
  title: 工具
  order: 6
---

# Clipboard

## 介绍

`Clipboard` 组件可以 copy 指定内容到剪贴板。

## 引入

```js
import { Clipboard } from 'ims-view-pc';
```

## 代码演示

<code src='./demo/index.tsx'></code>

## API

### Props

| 参数     | 说明                 | 类型                                    | 默认值 |
| -------- | -------------------- | --------------------------------------- | ------ |
| text     | 需要复制的文本       | string                                  | -      |
| onCopy   | 复制成功后的回调函数 | (text: string, result: boolean) => void | -      |
| children | 触发复制操作的节点   | React.ReactElement                      | -      |
| options  | 配置项               | object                                  | -      |

options 支持的配置项如下：

| 参数    | 说明             | 类型    | 默认值 |
| ------- | ---------------- | ------- | ------ |
| debug   | 是否开启调试模式 | boolean | false  |
| message | 复制成功提示文案 | string  | -      |
| format  | 复制的格式       | string  | -      |

### 类型定义

组件导出以下类型定义：

```ts
import type { ClipboardProps } from 'ims-view-pc';
```
