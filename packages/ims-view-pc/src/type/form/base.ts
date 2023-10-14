import { FormItemProps } from 'antd';
import { Method } from 'axios';

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

export interface IControlProps {
  fetchConfig?: IFetchConfig;
  itemProps?: FormItemProps;
  dictConfig?: { textKey: string; valueKey: string };
  Component?: any;
  dict?: ReadonlyArray<{
    text: string;
    value: string | number;
    disabled?: boolean;
    children?: Array<{ text: string; value: string; disabled?: boolean }>;
    rules?: any[]; //校验规则
    placeholder?: string;
    onChange?: (...args: any[]) => any;
    [propName: string]: any;
  }>;
  [propName: string]: any;
}
