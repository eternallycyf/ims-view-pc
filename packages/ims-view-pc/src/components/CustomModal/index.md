---
title: CustomModal
description: 弹窗
toc: content
group:
  title: 弹窗
  order: 6
demo:
  cols: 2
---

## CustomModal

`CustomModal` 是一个 Modal 的封装，提供了默认的样式及 抛出异常不关闭弹窗的方法注入到 `onClick` 事件中

### 何时使用

- 需要弹出一个对话框，询问用户或进行消息提示时。
- 当需要一个简洁的确认框询问用户时。
- 当需要一个简单的确认框询问用户时。

### 如何使用

在需要 Modal 的地方，引入 `CustomModal` 组件

## 示例

<code src="./demo/demo1.tsx">一个普通的弹窗</code>

<code src="./demo/demo2.tsx">知道了</code>

<code src="./demo/demo3.tsx" description="只有type='confirm'才可以">带 loading 的确定</code>

## API

### props

| 参数       | 说明           | 类型                                               | 默认值    |
| ---------- | -------------- | -------------------------------------------------- | --------- |
| onOk       | 点击确定的回调 | `(status: boolean, destoryFn: () => void) => void` | -         |
| type       | 弹窗类型       | `ModalFuncProps['type']`                           | `confirm` |
| title      | 弹窗标题       | `React.ReactNode`                                  | -         |
| content    | 弹窗内容       | `React.ReactNode`                                  | -         |
| modalProps | 弹窗属性       | `ModalFuncProps`                                   | -         |
| footerBtns | 底部按钮       | `footerBtns[]`                                     | -         |

### footerBtns

| 参数     | 说明           | 类型                                               | 默认值 |
| -------- | -------------- | -------------------------------------------------- | ------ |
| code     | 按钮类型       | `boolean`                                          | -      |
| btnChild | 按钮内容       | `React.ReactNode`                                  | -      |
| btnProps | 按钮属性       | `ButtonProps`                                      | -      |
| onClick  | 点击按钮的回调 | `(status: boolean, destoryFn: () => void) => void` | -      |
