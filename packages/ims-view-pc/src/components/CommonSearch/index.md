---
title: CommonSearch
description:
toc: content
group:
  title: 表单
order: 25
demo:
  cols: 2
---

## CommonSearch 筛选组件

CommonSearch 是一个用于展示筛选列表的组件，适用于展示多个项目的标题和相应的筛选内容。

## 何时使用

- 显示筛选列表，让用户可以筛选出需要的数据。
- 提供一致的筛选列表样式，以保持整体设计风格。
- 允许灵活配置筛选列表内容。

## 示例

<code src='./demo/demo1.tsx'>一个根据屏幕大小 表单自适应 col 的筛选组件</code>

## API

### CommonSearchProps

```ts
export interface CommonSearchProps<Values = AnyObject, Rest = AnyObject, Extra = AnyObject> {
  /**
   * @description
   * TODO: 如果使用 type === 'update' 响应式将出现问题, 暂时自行用state控制表单
   */
  formList?: ICommonSearchType<Values, Rest, Extra>;
  loading?: boolean;
  labelWidth?: number;
  itemBottomHeight?: number;
  collapsed?: boolean;
  accessCollection?: string[];

  onCollapse?: (collapsed: boolean) => void;
  onSearch?: (values: Values) => void;
  onChange?: FormProps<Values>['onFieldsChange'];
  onReset?: (values: Values) => void;

  className?: string;
  children?: React.ReactNode;
}

export type ICommonSearchType<Values = AnyObject, Rest = AnyObject, Extra = AnyObject> = Search<
  Values,
  {
    children?: ICommonSearchType<Values, Rest & CommonSearchFormListCustomType, Extra>;
  } & Rest &
    CommonSearchFormListCustomType
>[];

interface CommonSearchFormListCustomType {
  acpCode?: string;
  visible?: boolean;
  span?: number;
}
```

### CommonSearchHandle

```ts
export type CommonSearchHandle<Values = AnyObject, Rest = AnyObject, Extra = AnyObject> = {
  form: FormInstance<Values>;
  formatValues: (values: Values) => any;
  getRealValues: () => readonly [Values, IFormatSubmitValues<Values>];
};

export type IFormatSubmitValues<Values = AnyObject> = {};
```

### ISearchContext

```ts
export type ISearchContext = {
  spanSize: number;
};
```
