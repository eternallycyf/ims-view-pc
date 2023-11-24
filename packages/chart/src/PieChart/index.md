---
title: PieChart
order: 2
apiHeader:
  pkg: '@ims-view/chart'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/chart/src/PieChart/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/chart/src/PieChart/index.tsx
---

## PieChart 饼状图

`PieChart` 是用于显示饼状图的组件。

### 何时使用

- 用于展示数据的占比关系。
- 提供灵活的配置选项，以满足不同的数据和需求展示饼状图。

### 如何使用

在需要使用饼状图的地方引入 `PieChart` 组件，并传入相应的数据和配置。例如：

<code src='./demo/demo1.tsx'></code>

## API

### props

| 类型          | 属性          | 说明                                                   | 类型                       | 默认值 |
| ------------- | ------------- | ------------------------------------------------------ | -------------------------- | ------ |
| `data`        | `data`        | 图表数据。                                             | `any`                      | -      |
| `baseConfig`  | `baseConfig`  | 基础配置的可选部分，用于配置饼状图的基础样式和属性。   | `Partial<IBaseConfig>`     | -      |
| `chartConfig` | `chartConfig` | 饼状图配置的可选部分，用于配置饼状图的特定样式和属性。 | `Partial<IPieChartConfig>` | -      |
| `style`       | `style`       | 图表的样式。                                           | `CSSProperties`            | -      |
| `emptyStyle`  | `emptyStyle`  | 空图表的样式。                                         | `CSSProperties`            | -      |

#### IBaseConfig

| 属性                   | 说明                     | 类型                                                                     | 默认值 |
| ---------------------- | ------------------------ | ------------------------------------------------------------------------ | ------ |
| `TOOLTIP_WIDTH`        | Tooltip 的宽度。         | `number`                                                                 | -      |
| `TOOLTIP_HEIGHT`       | Tooltip 的高度。         | `number`                                                                 | -      |
| `HAS_TOOLTIP`          | 是否启用 Tooltip。       | `boolean`                                                                | -      |
| `BLACK`                | 颜色代码。               | `string`                                                                 | -      |
| `RED`                  | 颜色代码。               | `string`                                                                 | -      |
| `GREEN`                | 颜色代码。               | `string`                                                                 | -      |
| `TOOLTIP_SHADOW_COLOR` | Tooltip 阴影的颜色代码。 | `string`                                                                 | -      |
| `PIE_SERIES.type`      | 系列的类型。             | `string`                                                                 | -      |
| `GRID_CONFIG`          | 网格配置。               | `any`                                                                    | -      |
| `GET_LEGEND_FN`        | 获取图例信息的函数。     | `(item: IPieChartConfig, data: any[]) => { name: string; icon: string }` | -      |
| `IS_SOLID`             | 是否为实心饼图。         | `boolean`                                                                | -      |

#### IPieChartConfig

| 属性             | 说明                                               | 类型                                                                                                                        | 默认值 |
| ---------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------ |
| `name`           | 图表名称。                                         | `string`                                                                                                                    | -      |
| `extraName`      | 额外的图表名称。                                   | `string`                                                                                                                    | -      |
| `dataKey`        | 数据键。                                           | `string`                                                                                                                    | -      |
| `percentKey`     | 百分比键。                                         | `string`                                                                                                                    | -      |
| `isLegend`       | 是否显示在图例中。                                 | `boolean`                                                                                                                   | -      |
| `legendSuffix`   | 图例名称的额外后缀。                               | `string`                                                                                                                    | -      |
| `isSeries`       | 是否显示在系列中（已弃用，根据 `isLegend` 判断）。 | `boolean`                                                                                                                   | -      |
| `unitSymbol`     | 单位符号。                                         | `string`                                                                                                                    | -      |
| `shape`          | 图表形状。                                         | `string`                                                                                                                    | 'pie'  |
| `type`           | 图表类型。                                         | `string`                                                                                                                    | 'pie'  |
| `shapeColor`     | 形状颜色。                                         | `CSSProperties['color']`                                                                                                    | -      |
| `leftClassName`  | 左侧类名。                                         | `string`                                                                                                                    | -      |
| `rightClassName` | 右侧类名。                                         | `string`                                                                                                                    | -      |
| `isBold`         | 是否加粗。                                         | `boolean`                                                                                                                   | -      |
| `format`         | 格式化数据的函数。                                 | `(value: number) => number \| string`                                                                                       | -      |
| `formatPercent`  | 格式化百分比的函数。                               | `(value: number) => number \| string`                                                                                       | -      |
| `formatColor`    | 自定义格式化 Tooltip 数字颜色的函数。              | `(val: number) => CSSProperties['color'] \| (val) => val === 0 ? '#2A303B' : (val > 0 ? '#E62C3B' : '#0FBE3F') : '#2A3038'` |
| `isOnly`         | 一行是否只有一个 Name，没有 value 则居中显示。     | `boolean`                                                                                                                   | false  |
