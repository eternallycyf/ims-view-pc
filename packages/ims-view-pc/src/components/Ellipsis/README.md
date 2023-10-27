---
title: Ellipsis
description: Ellipsis
toc: content
group:
  title: 其他
  order: 10
demo:
  cols: 2
---

## Ellipsis 文本省略

展示空间不足时，隐去部分内容并用“...”替代。

## 何时使用

- 文本内容长度或高度超过列宽或行高。
- 图表中空间有限，文本内容无法完全显示。
- 自适应调整时宽度变小。

<code src='./demo/demo1.tsx'>按照字符数省略</code>

<code src='./demo/demo2.tsx'>按照宽度省略</code>

<code src='./demo/demo3.tsx'>按照行数省略</code>

<code src='./demo/demo4.tsx'>一行还有其他元素</code>

### Ellipsis.Expand

<code src='./demo/expand.tsx'>展开收起</code>

## API

### Ellipsis

- 注意： `length/width/lines` 属性代表三种模式：限制字数、限制宽度、限制行数 ，使用时三选一
- `Tooltip` 仅在文字不能完全显示的时候生效。

| 参数                 | 说明                                                      | 类型               | 默认值 |
| -------------------- | --------------------------------------------------------- | ------------------ | ------ |
| tooltip              | 移动到文本展示完整内容的提示                              | `Boolean`          | true   |
| tooltipProps         | tooltip 的属性                                            | `Tooltip`          | {}     |
| length               | 在按照长度截取下的文本最大字符数，超过则截取省略          | `Number`           | -      |
| lines                | 在按照行数截取下最大的行数，超过则截取省略                | `Number`           | 1      |
| fullWidthRecognition | length 模式下,是否将全角字符的长度视为 2 来计算字符串长度 | `Boolean`          | false  |
| className            | 额外 class                                                | `String`           | -      |
| style                | 额外样式                                                  | `Object`           | -      |
| width                | 限制宽度大小                                              | `String \| Number` | -      |

### Ellipsis.Expand

| 属性                            | 说明                                 | 类型                            | 默认值  |
| ------------------------------- | ------------------------------------ | ------------------------------- | ------- |
| collapseText                    | 收起操作的文案                       | `React.ReactNode`               | `''`    |
| content                         | 文本内容                             | `string`                        | -       |
| direction                       | 省略位置                             | `'start' \| 'end' \| 'middle'`  | `'end'` |
| expandText                      | 展开操作的文案                       | `React.ReactNode`               | `''`    |
| onContentClick                  | 点击文本内容时触发                   | `(e: React.MouseEvent) => void` | -       |
| rows                            | 展示几行                             | `number`                        | `1`     |
| stopPropagationForActionButtons | 阻止展开操作，收起操作引发的事件冒泡 | `PropagationEvent[]`            | `[]`    |
| defaultExpanded                 | 是否默认展开                         | `boolean`                       | `false` |
| tooltip                         | 是否显示 tooltip                     | `'boolean' \| 'tooltipProps'`   | `false` |

## FAQ

### 1.文本内容包含较长且连续的数字或英文时，不会出现省略怎么办？

`Ellipsis` 组件内部会读取 `word-break` 这个 CSS 属性的值，如果未设置该样式属性的值，默认值为：`normal`。所以，当文本内容中包含大量数字或英文时，文本内容无法省略（浏览器的默认行为）。此时，如果需要让文本省略生效，可以手动在 `Ellipsis` 组件或其外层元素中，添加 `word-break` 样式（比如，`word-break: break-word`），`Ellipsis` 组件会完全遵循样式继承行为，拿到你设置的 `word-break`，从而实现自动省略。

### 2.独占一行的 string

```tsx | pure
const content =
  '1、思想成熟、精明能干、为人诚实。<br/>2、有极强的系统管理能力。<br/>3、能够在高压力下和时间限制下进行工作。<br/>5、积极主动、独立工作能力强，并有良好的交际技能。<br/>6、精力旺盛、思想新潮。<br/>7、年轻、聪明、精力充沛，并有很强的事业心。<br/>8、有雄心壮志。<br/>9、善于同各种人员打交道。<br/>10、能够独立工作、思想成熟、应变能力强。<br/>11、有获得成功的坚定决心。1、思想成熟、精明能干、为人诚实。<br/>2、有极强的系统管理能力。<br/>3、能够在高压力下和时间限制下进行工作。<br/>5、积极主动、独立工作能力强，并有良好的交际技能。<br/>6、精力旺盛、思想新潮。<br/>7、年轻、聪明、精力充沛，并有很强的事业心。<br/>8、有雄心壮志。<br/>9、善于同各种人员打交道。<br/>10、能够独立工作、思想成熟、应变能力强。<br/>11、有获得成功的坚定决心。';

<Ellipsis
  style={{
    whiteSpace: 'pre-wrap',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '25px',
  }}
  direction="end"
  content={content.split('<br/>').join('\n')}
  rows={1}
  expandText="&nbsp;&nbsp;&nbsp;展开&nbsp;"
  collapseText="收起"
/>;
```
