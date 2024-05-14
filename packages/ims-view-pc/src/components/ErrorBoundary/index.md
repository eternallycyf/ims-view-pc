---
title: ErrorBoundary
description: ErrorBoundary
toc: content
group:
  title: 工具
demo:
  cols: 2
---

## ErrorBoundary 错误边界

通过错误边界，可以在组件层次结构中捕获 JavaScript 错误，并优雅地处理这些错误，以防止整个应用程序崩溃。

### 何时使用

- 捕获和处理组件内部 JavaScript 错误，防止它们传播到整个应用。
- 提供用户友好的错误信息，以改善用户体验。
- 在开发和生产环境中使用，以便及时发现和解决问题。

### 如何使用

在需要添加错误边界的组件中使用 `ErrorBoundary` 组件包裹，并提供适当的错误处理逻辑。例如：

```tsx | pure
import ErrorBoundary from 'ims-view-pc';

// ...

<ErrorBoundary>{/* Your component with potential errors */}</ErrorBoundary>;
```

## API

| 参数        | 说明                                         | 类型                             | 默认值 | 版本 |
| ----------- | -------------------------------------------- | -------------------------------- | ------ | ---- |
| description | 自定义错误内容，如果未指定会展示报错堆栈     | `ReactNode \| {{ error stack }}` |        |
| message     | 自定义错误标题，如果未指定会展示原生报错信息 | `ReactNode \| {{ error }}`       |        |

## FAQ

- 错误边界只能捕获其子组件的错误，无法捕获同级组件的错误。
- 需要注意处理可能发生的异步错误
