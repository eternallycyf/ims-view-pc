---
title: CommonDemo
description: 组件的demo
order: 0
toc: content
demo:
  cols: 2
---

## CommonDemo 通用演示组件

- `CommonDemo` 是一个演示组件，用于展示代码封装风格，及文档规范
- 具体见[源代码](https://github.com/eternallycyf/ims-view-pc/blob/master/packages/ims-view-pc/src/components/CommonDemo/index.tsx)

### 何时使用

- 在文档或示例中展示功能、组件的使用方法和效果。
- 提供演示代码，方便用户理解和复制。
- 用于文档或博客中的示例展示。

### 如何使用

在需要展示示例的地方引入 `CommonDemo` 组件，并传入相应的示例内容和代码。例如：

## 示例

<Tree>
  <ul>
    <li>
      src
      <ul>
        <li>
          component
          <ul>
            <li>
              Xxx
              <small>添加新的组件</small>
              <ul>
                <li>
                  index.tsx 
                  <small>导出组件 设置子组件(Xxx.Item)</small>
                </li>
                <li>
                  interface.ts 
                  <small>ts文件 export 形式</small>
                </li>
                <li>
                  Xxx.tsx
                  <small>主文件</small>
                </li>
                <li>
                  Item.tsx
                  <small>子文件</small>
                </li>
                <li>
                  index.less
                </li>
                <li>
                  index.md
                  <small>文档主文件</small>
                </li>
                <li>
                  index.$tab-xxx.tsx
                  <small>多tab页文档子文件</small>
                </li>
                <li>
                  demo
                  <small>demo的文件夹</small>
                  <ul>
                    <li>
                      Xxx.tsx 
                    </li>
                  </ul>
                </li>
                <li>
                  test
                  <small>单元测试</small>
                  <ul>
                    <li>
                      Xxx.tsx 
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li>
      package.json
    </li>
  </ul>
</Tree>

<code src="./demo/index.tsx">CommonDemo</code>

## API

### `ICommonDemoHandle<T = any>`

| 属性      | 说明       | 类型                                              | 默认值 |
| --------- | ---------- | ------------------------------------------------- | ------ |
| fetchData | 发起请求   | `(defaultParams?: any, defaultData?: any) => any` | -      |
| data      | 请求的数据 | `T`                                               | -      |
| loading   | 加载状态   | `loading`                                         | -      |

### `ICommonDemoProps<T = Record<string, any>>`

| 属性        | 说明           | 类型                                                   | 默认值 |
| ----------- | -------------- | ------------------------------------------------------ | ------ |
| fetchConfig | 请求配置       | <a href='/hooks/use-fetch#fetchconfig'>fetchConfig</a> | -      |
| dataHandler | 数据处理       | `(data: T) => any`                                     | -      |
| initRequest | 是否初始化请求 | `boolean`                                              | -      |
| request     | 请求函数       | `(config: AxiosRequestConfig) => Promise<T>`           | -      |

## FAQ
