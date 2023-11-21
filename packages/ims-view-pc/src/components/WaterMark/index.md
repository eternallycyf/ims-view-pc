---
title: WaterMark
description: 水印
toc: content
group:
  title: 其他
  order: 10
demo:
  cols: 2
---

## WaterMark 水印

通过添加水印，可以在页面上叠加透明的文本或图像，用于标识或美化内容。

### 何时使用

- 在敏感文档或图像上叠加水印，以强调其机密性。
- 在展示临时或草稿状态的页面上添加水印，提醒用户当前状态。
- 个性化展示，例如品牌标识或背景图案。

### 如何使用

在需要添加水印的页面或元素上应用样式或组件，并设置透明度、文本内容等属性。例如：

<code src="./demo/index.tsx">WaterMark</code>

## API

| 参数         | 说明         | 类型                 | 默认值                   |
| ------------ | ------------ | -------------------- | ------------------------ |
| width        | 画布宽度     | `number`             | 300                      |
| height       | 画布高度     | `number`             | 200                      |
| textAlign    | 字体对齐方式 | `CanvasTextAlign`    | center                   |
| textBaseline | 字体基线     | `CanvasTextBaseline` | middle                   |
| font         | 字体         | `string`             | 18px Microsoft Yahei     |
| fillStyle    | 字体颜色     | `string`             | rgba(184, 184, 184, 0.6) |
| content      | 水印内容     | `string`             | -                        |
| rotate       | 字体旋转角度 | `number`             | -20                      |
| zIndex       | 水印层级     | `number`             | 1000                     |
| children     | 子元素       | `React.ReactNode`    | -                        |

## FAQ

- 考虑水印对页面可读性的影响，避免过于显眼影响用户体验。
- 对于图像水印，确保其透明度足够以不干扰正文内容。
