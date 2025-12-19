---
title: CustomTag
description: CustomTag
toc: content
group:
  title: 信息展示
  order: 7
---

# CustomTag

## 介绍

`CustomTag` 组件根据文字长度 自动生成标签颜色

## 引入

```js
import { CustomTag } from 'ims-view-pc';
```

## 代码演示

<code src='./demo/index.tsx'></code>

## API

### Props

| 参数           | 说明     | 类型          | 默认值 |
| -------------- | -------- | ------------- | ------ |
| label          | 标签内容 | string        | -      |
| tooltip        | 标签提示 | ReactNode     | -      |
| labelClassName | 标签样式 | string        | -      |
| labelStyle     | 标签样式 | CSSProperties | -      |

### 类型定义

组件导出以下类型定义：

```ts
import type { CustomTagProps } from 'ims-view-pc';
```
