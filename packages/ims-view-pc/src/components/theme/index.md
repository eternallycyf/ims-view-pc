---
title: Theme
order: 0
nav:
  title: 组件
  order: 1
---

## 待完成

- 切换按钮颜色 select 选中项颜色
- 文件上传组件 文件类型 icon
- 空状态

## 继承 antd 主题

- 与`antd v5`主题配置方法保持统一, 只需要使用 `ConfigProvider` 组件包裹即可
- 具体可参考 antd [主题配置方法](https://ant-design.antgroup.com/docs/react/customize-theme-cn)

<code src="./demo/index.tsx"></code>

## Theme

### Theme.Badge

增强了 Antd Badge 色值, 如果未匹配 则直接传入 Antd.Badge.color

- `color: Theme.CustomTheme.xxx ?? Antd.Badge.color`

<code src='./demo/badge.tsx'></code>

### Theme.Tag

增强了几项基本色值, 如果未匹配 则直接传入 Antd.Tag.color

- blue
- orange
- green
- red
- purple
- grey

<code src='./demo/tag.tsx'></code>

### Theme.ThemeColor

| key                          | -                                      | value   |
| ---------------------------- | -------------------------------------- | ------- |
| `blue`                       | <input type="color" value="#2b5fdc" /> | #2b5fdc |
| `red`                        | <input type="color" value="#e62c3b" /> | #e62c3b |
| `orange`                     | <input type="color" value="#fa6a0a" /> | #fa6a0a |
| `green`                      | <input type="color" value="#11bb43" /> | #11bb43 |
| `grey`                       | <input type="color" value="#b3b8c2" /> | #b3b8c2 |
| `purple`                     | <input type="color" value="#b974ff" /> | #b974ff |
| `white`                      | <input type="color" value="#fff" />`   | #fff    |
| `primary-border-color`       | <input type="color" value="#bed7f8" /> | #bed7f8 |
| `primary-bg`                 | <input type="color" value="#e8f3ff" /> | #e8f3ff |
| `blue-bg`                    | <input type="color" value="#f5f8ff" /> | #f5f8ff |
| `blue-hover`                 | <input type="color" value="#4d7fe3" /> | #4d7fe3 |
| `blue-active`                | <input type="color" value="#1b45b8" /> | #1b45b8 |
| `red-bg`                     | <input type="color" value="#fff6f5" /> | #fff6f5 |
| `red-hover`                  | <input type="color" value="#eb4f57" /> | #eb4f57 |
| `red-active`                 | <input type="color" value="#c01b2f" /> | #c01b2f |
| `orange-bg`                  | <input type="color" value="#fff5e8" /> | #fff5e8 |
| `orange-hover`               | <input type="color" value="#fb8b36" /> | #fb8b36 |
| `orange-active`              | <input type="color" value="#cf5006" /> | #cf5006 |
| `green-bg`                   | <input type="color" value="#f5fff5" /> | #f5fff5 |
| `green-hover`                | <input type="color" value="#33c95b" /> | #33c95b |
| `green-active`               | <input type="color" value="#0b9f3c" /> | #0b9f3c |
| `grey-bg`                    | <input type="color" value="#eff1f4" /> | #eff1f4 |
| `grey-hover`                 | <input type="color" value="#caced7" /> | #caced7 |
| `grey-active`                | <input type="color" value="#8e96a4" /> | #8e96a4 |
| `purple-bg`                  | <input type="color" value="#e7c7ff" /> | #e7c7ff |
| `purple-hover`               | <input type="color" value="#a04dff" /> | #a04dff |
| `purple-active`              | <input type="color" value="#8426ff" /> | #8426ff |
| `light-blue-bg`              | <input type="color" value="#e8f3ff" /> | #e8f3ff |
| `light-blue-hover`           | <input type="color" value="#54cfda" /> | #54cfda |
| `light-blue-active`          | <input type="color" value="#1fb4c2" /> | #1fb4c2 |
| `brown-bg`                   | <input type="color" value="#d6b296" /> | #d6b296 |
| `brown-hover`                | <input type="color" value="#c89979" /> | #c89979 |
| `brown-active`               | <input type="color" value="#b37a5a" /> | #b37a5a |
| `control-height`             | <input type="color" value="#26px" />`  | #26px   |
| `text-color`                 | <input type="color" value="#5b6371" /> | #5b6371 |
| `text-disabled-color`        | <input type="color" value="#b3b8c2" /> | #b3b8c2 |
| `text-disabled-weight-color` | <input type="color" value="#5b6371" /> | #5b6371 |
| `status-text`                | <input type="color" value="#2A303B" /> | #2A303B |
| `start`                      | <input type="color" value="#4d7fe3" /> | #4d7fe3 |
| `approve`                    | <input type="color" value="#fa6a0a" /> | #fa6a0a |
| `success`                    | <input type="color" value="#11bb43" /> | #11bb43 |
| `finish`                     | <input type="color" value="#b3b8c2" /> | #b3b8c2 |
| `error`                      | <input type="color" value="#e62c3b" /> | #e62c3b |
| `draft`                      | <input type="color" value="#b3b8c2" /> | #b3b8c2 |
| `line-simple-color1`         | <input type="color" value="#4d7fe3" /> | #4d7fe3 |
| `line-simple-color2`         | <input type="color" value="#e62c3b" /> | #e62c3b |
| `line-simple-color3`         | <input type="color" value="#fa6a0a" /> | #fa6a0a |
| `line-simple-color4`         | <input type="color" value="#11bb43" /> | #11bb43 |
| `line-simple-color5`         | <input type="color" value="#b974ff" /> | #b974ff |
| `line-simple-color6`         | <input type="color" value="#b3b8c2" /> | #b3b8c2 |
| `line-simple-color7`         | <input type="color" value="#e8f3ff" /> | #e8f3ff |
| `line-simple-color8`         | <input type="color" value="#d6b296" /> | #d6b296 |
| `bar-group-color1`           | <input type="color" value="#1b45b8" /> | #1b45b8 |
| `bar-group-color2`           | <input type="color" value="#4d7fe3" /> | #4d7fe3 |
| `bar-group-color3`           | <input type="color" value="#e8f3ff" /> | #e8f3ff |
| `bar-group-color4`           | <input type="color" value="#0b9f3c" /> | #0b9f3c |
| `bar-group-color5`           | <input type="color" value="#11bb43" /> | #11bb43 |
| `bar-group-color6`           | <input type="color" value="#f5fff5" /> | #f5fff5 |
| `bar-group-color7`           | <input type="color" value="#cf5006" /> | #cf5006 |
| `bar-group-color8`           | <input type="color" value="#fa6a0a" /> | #fa6a0a |
| `bar-group-color9`           | <input type="color" value="#fff5e8" /> | #fff5e8 |
| `bar-group-color10`          | <input type="color" value="#c01b2f" /> | #c01b2f |
| `bar-group-color11`          | <input type="color" value="#e62c3b" /> | #e62c3b |
| `bar-group-color12`          | <input type="color" value="#fff6f5" /> | #fff6f5 |
| `bar-group-color13`          | <input type="color" value="#8426ff" /> | #8426ff |
| `bar-group-color14`          | <input type="color" value="#b974ff" /> | #b974ff |
| `bar-group-color15`          | <input type="color" value="#e7c7ff" /> | #e7c7ff |

## API

### Badge

| 参数    | 说明             | 类型                       | 默认值 |
| ------- | ---------------- | -------------------------- | ------ |
| color   | 色值             | `Theme.ThemeColor\|string` | -      |
| isTable | 是否在表格中使用 | `boolean`                  | -      |

### Tag

| 参数  | 说明 | 类型     | 默认值 |
| ----- | ---- | -------- | ------ |
| color | 色值 | `string` | -      |
