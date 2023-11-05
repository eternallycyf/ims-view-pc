---
title: CommonEditTable
description: 单行多行动态编辑表格
toc: content
group:
  title: 表格
  order: 2
demo:
  cols: 2
---

## CommonEditTable

<code src='./demo/demo1/index.tsx'>多行编辑</code>

<code src='./demo/demo2/index.tsx'>单行编辑</code>

## API

### IEditTableContext

| 名称      | 类型                        | 默认值 | 描述            |
| --------- | --------------------------- | ------ | --------------- |
| form      | `FormInstance`              | -      | form 实例       |
| operation | `FormListOperation<Values>` | -      | formList 的操作 |
| values    | `Values[]`                  | []     | formList 的值   |

### ICommonEditTableProps

| 名称              | 类型                                                                                          | 默认值 | 描述                                                      |
| ----------------- | --------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------- |
| form              | `FormInstance`                                                                                | -      | form 实例                                                 |
| status            | `'view' \| 'edit'`                                                                            | -      | 编辑状态                                                  |
| showIndex         | `boolean`                                                                                     | -      | 是否显示序号                                              |
| isVirtual         | `boolean`                                                                                     | -      | 是否是虚拟列表虚拟列表 必须传入 scroll.y 高度             |
| isMultiple        | `boolean`                                                                                     | -      | 是否是实时保存类型 为 false 时 editable = true 才会可编辑 |
| editableKeys      | `string[]`                                                                                    | -      | 可编辑的 key                                              |
| itemButtonWidth   | `number`                                                                                      | -      | 每一行的操作按钮的宽度 默认自适应                         |
| curryParams       | `any`                                                                                         | -      | 柯里化函数入参                                            |
| beforeChildren    | `React.ReactNode \| ((value: IEditTableContext<Values, FormItemsValues>) => React.ReactNode)` | -      | 表格前面的内容                                            |
| afterChildren     | `React.ReactNode \| ((value: IEditTableContext<Values, FormItemsValues>) => React.ReactNode)` | -      | 表格后面的内容                                            |
| tableProps        | `TableProps`                                                                                  | -      | table 的 props                                            |
| columns           | `ReturnType<IGetColumns<Values, Rest>>`                                                       | -      | table 的 columns                                          |
| itemButton        | `IEditButtonProps<Values, true>[]`                                                            | -      | 每一行的操作按钮                                          |
| buttonLeft        | `IEditButtonProps<Values>[]`                                                                  | -      | 表格左边的按钮                                            |
| buttonRight       | `IEditButtonProps<Values>[]`                                                                  | -      | 表格右边的按钮                                            |
| buttonBottomLeft  | `IEditButtonProps<Values>[]`                                                                  | -      | 表格底部左边的按钮                                        |
| buttonBottomRight | `IEditButtonProps<Values>[]`                                                                  | -      | 表格底部右边的按钮                                        |
| name              | `FormListProps['name']`                                                                       | -      | formList 的 name                                          |
| formListProps     | `React.ComponentProps<typeof Form.List>`                                                      | -      | formList 的 props                                         |
| initialValues     | `Values[]`                                                                                    | -      | formList 的 initialValues                                 |
| rules             | `React.ComponentProps<typeof Form.List>['rules']`                                             | -      | formList 的 rules                                         |

### ICommonEditTableHandle

| 名称         | 类型                              | 默认值 | 描述      |
| ------------ | --------------------------------- | ------ | --------- |
| form         | `FormInstance<FormItemsValues>`   | -      | form 实例 |
| handleExport | `IHandleExport<Values>`           | -      | -         |
| status       | `ICommonEditTableProps['status']` | -      | -         |

### IColumnEditRestProps

| 名称  | 类型                             | 默认值 | 描述 |
| ----- | -------------------------------- | ------ | ---- |
| type  | `FormControlType`                | -      | -    |
| label | `ISearchesType[number]['label']` | -      | -    |
| name  | `Values`                         | -      | -    |

### ICommonEditTableColumnsType

| 名称            | 类型                                                                                                                                                               | 默认值 | 描述             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ---------------- |
| hasRequiredMark | `boolean`                                                                                                                                                          | -      | 是否有必填标记   |
| formItemProps   | `Omit<Search<Values>, 'name' \| 'label' \| 'type' \| 'controlProps'> & { rules?: FormItemProps<Values>['rules']; controlProps?: Partial<Search['controlProps']>;}` | -      | -                |
| render          | `(value: any, record: Values, index: number, allValues: Values[]) => React.ReactNode`                                                                              | -      | -                |
| shouldUpdate    | `FormItemProps<Values>['shouldUpdate']`                                                                                                                            | -      | -                |
| transform       | `(text: any, record: Values, index: number, allValues: Values[]) => React.ReactNode`                                                                               | -      | 自定义转换的方法 |
| type            | `FormControlType`                                                                                                                                                  | -      | -                |
| label           | `ISearchesType[number]['label']`                                                                                                                                   | -      | -                |
| name            | `Values`                                                                                                                                                           | -      | -                |

### FormListOperation

| 名称   | 类型                                                    | 默认值 | 描述 |
| ------ | ------------------------------------------------------- | ------ | ---- |
| add    | `(defaultValue?: Values, insertIndex?: number) => void` | -      | -    |
| remove | `(index: number \| number[]) => void`                   | -      | -    |
| move   | `(from: number, to: number) => void`                    | -      | -    |

### IRenderFnProps

| 名称   | 类型       | 默认值 | 描述 |
| ------ | ---------- | ------ | ---- |
| record | `Values`   | -      | -    |
| arr    | `Values[]` | -      | -    |
| index  | `number`   | -      | -    |

### IEditButtonFunction

| 名称        | 类型                                                          | 默认值 | 描述 |
| ----------- | ------------------------------------------------------------- | ------ | ---- |
| renderProps | `IsItemBtn extends true ? IRenderFnProps<Values> : undefined` | -      | -    |
| operation   | `FormListOperation<Values>`                                   | -      | -    |
| status      | `ICommonEditTableProps['status']`                             | -      | -    |
| value       | `any`                                                         | -      | -    |

### IHandleGroupValueOnChange

| 名称        | 类型                                                          | 默认值 | 描述 |
| ----------- | ------------------------------------------------------------- | ------ | ---- |
| renderProps | `IsItemBtn extends true ? IRenderFnProps<Values> : undefined` | -      | -    |
| operation   | `FormListOperation<Values>`                                   | -      | -    |
| status      | `ICommonEditTableProps['status']`                             | -      | -    |
| value       | `Parameters<IButtonItemProps['handleGroupValueOnChange']>`    | -      | -    |

### IEditButtonItemProps

| 名称                     | 类型                                                                                                       | 默认值 | 描述 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- | ------ | ---- |
| buttonProps              | `Omit<IButtonItemProps['buttonProps'], 'onClick'> & { onClick?: IEditButtonFunction<Values, IsItemBtn>; }` | -      | -    |
| handleDeleteConfirm      | `IEditButtonFunction<Values, IsItemBtn>`                                                                   | -      | -    |
| handleGroupValueOnChange | `IHandleGroupValueOnChange<Values, IsItemBtn>`                                                             | -      | -    |

### IBaseEditButtonProps

| 名称      | 类型                                                                                                                                                                                | 默认值 | 描述 |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---- |
| visible   | `boolean \| ((renderProps: IsItemBtn extends true ? IRenderFnProps<Values> : undefined, operation: FormListOperation<Values>, status: ICommonEditTableProps['status']) => boolean)` | -      | -    |
| itemProps | `IEditButtonItemProps<Values, IsItemBtn>`                                                                                                                                           | -      | -    |

### IEditButtonProps

| 名称                 | 类型                                      | 默认值 | 描述 |
| -------------------- | ----------------------------------------- | ------ | ---- |
| IBaseEditButtonProps | `IBaseEditButtonProps<Values, IsItemBtn>` | -      | -    |
| renderProps          | `IRenderFnProps<Values>`                  | -      | -    |
| operation            | `FormListOperation<Values>`               | -      | -    |
| status               | `ICommonEditTableProps['status']`         | -      | -    |

### IGetColumns

| 名称      | 类型                              | 默认值 | 描述 |
| --------- | --------------------------------- | ------ | ---- |
| operation | `FormListOperation<Values>`       | -      | -    |
| status    | `ICommonEditTableProps['status']` |