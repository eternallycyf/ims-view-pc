---
title: CommonCard
description: 卡片布局
toc: content
group:
  title: 布局
  order: 1
demo:
  cols: 2
---

```ts
import { CommonCard } from 'ims-view-pc';
const { IndexPage, Link, AnchorCard, AnchorLink, CardList } = CommonCard;
```

## CommonCard.CardList

<code src='./demo/cardList.tsx' description="这是一个卡片列表">卡片列表</code>

## CommonCard.IndexPage

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

- demo 在新窗口打开, 根节点设置 `height=固定长度或者 100vh` 就可以看到效果了

<code transform="true"  src='./demo/indexPage.tsx' description="在新窗口打开, 根节点设置 height=固定长度或者100vh 就可以看到效果了">布局</code>

## API

## CommonCard

### `ICommonDemoHandle<T = any>`

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

### ICommonCardProps

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

## CommonCard.CardList

### ICardListHandle

| 属性      | 说明     | 类型                                                       | 默认值 |
| --------- | -------- | ---------------------------------------------------------- | ------ |
| fetchData | 请求数据 | `(defaultParams?: any, defaultData?: any) => Promise<T[]>` | -      |

### ICardListProps

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

## CommonCard.IndexPage

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

### ICommonCardIndexPageProps

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

## CommonCard.AnchorCard

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

## CommonCard.AnchorLink

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

## CommonCard.Line

- 一条分割线