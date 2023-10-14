import { FormInstance } from 'antd';
import dayjs from 'dayjs';
import { AddIndexSignature, AnyObject, ValueOf } from '../type';
import {
  type FormControlType,
  type IControlProps,
  type IFetchConfig,
  type ItemProps,
} from './base';

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
  hidden?: boolean;

  fetchConfig?: IFetchConfig;
  controlProps?: IControlProps;
  itemProps?: ItemProps;
}

export type FieldCompType = {
  <Values = AnyObject, Rest = AnyObject, Extra = unknown>(
    ...args: IFieldComponentTypeParams<Values, Rest, Extra>[]
  ): React.ReactNode;
};
