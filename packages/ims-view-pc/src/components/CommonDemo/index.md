---
title: CommonDemo
description: 组件的demo
order: 0
toc: content
demo:
  cols: 2
---

## `ICommonDemoHandle<T = any>`

| 属性      | 说明       | 类型                                              | 默认值 |
| --------- | ---------- | ------------------------------------------------- | ------ |
| fetchData | 发起请求   | `(defaultParams?: any, defaultData?: any) => any` | -      |
| data      | 请求的数据 | `T`                                               | -      |
| loading   | 加载状态   | `loading`                                         | -      |

## `ICommonDemoProps<T = Record<string, any>>`

| 属性        | 说明           | 类型                                                   | 默认值 |
| ----------- | -------------- | ------------------------------------------------------ | ------ |
| fetchConfig | 请求配置       | <a href='/hooks/use-fetch#fetchconfig'>fetchConfig</a> | -      |
| dataHandler | 数据处理       | `(data: T) => any`                                     | -      |
| initRequest | 是否初始化请求 | `boolean`                                              | -      |
| request     | 请求函数       | `(config: AxiosRequestConfig) => Promise<T>`           | -      |
