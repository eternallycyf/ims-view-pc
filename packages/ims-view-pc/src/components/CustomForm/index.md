---
title: CustomForm
description: CustomForm
toc: content
group:
  title: 表单
  order: 1
demo:
  cols: 2
---

## CustomForm

## FormControlType

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

<code src='./demo/index.tsx'>demo<code>
