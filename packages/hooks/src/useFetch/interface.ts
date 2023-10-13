import { AxiosRequestConfig } from 'axios';
import { AnyObject } from '../type';

/**
 * @typedef useFetchProps - 描述列表组件
 * @template T - 列表项record
 * @property {useFetchProps['fetchConfig']} fetchConfig - 请求配置
 * @property {(data: T) => T} [dataHandler] - 数据处理函数
 */
export interface useFetchProps<T = Record<string, unknown>> {
  /**
   * @name 请求配置
   * @property {string} apiUrl - 请求地址
   * @property {any} [params] - 请求参数
   * @property {'get' | 'post'} [method='get'] - 请求方法
   * @property {string} [dataPath='data.data'] - 数据路径
   * @property {ReadonlyArray<unknown>} [depts=[]] - 依赖改变时重新请求
   */
  fetchConfig?: {
    apiUrl?: string;
    method?: 'get' | 'post';
    params?: any;
    data?: any;
    dataPath?: string;
    depts?: any[];
  };
  dataHandler?: (data: T) => any;
  initRequest?: boolean;
  request: (config: AxiosRequestConfig) => Promise<any>;
}

export type useFetchState<T = AnyObject> = readonly [
  {
    loading: boolean;
    value: T;
    error: Error | undefined;
  },
  (defaultParams?: any, defaultData?: any) => any,
];
