---
title: SunburstChart
order: 4
apiHeader:
  pkg: '@ims-view/chart'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/chart/src/SunburstChart/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/chart/src/SunburstChart/index.tsx
---

## SunburstChart 旭日图

### 概述

旭日图，是一种可视化的层级结构图，它的层级关系是通过圆环的嵌套来表示的，每个圆环代表一个层级，圆环的大小代表该层级的数据大小，圆环的颜色代表该层级的数据类别。

### 如何使用

提供了一些基本的使用说明，以及一个简单的示例代码。

## 示例

<code src='./demo/chart.tsx'></code>

## API

### props

| 属性        | 说明         | 类型                       | 默认值 |
| ----------- | ------------ | -------------------------- | ------ |
| data        | 数据         | `any`                      | -      |
| baseConfig  | 基础配置     | `IBaseSunburstChartConfig` | -      |
| chartConfig | ECharts 配置 | `ISunburstChartConfig[]`   | -      |

### baseConfig

| 属性名               | 类型   | 默认值    | 描述             |
| -------------------- | ------ | --------- | ---------------- |
| TOOLTIP_WIDTH        | number | 320       | tooltip 宽度     |
| TOOLTIP_HEIGHT       | number | 350       | tooltip 高度     |
| TOOLTIP_SHADOW_COLOR | string | '#F0F6FF' | tooltip 阴影颜色 |
| SUNBURST_SERIES      | object | {}        | 饼图配置         |
| GRID_CONFIG          | object | {}        | grid 配置        |

### chartConfig

| 属性名     | 类型       | 描述               |
| ---------- | ---------- | ------------------ |
| fieldNames | fieldNames | 数据 key 配置      |
| unitSymbol | string     | tooltip 显示的单位 |

### fieldNames

| 属性名     | 类型           | 描述   |
| ---------- | -------------- | ------ |
| name       | string         | 名称   |
| valueKey   | string         | 值     |
| percentKey | string         | 百分比 |
| color      | string         | 颜色   |
| children   | `fieldNames[]` | 子节点 |
