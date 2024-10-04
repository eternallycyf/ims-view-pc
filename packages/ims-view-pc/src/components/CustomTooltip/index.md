---
title: CustomTooltip
description: CustomTooltip
toc: content
group:
  title: 信息展示
  order: 7
---

## CustomTooltip 富文本的展开收起

## 何时使用

- 富文本的展开收起
  - 展开单行的文字
  - 在 table 中使用
  - tag 自动展开
  - 右侧模式
  - 展开具体数量 => 剩余 x 个
- 纯`string`的推荐使用 [Ellipsis](/components/ellipsis) 组件即可(富文本的展开按钮会另开一行， 无法判断)

## 示例

<code src='./demo/string.tsx'>1.string</code>

<code src='./demo/rich.tsx'>2.富文本</code>

<code src='./demo/table.tsx'>3.string-table 中使用</code>

<code src='./demo/table-rich.tsx'>4.富文本-table 中使用</code>

## API

```ts
export interface CustomTooltipProps {
  content?: React.ReactNode;
  rows?: number;
  expand?: boolean;
  maxHeight?: number;
  expandMoreLength?: number;
  expandOnChange?: (setHasExpend: Dispatch<SetStateAction<boolean>>) => any;

  ellipsisSymbol?: boolean;
  buttonStyle?: CSSProperties;
  direction?: 'right' | 'default';
  type?: 'default' | 'simple' | 'custom';

  style?: CSSProperties;
  paragraphStyle?: CSSProperties;
  className?: string;
  buttonClassName?: string;
  paragraphClassName?: string;
  tooltipClassName?: string;

  ellipsisProps?: EllipsisConfig;
}
```

## FAQ

### 1.初始化出现闪烁现象

- 可以通过 `maxHeight` 设置收起时候的最大高度(内部 `overflow: hidden` 就不会闪烁了)
