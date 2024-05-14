---
title: CommonCard
description: 卡片布局
toc: content
group:
  title: 布局
  order: 2
demo:
  cols: 2
---

## CommonCard 通用卡片

CommonCard 是一个通用的卡片组件，用于展示各种内容，提供灵活的配置选项。

### 何时使用

- 展示信息卡片，如文章卡片、产品卡片等。
- 提供一致的卡片样式，以保持整体设计风格。
- 允许灵活配置卡片内容和样式。

### 如何使用

在需要显示通用卡片的地方引入 `CommonCard` 组件，并传入相应的内容和配置项。例如：

```ts
import { CommonCard } from 'ims-view-pc';
const { Page, IndexPage, Link, AnchorCard, AnchorLink, CardList } = CommonCard;
```

## 示例

### Page

<code src='./demo/page.tsx' ></code>

### CardList

<code src='./demo/cardList.tsx' ></code>

### IndexPage

全景页面会出现很多滚动条的情况 这里封装了一个全景组件 将锚点和滚动条进行了处理
头部区域是固定的 同时保证页面只出现一个滚动条 使用 `flex` 实现

```less
// 只显示一个滚动条 固定头部
// 如果层级更多 需要滚动条的容器都需要加 height: 100%;
.page {
  height: 100%;

  .card {
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
      flex: none;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      height: 100%;
    }
  }
}
```

也可以自行使用 `position: sticky` 进行实现

<code transform="true"  src='./demo/indexPage.tsx'></code>

### StickyPage

<code src='./demo/sticky.tsx' ></code>

## API

### CommonCard

#### `ICommonDemoHandle<T = any>`

```ts
/**
 * @typedef ICommonCardHandle - 卡片组件
 * @template T - record
 * @property {(defaultParams?: any, defaultData?: any) => Promise<T[]>} fetchData - 请求数据
 * @example <caption>fetchData</caption>
 * await CommonCardRef.current?.fetchData({ kw: 1 }, { num: 2 });
 */
export type ICommonCardHandle<T = Record<string, any>> = {
  fetchData: useFetchState<T>['1'];
  data: T;
  loading: boolean;
};
```

| 属性      | 说明     | 类型                                                       | 默认值 |
| --------- | -------- | ---------------------------------------------------------- | ------ |
| fetchData | 请求数据 | `(defaultParams?: any, defaultData?: any) => Promise<T[]>` | -      |
| data      | 数据     | `T`                                                        | -      |
| loading   | 加载状态 | `boolean`                                                  | -      |

#### ICommonCardProps

```ts
/**
 * @typedef ICommonCardProps - 卡片组件
 * @template T - 列表项record
 */
export interface ICommonCardProps<T = Record<string, any>> extends useFetchProps<T> {
  children?: React.ReactNode;
}
```

| 属性     | 说明   | 类型              | 默认值 |
| -------- | ------ | ----------------- | ------ |
| children | 子组件 | `React.ReactNode` | -      |

### Page

| 属性      | 说明     | 类型                  | 默认值 |
| --------- | -------- | --------------------- | ------ |
| loading   | 加载状态 | `boolean`             | -      |
| className | 类名     | `string`              | -      |
| style     | 样式     | `React.CSSProperties` | -      |
| children  | 子组件   | `React.ReactNode`     | -      |
| title     | 标题     | `React.ReactNode`     | -      |

### CardList

#### ICardListHandle

| 属性      | 说明     | 类型                                                       | 默认值 |
| --------- | -------- | ---------------------------------------------------------- | ------ |
| fetchData | 请求数据 | `(defaultParams?: any, defaultData?: any) => Promise<T[]>` | -      |

#### ICardListProps

```ts
/**
 * @typedef ICardListProps - 卡片列表组件
 * @template T - 列表项record
 *
 * @property {string} [title] - 标题
 * @property {React.ReactNode} [extra] - 额外的内容
 * @property {string} [rowKey='index'] - 列表项的key
 * @property {number} [column=3] - 每行的个数
 * @property {CardProps['actions']} [actions] - 卡片的操作
 * @property {ListProps<T>['renderItem']} [renderItem] - 列表项的渲染函数
 *
 * @property {ICardListProps['fetchConfig']} [fetchConfig] - 请求配置
 *
 * @property {CardProps} [cardProps] - 卡片的属性
 * @property {ListProps<T>} [listProps] - 列表的属性
 * @property {PaginationProps} [paginationProps] - 分页的属性
 */
export interface ICardListProps<T = AnyObject> extends useFetchProps<T[]> {
  title?: string;
  extra?: React.ReactNode;
  /**
   * @name 列表项的key
   * @default index
   */
  rowKey?: string;
  column?: number;
  actions?: CardProps['actions'];
  renderItem?: ListProps<T>['renderItem'];

  cardProps?: CardProps;
  listProps?: ListProps<T>;
  /**
   * @name 分页的属性
   * @property {PaginationProps} [paginationProps = { pageSize: 9 }]
   */
  paginationProps?: PaginationProps;
}
```

| 属性            | 说明      | 类型              | 默认值            |
| --------------- | --------- | ----------------- | ----------------- |
| title           | 标题      | `string`          | -                 |
| extra           | 额外内容  | `React.ReactNode` | -                 |
| rowKey          | 列表项 id | `string`          | `index`           |
| column          | 每行个数  | `number`          | `3`               |
| actions         | 操作      | `CardProps`       | -                 |
| renderItem      | 渲染函数  | `ListProps<T>`    | -                 |
| cardProps       | 卡片属性  | `CardProps`       | -                 |
| listProps       | 列表属性  | `ListProps<T>`    | -                 |
| paginationProps | 分页属性  | `PaginationProps` | `{ pageSize: 9 }` |

### IndexPage

```ts
/**
 * @name 首页卡片
 */
export interface ICommonCardIndexPageProps<T = any> {
  loading?: boolean;
  header?: React.ReactNode;
  tabProps?: TabsProps;
  tabList?: Items[];
  children?: React.ReactNode;
}
```

#### ICommonCardIndexPageProps

| 属性     | 说明     | 类型              | 默认值 |
| -------- | -------- | ----------------- | ------ |
| loading  | 加载状态 | `boolean`         | -      |
| header   | 头部     | `React.ReactNode` | -      |
| tabProps | tabProps | `TabsProps`       | -      |
| tabList  | tabList  | `Items[]`         | -      |
| children | 子组件   | `React.ReactNode` | -      |

### tabList

```ts
type Item = TabsProps['items'] extends Array<infer Item> ? Item : never;
interface Items extends Item {
  visible: boolean;
}
```

### AnchorCard

```ts
/**
 * @name 锚点卡片
 */
export interface ICommonCardAnchorCardProps<T extends string> {
  btnList: readonly { label: string; value: T }[] | { label: string; value: T }[];
  rightChildren?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}
```

| 属性          | 说明          | 类型                                     | 默认值 |
| ------------- | ------------- | ---------------------------------------- | ------ |
| btnList       | 锚点列表      | `readonly { label: string; value: T }[]` | -      |
| rightChildren | 右侧组件      | `React.ReactNode`                        | -      |
| children      | 子组件        | `React.ReactNode`                        | -      |
| id            | 锚点父节点 id | `string`                                 | -      |

### AnchorLink

```ts
/**
 * @name 锚点
 */
export interface ICommonCardAnchorLinkProps<T extends string>
  extends React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  id: T;
}
```

| 属性 | 说明      | 类型 | 默认值 |
| ---- | --------- | ---- | ------ |
| id   | 子锚点 id | `T`  | -      |

### Line

- 一条分割线

## FQA

### 1.[粘性定位显示不出来](https://stackoverflow.com/questions/47723554/why-is-my-positionsticky-not-working)

```less
.parent {
  display: initial;
  .header {
    position: sticky;
    top: 1px;
  }
}
```

### 1. [粘性点位如何监听何时触发](https://stackoverflow.com/questions/16302483/event-to-detect-when-positionsticky-is-triggered)
