---
title: Markdown
toc: content
group:
  title: 信息展示
---

## Markdown

基于 `@ant-design/x-markdown` 的 Markdown 渲染组件，支持代码高亮、表格省略、LaTeX、流式打字机与长文 deferred 渲染。

## 示例

<code src='./demo/index.tsx'>基础渲染</code>

<code src='./demo/streaming.tsx'>流式输出</code>

## API

### MarkdownProps

| 名称       | 类型                              | 默认值   | 描述           |
| ---------- | --------------------------------- | -------- | -------------- |
| content    | `string`                          | -        | Markdown 文本  |
| components | `XMarkdownProps['components']`    | -        | 自定义标签映射 |
| renderMode | `'auto' \| 'immediate' \| 'deferred' \| 'typewriter'` | `'auto'` | 长文渲染策略   |

### MarkdownRenderMode

- `auto`（默认）：短文本立即渲染；长文本 defer 到空闲帧一次性解析
- `immediate`：始终全量立即渲染
- `deferred`：始终 defer
- `typewriter`：打字机渐进（大表格场景慎用）

### CustomImage

Markdown 内图片的统一渲染入口，也可单独使用。
