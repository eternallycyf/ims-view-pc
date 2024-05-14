---
title: TreeModal
description:
toc: content
group:
  title: 表单
order: 2
demo:
  cols: 2
---

## TreeModal

## 示例

<code src='./demo/index.tsx'></code>

## API

### TreeModalData

| 参数      | 说明      | 类型              | 默认值 |
| --------- | --------- | ----------------- | ------ |
| id        | 节点 id   | string            | -      |
| name      | 节点名称  | string            | -      |
| dealMode  | 交易模式  | number            | -      |
| memo      | 备注      | string            | -      |
| channel   | 渠道      | string            | -      |
| code      | 编码      | string            | -      |
| key       | 节点 key  | React.Key         | -      |
| pid       | 父节点 id | string            | -      |
| priceType | 价格类型  | string            | -      |
| disable   | 是否禁用  | boolean           | -      |
| children  | 子节点    | `TreeModalData[]` | -      |

### TreeModalFieldNames

| 参数     | 说明            | 类型   | 默认值 |
| -------- | --------------- | ------ | ------ |
| value    | value 字段名    | string | -      |
| label    | label 字段名    | string | -      |
| children | children 字段名 | string | -      |

### TreeModalRawValueType

```ts
export type TreeModalRawValueType = string | number;
```

### TreeModalModalOnConfirm

```ts
type TreeModalModalOnConfirm = (value: string[]) => void;
```

### TreeModalLabeledValueType

| 参数        | 说明        | 类型                  | 默认值 |
| ----------- | ----------- | --------------------- | ------ |
| key         | key         | React.Key             | -      |
| value       | value       | TreeModalRawValueType | -      |
| label       | label       | React.ReactNode       | -      |
| halfChecked | halfChecked | boolean               | -      |

### TreeModalDraftValueType

```ts
export type TreeModalDraftValueType =
  | TreeModalRawValueType
  | TreeModalLabeledValueType
  | (TreeModalRawValueType | TreeModalLabeledValueType)[];
```

### TreeModalProps

| 参数             | 说明                         | 类型                                 | 默认值 |
| ---------------- | ---------------------------- | ------------------------------------ | ------ |
| title            | 标题                         | `[React.ReactNode, React.ReactNode]` | -      |
| placeholder      | 占位符                       | `[string, string]`                   | -      |
| type             | 类型                         | `'check' \| 'view'\` \| `'check'`    |
| children         | 子节点                       | `React.ReactNode`                    | -      |
| value            | 值                           | `string[]`                           | -      |
| options          | 数据                         | `TreeModalData[]`                    | -      |
| defaultCheckKeys | 默认选中的 key \| `string[]` | -                                    |
| disabledKeys     | 禁用的 key                   | `string[]`                           | -      |
| onChange         | 值改变回调                   | `TreeModalModalOnConfirm`            | -      |
| modalProps       | modal 属性                   | `ModalProps`                         | -      |
| onOk             | 确认回调                     | `TreeModalModalOnConfirm`            | -      |
| onCancel         | 取消回调                     | `TreeModalModalOnConfirm`            | -      |
| preChildren      | 子节点前                     | `React.ReactNode`                    | -      |

### TreeModalHandle

| 参数            | 说明           | 类型                                             | 默认值 |
| --------------- | -------------- | ------------------------------------------------ | ------ |
| handleOpenModal | 打开 modal     | `() => void`                                     | -      |
| setCheckedKeys  | 设置选中的 key | `React.Dispatch<React.SetStateAction<string[]>>` | -      |

### TreeModalContext

| 参数            | 说明           | 类型                                             | 默认值 |
| --------------- | -------------- | ------------------------------------------------ | ------ |
| handleOpenModal | 打开 modal     | `() => void`                                     | -      |
| checkedKeys     | 选中的 key     | `string[]`                                       | -      |
| rightOptions    | 右侧数据       | `TreeModalProps['options']`                      | -      |
| setCheckedKeys  | 设置选中的 key | `React.Dispatch<React.SetStateAction<string[]>>` | -      |

### TreeModalType

```ts
export type TreeModalType = 'left' | 'right';
```

### TreeModalItemProps

| 参数            | 说明           | 类型                                                       | 默认值 |
| --------------- | -------------- | ---------------------------------------------------------- | ------ |
| placeholder     | 占位符         | `string`                                                   | -      |
| type            | 类型           | `TreeModalType`                                            | -      |
| title           | 标题           | `React.ReactNode`                                          | -      |
| isView          | 是否只读       | `boolean`                                                  | -      |
| options         | 数据           | `TreeModalProps['options']`                                | -      |
| onExpand        | 展开回调       | `(type: TreeModalType, expandedKeys: React.Key[]) => void` | -      |
| setExpandedKeys | 设置展开的 key | `React.Dispatch<React.SetStateAction<string[]>>`           | -      |
| onClear         | 清空回调       | `Function`                                                 | -      |
