---
title: TableExtraBtn
description: Table操作按钮
toc: content
group:
  title: 权限按钮
  order: 0
demo:
  cols: 2
---

## TableExtraBtn 表格操作按钮

`TableExtraBtn` 是一个用于执行表格操作的按钮组件。

### 何时使用

- 用于在表格中提供各种操作按钮，如编辑、删除、查看详情等。

### 如何使用

在需要使用表格操作按钮的地方引入 `TableExtraBtn` 组件，并传入相应的操作配置。例如：

## 示例

<code src='./demo/type.tsx' description="default | custom | delete | group">按钮的基本类型</code>

## API

### TableExtraBtnProps

| 参数             | 说明         | 类型                        | 默认值 |
| ---------------- | ------------ | --------------------------- | ------ |
| maxShowMoreCount | 最大显示数   | `number`                    | `3`    |
| emptyText        | 空内容       | `ReactNode`                 | `-`    |
| record           | 当前行数据   | `T`                         | `-`    |
| btnList          | 按钮列表     | `ButtonDataType`            | `[]`   |
| clickCallBack    | 点击回调     | `(params, context) => void` | `-`    |
| spaceProps       | Space 属性   | `SpaceProps`                | `-`    |
| popoverProps     | Popover 属性 | `PopoverProps`              | `-`    |
| divider          | 分割线       | `ReactNode \| false`        | `-`    |

### ButtonDataType

| 参数            | 说明           | 类型                                                                               | 默认值 |
| --------------- | -------------- | ---------------------------------------------------------------------------------- | ------ |
| type            | 按钮的类型     | `IButtonProps['type']`                                                             | -      |
| buttonProps     | 按钮的属性     | `IButtonItemProps['buttonProps']`                                                  | -      |
| typographyProps | 文字按钮的属性 | `TypographyProps['Link']`                                                          | -      |
| popconfirmProps | 删除按钮的属性 | `IButtonItemProps['popConfirmProps']`                                              | -      |
| element         | 按钮的内容     | `IButtonProps['element'] \| ((record: T, context: BaseButtonRecord) => ReactNode)` | -      |
| onClick         | 按钮的回调     | `(params: T, context: BaseButtonRecord) => void`                                   | -      |
| visible         | 按钮的显示     | `IButtonProps['visible'] \| ((record: T) => boolean) \| boolean`                   | -      |
