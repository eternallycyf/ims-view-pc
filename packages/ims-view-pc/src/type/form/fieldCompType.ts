import { FormInstance } from 'antd';
import { AddIndexSignature, AnyObject, ValueOf } from '../type';
import {
  Dict,
  type FormControlType,
  type IControlProps,
  type IFetchConfig,
  type ItemProps,
} from './base';
import { IBaseCustomFormItemProps } from './formItem';

export type NameKey<Values = AnyObject> = (keyof Values & string) | [number, keyof Values & string];

export interface IFieldComponentTypeParams<Values = AnyObject, Rest = AnyObject, Extra = unknown> {
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

  fetchConfig?: IFetchConfig;
  controlProps?: IControlProps;
  itemProps?: ItemProps;

  Component?: (
    props: IBaseCustomFormItemProps<Values, Rest, Extra> & {
      controlProps: IControlProps;
      onChange: (value: any) => any;
      type: FormControlType;
      value: any;
    },
  ) => React.ReactNode;
  renderItem?: (item: Dict[number]) => React.ReactNode;
}

export type FieldCompType = {
  <Values = AnyObject, Rest = AnyObject, Extra = unknown>(
    ...args: IFieldComponentTypeParams<Values, Rest, Extra>[]
  ): React.ReactNode;
};
