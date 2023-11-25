---
title: ScatterChart
order: 2
apiHeader:
  pkg: '@ims-view/chart'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/chart/src/ScatterChart/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/chart/src/ScatterChart/index.tsx
---

## ScatterChart 散点图

### 概述

散点图组件用于展示散点数据。下面是关于 `ScatterChart` 组件的基本信息。

### 如何使用

提供了一些基本的使用说明，以及一个简单的示例代码。

## 示例

<code src="./demo/demo1.tsx"></code>

## API

### props

| 属性        | 说明         | 类型                    | 默认值 |
| ----------- | ------------ | ----------------------- | ------ |
| data        | 数据         | `any[]`                 | -      |
| baseConfig  | 基础配置     | `IBaseScatterConfig`    | -      |
| chartConfig | ECharts 配置 | `IScatterChartConfig[]` | -      |

### baseConfig

| 属性                 | 说明                                                                                             | 类型       | 默认值 |
| -------------------- | ------------------------------------------------------------------------------------------------ | ---------- | ------ |
| TIME                 | 时间字段                                                                                         | `string`   | -      |
| TOTAL                | 总数字段                                                                                         | `string`   | -      |
| XAXIS_FORMATE_TIME   | X 轴时间格式                                                                                     | `string`   | -      |
| TOOLTIP_TIME_FORMAT  | Tooltip 时间格式                                                                                 | `string`   | -      |
| TOOLTIP_WIDTH        | Tooltip 宽度                                                                                     | `number`   | -      |
| TOOLTIP_HEIGHT       | Tooltip 高度                                                                                     | `number`   | -      |
| BLACK                | 黑色                                                                                             | `string`   | -      |
| RED                  | 红色                                                                                             | `string`   | -      |
| GREEN                | 绿色                                                                                             | `string`   | -      |
| TOOLTIP_SHADOW_COLOR | Tooltip 阴影颜色                                                                                 | `string`   | -      |
| XAXIS_NAME           | X 轴名称                                                                                         | `string`   | -      |
| YAXIS_NAME           | Y 轴名称                                                                                         | `string`   | -      |
| LINE_SERIES          | 线图配置                                                                                         | `object`   | -      |
| BAR_SERIES           | 柱状图配置                                                                                       | `object`   | -      |
| SCATTER_SERIES       | 散点图配置                                                                                       | `object`   | -      |
| GRID_CONFIG          | Grid 配置                                                                                        | `object`   | -      |
| GET_LEGEND_FN        | 获取 legend 的函数，返回值为一个对象，包含 `data` 和 `formatter` 两个属性                        | `Function` | -      |
| RENDER_TOOLTIP_FN    | 渲染 Tooltip 的函数，返回值为一个数组，数组中的每一项为一个对象，包含 `name` 和 `value` 两个属性 | `Function` | -      |

### IScatterChartConfig

| 属性           | 说明                                                                  | 类型       | 默认值 |
| -------------- | --------------------------------------------------------------------- | ---------- | ------ |
| name           | 图例名称                                                              | `string`   | -      |
| dataKey        | 数据字段                                                              | `string`   | -      |
| isLegend       | 是否显示在图例中                                                      | `boolean`  | -      |
| legendSuffix   | 图例 name 额外后缀                                                    | `string`   | -      |
| isSeries       | 是否显示在 series 中                                                  | `boolean`  | -      |
| unitSymbol     | tooltip 显示的单位                                                    | `string`   | -      |
| shape          | tooltip 及 legend 图标显示的形状                                      | `string`   | -      |
| type           | 图表类型                                                              | `string`   | -      |
| shapeColor     | 图表形状颜色                                                          | `string`   | -      |
| leftClassName  | 左侧 className                                                        | `string`   | -      |
| rightClassName | 右侧 className                                                        | `string`   | -      |
| isBold         | 是否加粗                                                              | `boolean`  | -      |
| format         | 格式化数据                                                            | `Function` | -      |
| formatColor    | 自定义格式化 tooltip 数字颜色 如果大于 0 显示红色，小于 0 显示绿色... | `Function` | -      |
| hasHr          | 是否有分割线                                                          | `boolean`  | -      |
| isTopFlag      | 是否为上方显示的 tag                                                  | `boolean`  | -      |
| series         | 自定义 series                                                         | `Object`   | -      |
| isOnly         | 一行是否只有一个 Name 没有 value 则居中显示                           | `boolean`  | -      |
