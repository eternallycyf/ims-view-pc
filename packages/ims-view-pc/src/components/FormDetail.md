---
title: 简介
description: 自定义表单
toc: content
group:
  title: 表单
  order: 1
order: 0
demo:
  cols: 2
---

## 简介

### `FormControlType`

- 支持的表单类型

```ts
export const FORM_TYPE_DICT = [
  'input',
  'search',
  'password',
  'textarea',
  'inputNumber',
  'autoComplete',
  'select',
  'checkbox',
  'radio',
  'switch',
  'slider',
  'rate',
  'date',
  'year',
  'quarter',
  'dateRange',
  'month',
  'time',
  'monthRange',
  'editor',
  'custom',
  'view',
  'update', // 动态表单 => shouldUpdate
  'fileUpload',
] as const;
```
