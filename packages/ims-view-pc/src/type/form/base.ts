import { FormItemProps } from 'antd';
import { Method } from 'axios';
import { IEditorProps } from 'ims-view-pc/components/CustomForm/FormItem/editor';
import { ISimpleControlProps } from 'ims-view-pc/components/CustomForm/FormItem/simple';
import { AnyObject } from '../type';
import { IFieldComponentTypeParams } from './fieldCompType';

const FORM_TYPE_DICT = [
  'input',
  'search',
  'password',
  'textarea',
  'inputNumber',
  'autoComplete',
  'select',
  'checkbox',
  'radio',
  'switch',
  'slider',
  'rate',
  'date',
  'year',
  'quarter',
  'dateRange',
  'month',
  'time',
  'monthRange',
  'editor',
  'custom',
  'view',
  'update', // 动态表单 => shouldUpdate
  'fileUpload',
] as const;

export type FormControlType = (typeof FORM_TYPE_DICT)[number];

export type ItemProps = FormItemProps;

export interface IFetchConfig {
  apiUrl: string;
  method?: Method;
  params?: any;
  searchKey?: string;
  dataPath?: string;
  initDictFn?: (record: any) => any[];
}

export type Dict = ReadonlyArray<{
  label?: string;
  value?: string | number;
  disabled?: boolean;
  children?: Array<{ text: string; value: string; disabled?: boolean }>;
  rules?: any[]; //校验规则
  placeholder?: string;
  onChange?: (...args: any[]) => any;
}>;

/*---------------------IControlProps--------------------------------- */

export interface IBaseControlProps<Values = AnyObject, Rest = AnyObject, Extra = unknown>
  extends Pick<
    IFieldComponentTypeParams<Values, Rest, Extra>,
    'fetchConfig' | 'itemProps' | 'dict' | 'Component' | 'renderItem'
  > {}

export type IControlProps = IBaseControlProps &
  IEditorProps['controlProps'] &
  ISimpleControlProps['controlProps'];
