---
title: BaseChart
order: 1
apiHeader:
  pkg: '@ims-view/chart'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/chart/src/BaseChart/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/chart/src/BaseChart/index.tsx
---

## BaseChart 基础图表

`BaseChart` 是一个用于显示基础图表的组件。

### 何时使用

- 用于展示简单的图表数据。
- 提供灵活的配置选项，以便根据不同的数据和需求展示不同类型的图表。

### 如何使用

在需要使用基础图表的地方引入 `BaseChart` 组件，并传入相应`echarts`的数据和配置。例如：

## demo

<code src="./demo/demo1.tsx">折线图</code>
<code src="./demo/demo2.tsx">柱形图</code>

## API

### props

| 类型              | 属性                                             | 说明                                                                  | 类型                  | 默认值 |
| ----------------- | ------------------------------------------------ | --------------------------------------------------------------------- | --------------------- | ------ |
| `echarts`         | `ECharts` 库的入口，用于导入必要的库。           | `any`                                                                 | -                     |
| `className`       | 容器的类名。                                     | `string`                                                              | -                     |
| `style`           | 容器的样式。                                     | `CSSProperties`                                                       | -                     |
| `option`          | ECharts 图表的配置项。                           | `EChartsOption`                                                       | -                     |
| `theme`           | ECharts 主题配置。可以是主题名字符串或主题对象。 | `string`                                                              | `Record<string, any>` | -      |
| `notMerge`        | 是否启用 `notMerge` 配置，默认为 `false`。       | `boolean`                                                             | `false`               |
| `lazyUpdate`      | 是否启用 `lazyUpdate` 配置，默认为 `false`。     | `boolean`                                                             | `false`               |
| `showLoading`     | 是否启用 `showLoading` 配置，默认为 `false`。    | `boolean`                                                             | `false`               |
| `loadingOption`   | `loadingOption` 配置，默认为 `null`。            | `any`                                                                 | `null`                |
| `opts`            | ECharts 的 `opts` 配置，默认为 `{}`。            | `Opts`                                                                | `{}`                  |
| `onChartReady`    | 图表渲染完成后的回调函数，传入 ECharts 实例。    | `(instance: EChartsInstance) => void`                                 | -                     |
| `onEvents`        | 绑定事件的配置，默认为 `{}`。                    | `Record<string, Function>`                                            | `{}`                  |
| `shouldSetOption` | 决定是否应该更新 ECharts 配置的回调函数。        | `(prevProps: EChartsReactProps, props: EChartsReactProps) => boolean` | -                     |

### instance

| 类型  | 说明               | 类型                                                                                                                                      |
| ----- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` | ECharts 实例方法。 | [ECharts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/64545609abb98e4a40dfd4399eb854b910da5594/types/echarts/index.d.ts#L177) |
