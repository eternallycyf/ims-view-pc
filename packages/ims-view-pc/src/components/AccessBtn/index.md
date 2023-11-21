---
title: AccessBtn
description: 权限按钮
toc: content
group:
  title: 权限按钮
  order: 0
demo:
  cols: 2
---

## AccessBtn 访问按钮

`AccessBtn` 是一个用于控制访问权限的按钮组件。

### 何时使用

- 用于根据用户角色或权限配置显示或隐藏特定功能按钮。
- 提供灵活的配置选项，以便根据不同的权限状态定制按钮的展示和行为。

### 如何使用

在需要使用访问按钮的地方引入 `AccessBtn` 组件，并传入相应的权限配置。例如：

## demo

<code src='./demo/type.tsx' description="default | custom | delete | group">按钮的基本类型</code>

<code src='./demo/access.tsx' description="通过 accessCollection(string[]) 属性 传入对应的 code">权限控制</code>

## API

### IAccessBtnProps

| 参数             | 说明       | 类型             | 默认值 |
| ---------------- | ---------- | ---------------- | ------ |
| className        | 按钮的类名 | string           | -      |
| accessCollection | 权限集合   | string[]         | -      |
| children         | 按钮的内容 | React.ReactNode  | -      |
| btnList          | 按钮的集合 | `IButtonProps[]` | -      |

### IButtonProps

| 参数       | 说明             | 类型                                   | 默认值                                          |
| ---------- | ---------------- | -------------------------------------- | ----------------------------------------------- |
| element    | 按钮的内容       | `ReactNode`                            | -                                               |
| type       | 按钮的类型       | `default \| custom \| delete \| group` | -                                               |
| buttonType | antd.button.type | `ButtonProps['type']`                  | -                                               |
| code       | 按钮的权限       | `string`                               | -                                               |
| visible    | 按钮的显示       | `boolean`                              | `((groupValue?: IGroupButtonValue) => boolean)` |
| itemProps  | 按钮的属性       | `IButtonItemProps`                     | -                                               |

### IButtonItemProps

```ts
export interface IButtonItemProps extends IButtonDeleteProps, IButtonGroupProps {
  buttonGroupProps?: ButtonGroupProps;
  buttonProps?: ButtonProps;
  popConfirmProps?: PopconfirmProps;
}
```

### IButtonGroupProps

```ts
type IGroupButtonValue = string | number | readonly string[];
type groupDict =
  | { value: IGroupButtonValue; label: string }[]
  | readonly { value: IGroupButtonValue; label: string }[];
```

| 参数                     | 说明             | 类型                                | 默认值 |
| ------------------------ | ---------------- | ----------------------------------- | ------ |
| groupValue               | 按钮组的值       | `IGroupButtonValue`                 | -      |
| handleGroupValueOnChange | 按钮组的值的回调 | `(value: IGroupButtonValue) => any` | -      |
| groupDict                | 按钮组的字典     | `IButtonGroupDefaultProps['dict']`  | -      |

### IButtonDeleteProps

| 参数                | 说明           | 类型                           | 默认值 |
| ------------------- | -------------- | ------------------------------ | ------ |
| deleteText          | 删除按钮的文案 | `string`                       | -      |
| handleDeleteConfirm | 删除按钮的回调 | `PopconfirmProps['onConfirm']` | -      |

## FAQ
