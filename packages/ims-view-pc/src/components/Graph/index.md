---
title: Graph
description: 企查查公司依赖图
toc: content
group:
  title: 数据可视化
  order: 8
---

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
