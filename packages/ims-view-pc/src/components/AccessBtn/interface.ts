import { ButtonProps, PopconfirmProps } from 'antd';
import { ButtonGroupProps } from 'antd/es/button';
import { ReactNode } from 'react';

export type IAccessBtnType = 'default' | 'custom' | 'delete' | 'group';
export type IGroupButtonValue = string | number | readonly string[];

//#region ------------------------ 1.buttonGroup -----------------------
export interface IButtonGroupDefaultProps {
  buttonProps?: IButtonItemProps['buttonProps'];
  buttonGroupProps?: IButtonItemProps['buttonGroupProps'];
  value: IGroupButtonValue;
  dict:
    | { value: IGroupButtonValue; label: string }[]
    | readonly { value: IGroupButtonValue; label: string }[];
  style?: React.CSSProperties;
  className?: string;
  getCurrentValue?: (value: IGroupButtonValue) => any;
}

export type IButtonGroupHandle = {
  type: IGroupButtonValue;
};

export interface IButtonGroupProps {
  groupValue?: IGroupButtonValue;
  handleGroupValueOnChange?: (value: IGroupButtonValue) => any;
  groupDict?: IButtonGroupDefaultProps['dict'];
}
//#endregion

//#region ------------------------ 2.deleteButton -----------------------
export interface IButtonDeleteProps {
  deleteText?: string;
  handleDeleteConfirm?: PopconfirmProps['onConfirm'];
}
//#endregion

export interface IButtonItemProps extends IButtonDeleteProps, IButtonGroupProps {
  buttonGroupProps?: ButtonGroupProps;
  buttonProps?: ButtonProps;
  popConfirmProps?: PopconfirmProps;
}

export interface IButtonProps {
  element?: ReactNode;
  type?: IAccessBtnType;
  buttonType?: ButtonProps['type'];
  code?: string;
  visible?: boolean | ((groupValue?: IGroupButtonValue) => boolean);
  itemProps?: IButtonItemProps;
}

export interface IAccessBtnProps {
  className?: string;
  accessCollection?: string[];
  children?: React.ReactNode;
  btnList?: IButtonProps[];
}
