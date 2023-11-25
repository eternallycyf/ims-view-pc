---
title: StackChart
order: 3
apiHeader:
  pkg: '@ims-view/chart'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/chart/src/StackChart/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/chart/src/StackChart/index.tsx
---

## StackChart 堆叠图

### 概述

堆叠图，支持多个堆叠图的展示，支持自定义图表类型，支持自定义 Tooltip，支持自定义 legend。

### 如何使用

提供了一些基本的使用说明，以及一个简单的示例代码。

## 示例

<code src="./demo/index.tsx"></code>

## API

### props

| 属性        | 说明         | 类型                  | 默认值 |
| ----------- | ------------ | --------------------- | ------ |
| data        | 数据         | `any[]`               | -      |
| baseConfig  | 基础配置     | `IBaseStackConfig`    | -      |
| chartConfig | ECharts 配置 | `IStackChartConfig[]` | -      |

### baseConfig

| 属性名                            | 类型             | 默认值          | 描述                                                                  |
| --------------------------------- | ---------------- | --------------- | --------------------------------------------------------------------- |
| TIME                              | string           | 'time'          | 时间字段                                                              |
| TOTAL                             | string           | 'total'         | 合计字段                                                              |
| TOTAL_NAME                        | string           | '合计'          | 合计名称                                                              |
| XAXIS_FORMATE_TIME                | string           | 'YYYY-MM 月'    | X 轴时间格式化                                                        |
| TOOLTIP_TIME_FORMAT               | string           | 'YYYY 年 MM 月' | Tooltip 时间格式化                                                    |
| HAS_TOP_LABEL                     | boolean          | false           | 是否展示顶部总和                                                      |
| DYNAMICS_BAR_TOTAL                | boolean          | true            | 是否展示动态柱状图总和                                                |
| HAS_DATA_ZOOM                     | boolean          | false           | 是否展示区域缩放滑块                                                  |
| HAS_DATA_ZOOM_LOCK                | boolean          | false           | 区域缩放滑块是否可自定义拉伸大小                                      |
| DATA_ZOOM_START_VALUE             | string           | ''              | 区域缩放-滑块初始化开始点                                             |
| DATA_ZOOM_END_VALUE               | string           | ''              | 区域缩放-滑块初始化结束点                                             |
| DATA_ZOOM_START                   | string \| number | ''              | 区域缩放-滑块初始化开始点                                             |
| DATA_ZOOM_END                     | string \| number | ''              | 区域缩放-滑块初始化结束点                                             |
| DATA_ZOOM_START_AND_END_VALUE_OBJ | boolean          | ''              | 区域缩放-滑块初始化开始点                                             |
| DATA_ZOOM_START_AND_END_OBJ       | boolean          | ''              | 区域缩放-滑块初始化开始点                                             |
| DATAZOOM_SLIDER_CONFIG            | any              | {}              | 区域缩放-滑块初始化开始点                                             |
| HAS_SCROLL_TOOLTIP                | boolean          | false           | 开启后 tooltip 会开启滚动样式，TOOLTIP_WIDTH 和 TOOLTIP_HEIGHT 会生效 |
| TOOLTIP_WIDTH                     | number           | 320             | Tooltip 宽度                                                          |
| TOOLTIP_HEIGHT                    | number           | 350             | Tooltip 高度                                                          |
| XAXIS_NAME                        | string           | ''              | X 轴名称                                                              |
| YAXIS_NAME1                       | string           | ''              | Y 轴名称                                                              |
| YAXIS_NAME2                       | string           | ''              | Y 轴名称                                                              |
| BLACK                             | string           | '#2A303B'       | Tooltip 数值格式化颜色                                                |
| RED                               | string           | '#E62C3B'       | Tooltip 数值格式化颜色                                                |
| GREEN                             | string           | '#0FBE3F'       | Tooltip 数值格式化颜色                                                |
| TOOLTIP_SHADOW_COLOR              | string           | '#F0F6FF'       | Tooltip 阴影颜色                                                      |
| LINE_SERIES                       | any              | -               | 折线图系列配置                                                        |
| IS_AREA                           | boolean          | false           | 是否是面积图                                                          |
| XASIS_LABEL_FORMAT                | Function         | -               | X 轴 label 格式化                                                     |
| LINE_YAXIS_LABEL                  | any              | -               | 折线图 Y 轴 label 格式化                                              |
| LINE_YAXIS                        | Object           | {}              | 折线图 Y 轴配置                                                       |
| LEGEND_CONFIG                     | Object           | {}              | 图例配置                                                              |
| BAR_SERIES                        | Object           | -               | 柱状图配置                                                            |
| GRID_CONFIG                       | Object           | {}              | 图表配置                                                              |
| GET_LEGEND_FN                     | Function         | -               | 获取图例配置的函数                                                    |

### chartConfig

| 属性名         | 类型                                             | 描述                                         |
| -------------- | ------------------------------------------------ | -------------------------------------------- |
| name           | string                                           | 图表名称                                     |
| showName       | string                                           | 当与 `name` 不同时，在 tooltip 中显示        |
| dataKey        | string                                           | 数据键（必填）                               |
| percentKey     | string                                           | 百分比字段（显示在 tooltip 中）              |
| isLegend       | boolean                                          | 是否显示在图例中                             |
| legendSuffix   | string                                           | 图例名称后缀                                 |
| isSeries       | boolean                                          | （弃用）显示在系列中（基于 `isLegend` 判断） |
| unitSymbol     | string                                           | Tooltip 和图例的单位                         |
| percentSymbol  | string                                           | 百分比单位                                   |
| shape          | 'rect' \| 'line' \| false                        | Tooltip 和图例图标的形状                     |
| type           | 'bar' \| 'line'                                  | 图表类型                                     |
| shapeColor     | CSSProperties['color']                           | 图表形状颜色                                 |
| leftClassName  | string                                           | 左侧样式类名                                 |
| rightClassName | string                                           | 右侧样式类名                                 |
| isBold         | boolean                                          | 是否加粗显示                                 |
| format         | (value: number, record: any) => number \| string | 格式化数据                                   |
| formatPercent  | (value: number, record: any) => number \| string | 格式化百分比                                 |
| formatColor    | (val: number) => CSSProperties['color']          | 格式化颜色                                   |
| hasHr          | boolean                                          | 是否显示分隔线                               |
| isTopFlag      | boolean                                          | 是否为上方显示的 tag                         |
| series         | Object                                           | 自定义 series 配置                           |
| isOnly         | boolean                                          | 一行是否只有一个 Name，没有 value 则居中显示 |
| tootipType     | string \| number                                 | Tooltip 类型                                 |
