---
title: CommonDemo
order: 1
apiHeader:
  pkg: 'ims-view-pc'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/docs/component/CommonDemo.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/ims-view-pc/src/CommonDemo/index.tsx
---

## CommonDemo

```ts
import { ICommonDemoHandle, ICommonDemoProps, CommonDemo } from 'ims-view-pc';
```

<code src="./demo.tsx">CommonDemo</code>

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
