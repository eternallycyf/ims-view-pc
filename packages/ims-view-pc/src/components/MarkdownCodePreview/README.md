---
title: MarkdownCodePreview
toc: content
group:
  title: 表单
---

## MarkdownCodePreview

Markdown 源码编辑 + 实时预览组件，基于 `react-markdown-editor-lite`，预览区复用 `Markdown` 组件，可与 `Form.Item` 受控联动。

## 示例

<code src='./demo/index.tsx'></code>

## API

### MarkdownCodePreviewProps

| 名称               | 类型                                      | 默认值 | 描述                         |
| ------------------ | ----------------------------------------- | ------ | ---------------------------- |
| value              | `string`                                  | -      | 受控 Markdown 文本           |
| defaultValue       | `string`                                  | `''`   | 非受控初始内容               |
| onChange           | `(markdown: string) => void`              | -      | 内容变更回调                 |
| className          | `string`                                  | -      | 容器 className               |
| style              | `React.CSSProperties`                     | -      | 容器样式                     |
| disabled           | `boolean`                                 | `false`| 禁用（与 Form.Item 对齐）    |
| readOnly           | `boolean`                                 | `false`| 只读                         |
| placeholder        | `string`                                  | -      | 编辑器占位文案               |
| markdownComponents | `XMarkdownProps['components']`          | -      | 预览区自定义标签映射         |
| height             | `number \| string`                        | -      | 编辑器高度，如 `480`、`50vh` |
| mdEditorProps      | `Omit<MdEditorProps, 'value' \| ...>`     | -      | 透传 react-markdown-editor-lite |

### MarkdownCodePreviewHandle

| 方法        | 说明                                       |
| ----------- | ------------------------------------------ |
| getMarkdown | 获取当前 Markdown 源码                     |
| getHtml     | 获取预览区 HTML 字符串                     |
| setMarkdown | 设置全文（勿在 onChange 内调用）           |
