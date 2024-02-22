---
title: Sticky
description: Sticky
toc: content
group:
  title: 其他
  order: 10
order: 3
demo:
  cols: 2
---

# Sticky 粘性布局

## 介绍

Sticky 组件与 CSS 中`position: sticky`属性实现的效果一致，当组件在屏幕范围内时，会按照正常的布局排列，当组件滚出屏幕范围时，始终会固定在屏幕顶部。

## 引入

```js
import { Sticky } from 'ims-view-pc';
```

## 代码演示

### 基础用法

将内容包裹在 `Sticky` 组件内即可。

<code src='./demo/index.tsx'></code>

### 吸顶距离

通过 `offsetTop` 属性可以设置组件在吸顶时与顶部的距离。

### 指定容器

通过 `container` 属性可以指定组件的容器，页面滚动时，组件会始终保持在容器范围内，当组件即将超出容器底部时，会固定在容器的底部。

### 吸底距离

将 `position` 设置为 `bottom` 可以让组件吸附在底部。通过 `offsetBottom` 属性可以设置组件在吸底时与底部的距离。

## API

### Props

| 参数         | 说明                                                          | 类型               | 默认值 |
| ------------ | ------------------------------------------------------------- | ------------------ | ------ |
| position     | 吸附位置，可选值为 `bottom`                                   | _string_           | `top`  |
| offsetTop    | 吸顶时与顶部的距离，支持 `px` `vw` `vh` `rem` 单位，默认 `px` | _number \| string_ | `0`    |
| offsetBottom | 吸底时与底部的距离，支持 `px` `vw` `vh` `rem` 单位，默认 `px` | _number \| string_ | `0`    |
| zIndex       | 吸顶时的 z-index                                              | _number \| string_ | `99`   |
| container    | 容器对应的 HTML 节点                                          | _RefElement_       | -      |

### Events

| 事件名   | 说明                 | 回调参数                                  |
| -------- | -------------------- | ----------------------------------------- |
| onScroll | 滚动时触发           | _{ scrollTop: number, isFixed: boolean }_ |
| onChange | 当吸顶状态改变时触发 | _isFixed: boolean_                        |

### 类型定义

组件导出以下类型定义：

```ts
import type { StickyPosition } from 'ims-view-pc';
```
