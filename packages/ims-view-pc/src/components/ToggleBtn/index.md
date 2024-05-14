---
title: ToggleBtn
description: ToggleBtn
toc: content
group:
  title: 布局
demo:
  cols: 2
---

## ToggleBtn 切换按钮

ToggleBtn 是一个 toggle 按钮，可以切换状态，可以自定义状态的样式。

### 何时使用

- 切换按钮
- 切换状态
- 展示 tooltip

## 示例

<code src='./demo/demo1.tsx'></code>

## API

### props

| 属性      | 说明       | 类型                                      | 默认值 |
| --------- | ---------- | ----------------------------------------- | ------ |
| status    | 当前状态   | `keyof T`                                 |        |
| setStatus | 设置的方法 | `React.Dispatch<SetStateAction<keyof T>>` |        |
| dict      | 设置的方法 | `IToggleDict`                             |        |
| cb        | 自定义回调 | `(status: keyof T) => void`               |        |

### dict

| 属性            | 说明                    | 类型                  | 默认值 |
| --------------- | ----------------------- | --------------------- | ------ |
| size            | 大小                    | `ButtonProps['size']` | small  |
| buttonType      | 大小                    | `ButtonProps['type']` |        |
| buttonStyle     | 按钮样式                | `CSSProperties`       |        |
| tooltipStyle    | 悬浮框样式              | `CSSProperties`       |        |
| toggleIconStyle | 图标样式                | `CSSProperties`       |        |
| label           | 文字                    | `React.ReactNode`     |        |
| tooltip         | 悬浮文字                | `React.ReactNode`     |        |
| toggleIcon      | 切换按钮                | `React.ReactNode`     |        |
| hasTooltip      | 是否有 tooltip 及小问号 | `boolean`             |        |
