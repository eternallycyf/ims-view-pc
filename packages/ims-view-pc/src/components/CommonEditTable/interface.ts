import { Form, FormInstance, FormItemProps, TableProps } from 'antd';
import { FormListProps } from 'antd/es/form';
import {
  Column,
  FormControlType,
  IBaseButtonProps,
  IButtonItemProps,
  ISearchesType,
  IUpdateControlProps,
  Search,
} from 'ims-view-pc';
import React from 'react';
import './index.less';
import { IHandleExport } from './utils';

// #region
/**
 * @typedef {Object} IEditTableContext context
 * @property {FormInstance} form - form实例
 * @property {FormListOperation<Values>} operation - formList的操作
 * @property {Values[]} values - formList的值
 * @template Values -
 * @template FormItemsValues -
 */
export interface IEditTableContext<Values = any, FormItemsValues = any>
  extends ICommonEditTableHandle<Values, FormItemsValues> {
  operation: FormListOperation<Values>;
  values: Values[] | [] | undefined;
}

/**
 * 通用编辑表格
 * @typedef {Object} ICommonEditTableProps
 * @property {FormInstance} form - form实例
 * @property {string} [status='edit'] - 编辑状态
 * @property {boolean} [showIndex=true] - 是否显示序号
 * @property {boolean} [isVirtual=false] - 是否是虚拟列表虚拟列表 必须传入 scroll.y 高度
 * @property {boolean} [isMultiple=true] - 是否是实时保存类型 为false时 editable = true 才会可编辑
 * @property {string[]} [editableKeys] - 可编辑的key
 * @property {number} [itemButtonWidth=undefined] - 每一行的操作按钮的宽度 默认自适应
 * @property {any} [curryParams] - 柯里化函数入参
 *
 * @property {React.ReactNode | ((value: IEditTableContext) => React.ReactNode)} [beforeChildren] - 表格前面的内容
 * @property {React.ReactNode | ((value: IEditTableContext) => React.ReactNode)} [afterChildren] - 表格后面的内容
 *
 * @property {TableProps} [tableProps] - table的props
 * @property {IGetColumns} columns - table的columns
 * @property {IEditTableButtonProps} [itemButton] - 每一行的操作按钮
 * @property {IEditTableNotItemButtonProps} [buttonLeft] - 表格左边的按钮
 * @property {IEditTableNotItemButtonProps} [buttonRight] - 表格右边的按钮
 * @property {IEditTableNotItemButtonProps} [buttonBottomLeft] - 表格底部左边的按钮
 * @property {IEditTableNotItemButtonProps} [buttonBottomRight] - 表格底部右边的按钮
 *
 * @property {string} [name='EditTable'] - formList的name
 * @property {React.ComponentProps<typeof Form.List>} [formListProps] - formList的props
 * @property {any[]} [initialValues] - formList的initialValues
 * @property {React.ComponentProps<typeof Form.List>['rules']} [rules] - formList的rules
 * @template Values - 表单name
 * @template Rest - 其他自定义的参数 => (columnsType & Rest)[]
 */
export interface ICommonEditTableProps<
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  FormItemsValues = Record<string, unknown>,
> {
  /**@name 基础配置 */
  form: FormInstance<FormItemsValues>;
  status?: 'view' | 'edit';
  showIndex?: boolean;
  isVirtual?: boolean;
  isMultiple?: boolean;
  editableKeys?: string[];
  itemButtonWidth?: number;
  curryParams?: any;

  /**@name 其他内容配置 */
  beforeChildren?:
    | React.ReactNode
    | ((value: IEditTableContext<Values, FormItemsValues>) => React.ReactNode);
  afterChildren?:
    | React.ReactNode
    | ((value: IEditTableContext<Values, FormItemsValues>) => React.ReactNode);

  /**@name table配置 */
  tableProps?: TableProps<Values>;
  columns: ReturnType<IGetColumns<Values, Rest, FormItemsValues>>;
  itemButton?: IEditButtonProps<Values, true>[];
  buttonLeft?: IEditButtonProps<Values>[];
  buttonRight?: IEditButtonProps<Values>[];
  buttonBottomLeft?: IEditButtonProps<Values>[];
  buttonBottomRight?: IEditButtonProps<Values>[];

  /**@name formList 配置 */
  name?: FormListProps['name'];
  formListProps?: React.ComponentProps<typeof Form.List>;
  initialValues?: Values[];
  /**
   * @description 必须 button.htmlType === 'submit' 才能触发
   */
  rules?: React.ComponentProps<typeof Form.List>['rules'];
}

/**
 * @name 通用编辑表格ref获取的方法
 */
export type ICommonEditTableHandle<Values = any, FormItemsValues = any> = {
  form: FormInstance<FormItemsValues>;
  status: ICommonEditTableProps['status'];
};

/**
 * @name 通用编辑表格的列的额外参数
 */
export interface IColumnEditRestProps<Values> {
  type?: FormControlType;
  label?: ISearchesType[number]['label'];
  name?: Values;
}

/**
 * @name columns
 * 只有 type === 'custom' || item.transform && status == 'view' 时 render 才会生效
 * item.transform ? item.transform : item.render
 * @Values 每一行的 record
 * @description FormValues 所有表单的values
 */
export type ICommonEditTableColumnsType<
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  FormValues = Record<string, unknown>,
> = Omit<Column<Values>, 'formItemProps' | 'render'> & {
  /**@name 是否有必填标记 */
  hasRequiredMark?: boolean;
  formItemProps?: Omit<
    Search<Values, Rest>,
    'name' | 'label' | 'type' | 'controlProps' | 'itemProps'
  > & {
    rules?: FormItemProps<Values>['rules'];
    controlProps?: Partial<Search['controlProps']>;
    itemProps?: Omit<Search<FormValues, Rest>['itemProps'], 'shouldUpdate' | 'next'> & {
      shouldUpdate?: FormItemProps<FormValues>['shouldUpdate'];
      next?: IUpdateControlProps<Values, Rest, unknown, FormValues>['itemProps']['next'];
    };
  };
  render?: (value: any, record: Values, index: number, allValues: Values[]) => React.ReactNode;
  /**
   * @name 自定义转换的方法
   * @name status === 'view' | !editable 状态时 展示数据转换 和render一样 只不过为了使用formatCoumn的方法 用这个代替render
   * @example <caption>自定义转换的方法</caption>
   * transform: (text, record, index, allValues) => text + '元'
   */
  transform?: (text: any, record: Values, index: number, allValues: Values[]) => React.ReactNode;
} & Rest &
  IColumnEditRestProps<Values>;

//#endregion

// #region 内部 interface
export interface FormListOperation<Values = any> {
  add: (defaultValue?: Values, insertIndex?: number) => void;
  remove: (index: number | number[]) => void;
  move: (from: number, to: number) => void;
}
export interface IRenderFnProps<Values> {
  record: Values;
  arr: Values[];
  index: number;
}
export type IEditButtonFunction<
  Values = Record<string, unknown>,
  IsItemBtn extends boolean = false,
> = (
  renderProps: IsItemBtn extends true ? IRenderFnProps<Values> : undefined,
  operation: FormListOperation<Values>,
  status: ICommonEditTableProps['status'],
  value: any,
) => any;

export type IHandleGroupValueOnChange<
  Values = Record<string, unknown>,
  IsItemBtn extends boolean = false,
> = (
  renderProps: IsItemBtn extends true ? IRenderFnProps<Values> : undefined,
  operation: FormListOperation<Values>,
  status: ICommonEditTableProps['status'],
  value: Parameters<IButtonItemProps['handleGroupValueOnChange']>,
) => any;

export interface IEditButtonItemProps<
  Values = Record<string, unknown>,
  IsItemBtn extends boolean = false,
> extends Omit<
    IButtonItemProps,
    'buttonProps' | 'handleDeleteConfirm' | 'handleGroupValueOnChange'
  > {
  buttonProps?: Omit<IButtonItemProps['buttonProps'], 'onClick'> & {
    /**
     * @name 按钮的点击事件
     * @param {IRenderFnProps<Values>} renderProps - 当前行的值
     * @param {FormListOperation<Values>} operation - formList的操作
     * @param {ICommonEditTableProps['status']} status - 当前编辑状态
     * @param {any} value - 点击事件 Event
     */
    onClick?: IEditButtonFunction<Values, IsItemBtn>;
  };
  handleDeleteConfirm?: IEditButtonFunction<Values, IsItemBtn>;
  handleGroupValueOnChange?: IHandleGroupValueOnChange<Values, IsItemBtn>;
}
export interface IBaseEditButtonProps<
  Values = Record<string, unknown>,
  IsItemBtn extends boolean = false,
> extends Omit<IBaseButtonProps, 'visible' | 'itemProps'> {
  visible?:
    | boolean
    | ((
        renderProps: IsItemBtn extends true ? IRenderFnProps<Values> : undefined,
        operation: FormListOperation<Values>,
        status: ICommonEditTableProps['status'],
      ) => boolean);
  itemProps?: IEditButtonItemProps<Values, IsItemBtn>;
}

/**
 * 支持柯里化形式 (renderProps,...) => (curryParams) => ({ type:'default',...})
 */
export type IEditButtonProps<Values = Record<string, unknown>, IsItemBtn extends boolean = false> =
  | IBaseEditButtonProps<Values, IsItemBtn>
  | ((
      renderProps: IRenderFnProps<Values>,
      operation: FormListOperation<Values>,
      status: ICommonEditTableProps['status'],
    ) =>
      | IBaseEditButtonProps<Values, IsItemBtn>
      | ((
          ...arg: { editableKeys: string[]; [props: string]: any }[]
        ) => IBaseEditButtonProps<Values, IsItemBtn>));

export type IGetColumns<
  Values = any,
  Rest = Record<string, unknown>,
  FormItemsValues = Record<string, unknown>,
> = (
  operation: FormListOperation<Values>,
  status: ICommonEditTableProps['status'],
) => ICommonEditTableColumnsType<Values, Rest, FormItemsValues>[];
//#endregion
