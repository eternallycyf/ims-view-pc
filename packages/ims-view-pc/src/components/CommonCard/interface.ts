import { useFetchProps, useFetchState } from '@ims-view/hooks';
import { TabsProps } from 'antd';
import { AnyData, ISectionTitle } from 'ims-view-pc';
import { PropsWithChildren } from 'react';
export * from './CardList/interface';

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

/**
 * @typedef ICommonCardProps - 卡片组件
 * @template T - 列表项record
 */
export interface ICommonCardProps<T = Record<string, any>> extends useFetchProps<T> {
  children?: React.ReactNode;
}

/**
 * @name 容器组件
 */
export interface IPageProps {
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  title?: React.ReactNode;
  sectionTitleProps?: ISectionTitle;
}

/**
 * @name 首页卡片
 */
type Item = TabsProps['items'] extends Array<infer Item> ? Item : never;
interface Items extends Item {
  visible: boolean;
}
export interface ICommonCardIndexPageProps<T = any> {
  loading?: boolean;
  header?: React.ReactNode;
  tabProps?: TabsProps;
  tabList?: Items[];
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * @name 锚点卡片
 */
export interface ICommonCardAnchorCardProps<T extends string> {
  btnList: readonly { label: string; value: T }[] | { label: string; value: T }[];
  rightChildren?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}

/**
 * @name 锚点
 */
export interface ICommonCardAnchorLinkProps<T extends string>
  extends React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  id: T;
}

export type IStickyPageProps = PropsWithChildren<{
  loading?: boolean;
  header?: React.ReactNode;
  style?: React.CSSProperties;
  tabProps?: TabsProps;
  tabList?: Items[];
  className?: string;
}>;
