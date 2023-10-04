import { useFetchProps, useFetchState } from '@ims-view/hooks';

/**
 * @typedef ICommonDemoHandle - demo组件
 * @template T - 列表项record
 * @property {(defaultParams?: any, defaultData?: any) => Promise<T[]>} fetchData - 请求数据
 * @example <caption>fetchData</caption>
 * await CommonDemoRef.current?.fetchData({ kw: 1 }, { num: 2 });
 */
export type ICommonDemoHandle<T = Record<string, any>> = {
  fetchData: useFetchState<T>['1'];
  data: T;
  loading: boolean;
};

/**
 * @typedef ICommonDemoProps - demo组件
 * @template T - 列表项record
 */
export interface ICommonDemoProps<T = Record<string, any>> extends useFetchProps<T> {
  children?: React.ReactNode;
}

export interface ICommonDemoItemProps<T = any> {}
