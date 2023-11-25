---
title: CommonDescriptions
description: 描述列表
toc: content
group:
  title: 布局
  order: 4
demo:
  cols: 2
---

## CommonDescriptions 描述列表

CommonDescriptions 是一个用于展示描述列表的组件，适用于展示多个项目的标题和相应的描述内容。

### 何时使用

- 显示一系列项目的标题和描述。
- 提供一致的描述列表样式，以保持整体设计风格。
- 允许灵活配置描述列表内容和样式。

### 如何使用

在需要显示描述列表的地方引入 `CommonDescriptions` 组件，并传入相应的内容和配置项。例如：

## 示例

<code src='./demo/demo1.tsx'></code>

## API

### props

| 参数             | 说明             | 类型                        | 默认值 |
| ---------------- | ---------------- | --------------------------- | ------ |
| title            | 标题             | React.ReactNode             | -      |
| extra            | 额外内容         | React.ReactNode             | -      |
| tooltip          | 额外内容         | React.ReactNode             | -      |
| columns          | 列表项           | `IDescriptionsColumns<T>[]` | -      |
| className        | 样式类名         | string                      | -      |
| beforeChildren   | 描述列表前内容   | React.ReactNode             | -      |
| afterChildren    | 描述列表后内容   | React.ReactNode             | -      |
| dataSource       | 自定义数据源     | T                           | -      |
| loading          | 自定义加载状态   | boolean                     | -      |
| labelClassName   | label 样式类名   | string                      | -      |
| wrapperClassName | wrapper 样式类名 | string                      | -      |
| rowProps         | Row 组件属性     | RowProps                    | -      |
| visible          | 是否显示         | boolean                     | -      |

### columns

| 参数             | 说明                                  | 类型                                                                            | 默认值 |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------- | ------ |
| key              | 列表项的键                            | `keyof T & string`                                                              | -      |
| label            | 列表项的标签                          | string                                                                          | -      |
| type             | 列表项的类型                          | `'text' \| 'formItem'`                                                          | -      |
| span             | 列表项的跨越列数                      | number                                                                          | -      |
| className        | 列表项的自定义样式类名                | string                                                                          | -      |
| labelClassName   | Label 的自定义样式类名                | string                                                                          | -      |
| wrapperClassName | Wrapper 的自定义样式类名              | string                                                                          | -      |
| acpCode          | acpCode 属性                          | string                                                                          | -      |
| visible          | 是否可见                              | `boolean \| ((value: any, record: T) => boolean)`                               | -      |
| isPhone          | 是否是手机端展示                      | boolean                                                                         | -      |
| tooltip          | 问号提示，仅在 type='formItem' 时生效 | string                                                                          | -      |
| rows             | 最大行数，仅在 type='formItem' 时生效 | number                                                                          | -      |
| maxLength        | 最大长度                              | number                                                                          | -      |
| expand           | 是否展开，仅在字符串类型下生效        | boolean                                                                         | -      |
| format           | 格式化配置函数                        | `(value: any, record?: T) => React.ReactNode`                                   | -      |
| dict             | 字典配置数组                          | `ReadonlyArray<{ text: string; value: string \| number; [key: string]: any; }>` | -      |
| formatValue      | 格式化值配置函数                      | `(value: any, record?: T) => number \| string`                                  | -      |
| formatNumber     | 数值格式化配置                        | `Columns['formatNumber']`                                                       | -      |
| formatPercent    | 百分比格式化配置                      | `Columns['formatPercent']`                                                      | -      |
| formatTime       | 时间格式化配置                        | `boolean \| string \| { type?: string; format: string }`                        | -      |
| controlProps     | 控制组件的配置                        | `DeepPartial<Merge<EllipsisProps, EllipsisExpandProps>>`                        | -      |

### ref

| 参数      | 说明     | 类型                                                       | 默认值 |
| --------- | -------- | ---------------------------------------------------------- | ------ |
| fetchData | 请求数据 | `(defaultParams?: any, defaultData?: any) => Promise<T[]>` | -      |
| data      | 数据     | `T`                                                        | -      |
