---
title: useFetch
order: 2
apiHeader:
  pkg: '@ims-view/hooks'
  docUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/docs/hooks/useFetch/index.md
  sourceUrl: https://github.com/eternallycyf/ims-view-pc/blob/master/packages/hooks/src/useFetch/index.ts
---

## useFetch

<code src='../demo/useFetch.tsx'>useFetch</code>

## Params

| 属性        | 说明           | 类型                                         | 默认值  |
| ----------- | -------------- | -------------------------------------------- | ------- |
| fetchConfig | 请求配置       | `useFetchProps['fetchConfig']`               | -       |
| dataHandler | 数据处理函数   | `(data: T) => T`                             | -       |
| initRequest | 是否初始化请求 | `boolean`                                    | `false` |
| request     | 请求函数       | `(config: AxiosRequestConfig) => Promise<T>` | -       |

## Result

```ts
readonly [
  {
    loading: boolean;
    value: T;
    error: Error | undefined;
  },
  (defaultParams?: any, defaultData?: any) => any,
];
```

| 属性      | 说明       | 类型                                              |
| --------- | ---------- | ------------------------------------------------- |
| loading   | 是否加载中 | `boolean`                                         |
| value     | 数据       | `T`                                               |
| error     | 错误       | `Error`                                           |
| fetchData | 请求方法   | `(defaultParams?: any, defaultData?: any) => any` |

## fetchConfig

| 属性     | 说明       | 类型            |
| -------- | ---------- | --------------- |
| apiUrl   | 请求地址   | `string`        |
| method   | 请求方法   | `get` or `post` |
| params   | 请求参数   | `any`           |
| data     | 请求体     | `any`           |
| dataPath | 请求体路径 | `string`        |
| depts    | 请求头     | `any[]`         |
