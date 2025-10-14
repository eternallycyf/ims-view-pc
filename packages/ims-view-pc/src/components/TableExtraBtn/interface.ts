import {
  type ButtonProps,
  type GetProps,
  type PopconfirmProps,
  type PopoverProps,
  type SpaceProps,
  type TypographyProps
} from 'antd';
import { type Dispatch, type ReactNode, type SetStateAction } from 'react';
import './index.less';

export interface ElementProps<T extends Record<string, any>> extends ButtonDataType<T> {
  record?: T;
  clickCallBack: TableExtraBtnProps<T>['clickCallBack'];
}

export interface BaseButtonRecord {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export interface ButtonDataType<T> {
  type?: 'button' | 'link' | 'delete' | 'custom';
  buttonProps?: ButtonProps;
  typographyProps?: GetProps<TypographyProps['Link']>;
  popconfirmProps?: PopconfirmProps;
  element?: ReactNode | ((record: T, context: BaseButtonRecord) => ReactNode);
  onClick?: (params: T, context: BaseButtonRecord) => void;
  visible?: ((record: T) => boolean) | boolean;
}

export interface TableExtraBtnProps<T extends Record<string, any> = any> {
  maxShowMoreCount?: number;
  emptyText?: ReactNode;
  record?: T;
  btnList?: ButtonDataType<T>[];
  clickCallBack?: (params: T, context: BaseButtonRecord) => void;
  spaceProps?: SpaceProps;
  popoverProps?: PopoverProps;
  divider?: ReactNode | false;
}
