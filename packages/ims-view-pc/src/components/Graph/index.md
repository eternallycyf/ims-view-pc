---
title: Graph
description: 企查查公司依赖图
toc: content
group:
  title: 数据可视化
  order: 8
---

:::info{title=可单独使用}
[ims-graph](https://www.npmjs.com/package/ims-graph)
:::

## 安装方式

:::code-group

```bash [npm]
npm install -D ims-graph
```

```bash [yarn]
yarn add -D ims-graph
```

```bash [pnpm]
pnpm add -D ims-graph
```

:::

## 示例

<code transform="true" src='./demo/index.tsx'>GraphChart</code>

## interface

```ts
export interface IGraphDataRecord {
  title: string;
  content?: string;
  keyPersonName?: string;
  children?: IGraphDataRecord[];
}

export interface IGraphChartProps {
  chartType: '1' | '2';
  data: IGraphDataRecord[];
}
```
