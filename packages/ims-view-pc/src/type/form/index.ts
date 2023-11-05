import { FormInstance } from 'antd';
import { AddIndexSignature, AnyObject, ValueOf } from 'ims-view-pc';
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
    | { key: any };
  record?: AddIndexSignature<Values>;
  dict?: Dict;
  hidden?: boolean;

  fetchConfig?: IFetchConfig<AnyObject>;
  controlProps?: IControlProps;
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
  renderItem?: (item: Dict[number]) => React.ReactNode;
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
