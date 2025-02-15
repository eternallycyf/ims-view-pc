import { TableProps, type TablePaginationConfig } from 'antd';
import type { SortOrder, TableRowSelection } from 'antd/lib/table/interface';
import {
  AnyObject,
  IColumnsType,
  Merge,
  SnakeCase,
  WithNativeStyle,
  type IButtonProps,
} from 'ims-view-pc';
import type { Dispatch, SetStateAction } from 'react';

export type AnyData = Record<string, unknown>;

//#region request
export type RequestData<DataType = AnyData> = {
  data: DataType[];
  summaryData?: DataType[];
  success: boolean;
  total: number;
};
export type RequestParams<Params = AnyData> = Params & {
  page: number;
  pageSize: number;
};
export type RequestSorter<DataType = AnyData> = {
  order: SortOrder;
  sorter: SnakeCase<keyof DataType & string>;
};

type Request<DataType = AnyData, Params = AnyData> = (
  params: RequestParams<Params>,
  sorter?: RequestSorter<DataType>,
) => Promise<Partial<RequestData<DataType>>>;
//#endregion

export interface ICommonTableContext {
  loading: boolean;
}

export type CommonTableItemButtonType<Rest extends AnyObject> = IButtonProps<Rest>;

/**
 * @typedef CommonTableProps
 * @template DataType - dataIndex[]
 * @template Params - 额外的查询参数
 * @template Rest - column自己拓展的参数
 */
export interface CommonTableProps<DataType = AnyData, Params = AnyData, Rest = AnyData>
  extends Omit<TableProps<DataType>, 'columns' | 'style'> {
  //-----------------------------style-----------------------------------
  /**
   * @name 主题
   * @type {'light' | 'dark'}
   * @default 'light'
   */
  theme?: 'light' | 'dark';
  /**
   * @name 最外层容器的className
   * @type {string}
   * @default 'common-table-wrap'
   */
  wrapperClassName?: string;
  /**
   * @name style
   * @type {WithNativeStyle<'--alternateColor'>}
   * @property {string} [alternateColor='#fafafa'] - 奇偶行颜色
   */
  style?: WithNativeStyle<'--alternateColor'>;

  //-----------------------------request---------------------------------
  /**
   * @name loading
   * @description 当不传入时 以request的异步状态自动判断
   */
  loading?: boolean;
  /**
   * @name 数据
   * @description 传入后 request initRequest loading 将不会生效
   * 当request不存在时不生效
   */
  dataSource?: DataType[];
  /**
   * @name 初始化是否请求
   * @type {boolean}
   * @default true
   */
  initRequest?: boolean;
  /**
   * @name 额外的参数
   * @description 会覆盖其他参数
   */
  params?: Params & AnyData;
  /**
   * @name 默认的参数
   */
  defaultParams?: Params & AnyData;
  /**
   * @name 网络请求数据
   * @param {RequestParams<Params>} params - 请求参数
   * @param {RequestSorter<DataType>} sorter - 排序参数 默认自动驼峰转下划线
   * @returns {Promise<Partial<RequestData<DataType>>>} - 返回
   * @example <caption>请求数据</caption>
   * (params, sorter) => {
   *   return new Promise((resolve) => {
   *     setTimeout(() => {
   *      resolve({
   *        data: [],
   *        // success请返回true 不然table 会停止解析数据即使有数据
   *        success: true,
   *        // 不传会使用 data 的长度，如果是分页一定要传
   *        total: 0,
   *     });
   *   });
   * }
   */
  searchParams?: RequestParams<Params>;
  setSearchParams?: Dispatch<SetStateAction<RequestParams<Params>>>;
  request?: Request<DataType, Params>;
  /**
   *
   * @param {Merge<{ index: number; rowKey: string }, DataType>[]} data - 请求返回后包装了index rowKey的数据
   * @param {(DataType & string)[]} dataSource - 请求返回的原始数据
   * @returns {any[]} - 返回处理后的数据
   */
  dataHandler?: (
    data: Merge<{ index: number; rowKey: string }, DataType>[],
    dataSource: (DataType & string)[],
  ) => any[];
  /**
   *
   * @param {Merge<{ index: number; rowKey: string }, DataType>[]} data - 请求返回后包装了index rowKey的数据
   * @param {(DataType & string)[]} dataSource - 请求返回的原始数据
   * @returns {any[]} - 返回处理后的数据
   */
  summaryDataHandler?: (
    data: Merge<{ index: number; rowKey: string }, DataType>[],
    dataSource: (DataType & string)[],
  ) => any[];
  //-----------------------------core---------------------------------
  columns: IColumnsType<DataType, Rest>;
  rowKey?: keyof DataType & string;
  //-----------------------------pagination---------------------------------
  defaultPageSize?: number;
  /**@name 分页相关配置 */
  pagination?: TablePaginationConfig | false;
  //-----------------------------config--------------------------------
  /**@name 是否使用虚拟列表*/
  isVirtual?: boolean;
  /**@name 是否显示排序的tooltip */
  showSorterTooltip?: boolean;
  //-----------------------------operation------------------------------
  /**
   * @description 权限点
   */
  accessCollection?: string[];
  /**@name 手动指定操作栏宽度 */
  itemButtonWidth?: number;
  itemButton?:
    | CommonTableItemButtonType<Rest>[]
    | ((text: any, record: DataType, index: number) => CommonTableItemButtonType<Rest>[]);
  /**@name table左上的按钮 */
  buttonLeft?: IButtonProps[];
  /**@name table右上的按钮 */
  buttonRight?: IButtonProps[];
  //-----------------------------render--------------------------------
  /**@name 页脚 */
  footer?: (data: DataType[]) => React.ReactNode;
  /**@name 头部 */
  title?: (data: DataType[]) => React.ReactNode;
  children?: React.ReactNode;
  //-----------------------------extra--------------------------------
  /**@name 额外操作配置*/
  rowSelection?: TableRowSelection<DataType>;
  selectedRows?: DataType[];
  /**@name 指定选中项的key数组*/
  selectedRowKeys?: React.Key[];
  /**@name 多选／单选 */
  selectType?: 'checkbox' | 'radio' | boolean;
  /**@name 选择时候触发 */
  onSelect?: (selectRowKeys: React.Key[], selectedRows: DataType[]) => any;
  expandable?: TableProps<DataType>['expandable'];
  /**
   * @example <caption>固定行方式2. 通过调用后端接口 后端有一个和列表一样的接口</caption>
   * 通过 antd.summary(新建了一个table) 来实现固定化
   * 使用条件:
   * 1. 需要后端接口 或者自己mock数据支持 (后端接口是 urlAlls(多传了一个isAmounted) ,自己可以传入summaryDataSource:any[])
   * 2. 自定义固定单元格的内容 columns.userSummary(content: string, data: any[]) 方法自定义
   * 3. removeSummary 需要排除的合计项 (直接显示'--'了)
   */
  isSummary?: boolean;
  summaryDataSource?: DataType[];
  /**
   * @default [summaryPosition='top']
   */
  summaryPosition?: 'top' | 'bottom';
  /**@name 需要排除的合计项  */
  removeSummary?: (keyof DataType & string)[];
  //-----------------------------other---------------------------------
  // /**@name 是否计算列表高度 */
  // calcHeight?: boolean;
  // /**@name 其他的高度 */
  // otherHeight?: number;
}

type CustomFn<DataType = AnyData, Params = AnyData, Rest = AnyData> = (
  searchParams?: RequestParams<Params>,
  pagination?: { current: number; pageSize: number },
  sorter?: RequestSorter<DataType>,
) => [
  searchParams?: RequestParams<Params> & {
    [props: string]: any;
  },
  pagination?: { current: number; pageSize: number },
  sorter?: RequestSorter<DataType>,
];

/**
 * @typedef CommonTableRef
 * @template DataType - dataIndex[]
 * @template Params - 额外的查询参数
 * @template Rest - column自己拓展的参数
 *
 * @property {CustomFn<DataType, Params, Rest>} handleRefreshPage - 刷新页面
 * @returns {Promise<DataType[]>} - 返回处理后的数据
 * @example <caption>刷新页面</caption>
 * handleRefreshPage();
 * @example <caption>刷新页面并自定义请求参数</caption>
 * handleRefreshPage((searchParams, pagination, sorter) => {
 * return {
 *  ...searchParams,
 * ...pagination,
 * ...sorter,
 * };
 */
export type CommonTableRef<DataType = AnyData, Params = AnyData, Rest = AnyData> = {
  handleRefreshPage: (
    customFn?: CustomFn<DataType, Params, Rest>,
  ) => Promise<[DataType[], DataType[]]>;
  getSearchParams: () => RequestParams<Params>;
  getPagination: () => TablePaginationConfig;
  getSorter: () => RequestSorter<DataType>;
  getDataSource: () => [DataType[], DataType[]];
};
