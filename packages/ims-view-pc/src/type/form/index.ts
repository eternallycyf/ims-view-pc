import { FormInstance, FormItemProps } from 'antd';
import dayjs from 'dayjs';
import { AddIndexSignature, AnyObject, IUpdateControlProps, ValueOf } from 'ims-view-pc';
import {
  Dict,
  type FormControlType,
  type IControlProps,
  type IFetchConfig,
  type ItemProps,
} from './base';
import { IBaseCustomFormItemProps } from './formItem';

export type NameKey<Values = AnyObject> = (keyof Values & string) | [number, keyof Values & string];

export interface IBaseFormControl<Values = AnyObject, Rest = AnyObject, Extra = unknown> {
  form?: FormInstance<Values>;
  name?: NameKey<Values>;
  label?: React.ReactNode;
  type?: FormControlType;
  initialValue?:
    | ValueOf<Values>
    | AddIndexSignature<ValueOf<Values>>
    | string
    | number
    | { key: any }
    | { label: any; value: any }
    | dayjs.Dayjs
    | [dayjs.Dayjs, dayjs.Dayjs];
  record?: AddIndexSignature<Values>;
  dict?: Dict;

  fetchConfig?: IFetchConfig<any>;
  controlProps?: IControlProps<Values, Rest, Extra>;
  itemProps?: ItemProps<Values, Rest, Extra>;

  Component?: (
    props: IControlProps & {
      form: FormInstance<Values>;
      name: NameKey<Values>;
      value: any;
      onChange: (...args: any[]) => any;
      record: AddIndexSignature<Values>;
      dict: Dict;
      type: FormControlType;
    },
  ) => React.ReactNode;
}

export type Search<Values = AnyObject, Rest = AnyObject, Extra = unknown> = IBaseFormControl<
  Values,
  Rest,
  Extra
> &
  Rest;

export type FieldCompType = {
  <Values = AnyObject, Rest = AnyObject, Extra = unknown>(
    ...args: Search<Values, Rest, Extra>[]
  ): React.ReactNode;
};

export type ISearchesType<Values = AnyObject, Rest = AnyObject, Extra = unknown> = Search<
  Values,
  Rest,
  Extra
>[];

export type IUpdateSearchType<
  Values = AnyObject,
  Rest = AnyObject,
  Extra = unknown,
  FormValues = Values,
> = Omit<IBaseFormControl<FormValues, Rest, Extra>, 'itemProps' | 'name'> & {
  name?: NameKey<Values>;
  itemProps?: Omit<Search<FormValues, Rest>['itemProps'], 'shouldUpdate' | 'next'> & {
    shouldUpdate?: FormItemProps<FormValues>['shouldUpdate'];
    next?: IUpdateControlProps<Values, Rest, Extra, FormValues>['itemProps']['next'];
  };
} & Rest;

export type IUpdateSearchesType<
  Values = AnyObject,
  Rest = AnyObject,
  Extra = unknown,
  FormValues = Values,
> = IUpdateSearchType<Values, Rest, Extra, FormValues>[];
