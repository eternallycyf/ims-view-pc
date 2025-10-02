import { FormItemProps } from 'antd';
import {
  AnyObject,
  IBaseCustomFormItemProps,
  ICascadeControlProps,
  IEditorProps,
  IFileUploadControlProps,
  IMentionsControlProps,
  ISimpleControlProps,
  type Attachment,
  type Next,
} from 'ims-view-pc';
import type { SelectControlProps } from 'ims-view-pc/components/CustomForm/interface';
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

  'time',
  'date',
  'week',
  'month',
  'quarter',
  'year',
  'timeRange',
  'dateRange',
  'weekRange',
  'monthRange',
  'quarterRange',
  'yearRange',

  'autoComplete',
  'cascader',
  'select',
  'mentions',
  'upload',

  'editor',
  'update',
  'custom',
] as const;

export type FormControlType = (typeof FORM_TYPE_DICT)[number];

export type ItemProps<Values, Rest, Extra> = FormItemProps<Values> & {
  next?: Next<Values, Rest, Extra, Values>;
};

export interface IFetchConfig<Record = AnyObject> {
  request?: (params?: any) => Promise<Record>;
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

export interface IBaseControlProps<Values = AnyObject, Rest = AnyObject, Extra = FormControlType>
  extends Pick<
    Search<Values, Rest, Extra>,
    'fetchConfig' | 'itemProps' | 'dict' | 'Component' | 'label'
  > {}

export type IControlProps<
  Values = AnyObject,
  Rest = AnyObject,
  Extra = FormControlType,
> = IBaseControlProps<Values, Rest, Extra> &
  IEditorProps['controlProps'] &
  ISimpleControlProps<Values>['controlProps'] &
  ICascadeControlProps<Values>['controlProps'] &
  IMentionsControlProps<Values>['controlProps'] &
  IFileUploadControlProps<Attachment[]>['controlProps'] &
  SelectControlProps<Values>['controlProps'];
