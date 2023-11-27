import { FormItemProps } from 'antd';
import { Method } from 'axios';
import {
  AnyObject,
  IBaseCustomFormItemProps,
  ICascadeControlProps,
  IEditorProps,
  ISimpleControlProps,
  IUpdateControlProps,
} from 'ims-view-pc';
import { Search } from '.';

export const FORM_TYPE_DICT = [
  'input',
  'password',
  'search',
  'textarea',
  'inputNumber',

  'checkbox',
  'radio',
  'rate',
  'slider',
  'switch',

  'year',
  'quarter',
  'month',
  'time',
  'date',
  'dateRange',
  'monthRange',

  'autoComplete',
  'cascader',
  'select',

  'editor',
  'update',
  'custom',
] as const;

export type FormControlType = (typeof FORM_TYPE_DICT)[number];

export type ItemProps<Values, Rest, Extra> = FormItemProps<Values> & {
  next?: IUpdateControlProps<Values, Rest, Extra>['itemProps']['next'];
};

export interface IFetchConfig<Record = AnyObject> {
  request?: () => Promise<Record>;
}

export type Dict = ReadonlyArray<{
  label?: string;
  value?: string | number;
  disabled?: boolean;
  children?: Array<Dict>;
  rules?: any[];
  placeholder?: string;
  onChange?: (...args: any[]) => any;
}>;

/*---------------------IControlProps--------------------------------- */

export interface IBaseControlProps<Values = AnyObject, Rest = AnyObject, Extra = unknown>
  extends Pick<
    Search<Values, Rest, Extra>,
    'fetchConfig' | 'itemProps' | 'dict' | 'Component' | 'label'
  > {}

export type IControlProps<
  Values = AnyObject,
  Rest = AnyObject,
  Extra = unknown,
> = IBaseControlProps<Values, Rest, Extra> &
  IEditorProps['controlProps'] &
  ISimpleControlProps<Values>['controlProps'] &
  ICascadeControlProps<Values>['controlProps'];
