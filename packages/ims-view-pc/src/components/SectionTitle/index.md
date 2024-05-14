---
title: SectionTitle
description: SectionTitle
toc: content
group:
  title: 布局
order: 3
demo:
  cols: 2
---

## SectionTitle 标题

## 示例

<code src='./demo/demo1.tsx'></code>

## API

| 参数         | 说明       | 类型                                                          | 默认值 |
| ------------ | ---------- | ------------------------------------------------------------- | ------ |
| title        | 标题       | React.ReactNode                                               | -      |
| extraContent | 额外内容   | React.ReactNode                                               | -      |
| rowStyle     | 标题行样式 | React.CSSProperties                                           | -      |
| titleStyle   | 标题样式   | React.CSSProperties                                           | -      |
| tooltip      | 提示       | React.ReactNode                                               | -      |
| tooltipProps | 提示属性   | [TooltipProps](https://ant.design/components/tooltip-cn/#API) |
| children     | 子元素     | React.ReactNode                                               | -      |

## FAQ

### 1. 如果标题图标位置错误 请父级添加 `position: relative`
