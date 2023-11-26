---
title: 定制主题
order: 0
nav:
  title: 组件
  order: 1
apiHeader: false
---

## 简述

- 与`antd v5`主题配置方法保持统一, 只需要使用 `ConfigProvider` 组件包裹即可
- 具体可参考 antd [主题配置方法](https://ant-design.antgroup.com/docs/react/customize-theme-cn)

<code src="./demo/index.tsx">主题</code>

## 主题色

```less
@blue: #2b5fdc;
@red: #e62c3b;
@orange: #fa6a0a;
@green: #11bb43;
@grey: #b3b8c2;
@purple: #b974ff;
@white: #fff;

@primary-border-color: #bed7f8;
@primary-bg: #e8f3ff;

@blue-bg: #f5f8ff;
@blue-hover: #4d7fe3;
@blue-active: #1b45b8;

@red-bg: #fff6f5;
@red-hover: #eb4f57;
@red-active: #c01b2f;

@orange-bg: #fff5e8;
@orange-hover: #fb8b36;
@orange-active: #cf5006;

@green-bg: #f5fff5;
@green-hover: #33c95b;
@green-active: #0b9f3c;

@grey-bg: #eff1f4;
@grey-hover: #caced7;
@grey-active: #8e96a4;

@purple-bg: #e7c7ff;
@purple-hover: #a04dff;
@purple-active: #8426ff;

@light-blue-bg: #e8f3ff;
@light-blue-hover: #54cfda;
@light-blue-active: #1fb4c2;

@brown-bg: #d6b296;
@brown-hover: #c89979;
@brown-active: #b37a5a;

// 单个折线图
@line-simple-color1: @blue-hover;
@line-simple-color2: @red-hover;
@line-simple-color3: @orange-hover;
@line-simple-color4: @green-hover;
@line-simple-color5: @purple-hover;
@line-simple-color6: @grey-hover;
@line-simple-color7: @light-blue-hover;
@line-simple-color8: @brown-hover;

// 多组柱形图
@bar-group-color1: @blue-active;
@bar-group-color2: @blue;
@bar-group-color3: @blue-hover;
@bar-group-color4: @green-active;
@bar-group-color5: @green;
@bar-group-color6: @green-hover;
@bar-group-color7: @orange-active;
@bar-group-color8: @orange;
@bar-group-color9: @orange-hover;
@bar-group-color10: @red-active;
@bar-group-color11: @red;
@bar-group-color12: @red-hover;
@bar-group-color13: @purple-active;
@bar-group-color14: @purple;
@bar-group-color15: @purple-hover;

// 高度
@control-height: 26px;
@text-color: #5b6371;
@text-disabled-color: @grey-hover;
// font-weight: 600
@text-disabled-weight-color: @text-color;

// badge
@start: @blue-hover;
@approve: @blue;
@success: @green;
@finish: @grey;
@error: @red;
@draft: @primary-border-color;
```
