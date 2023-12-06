import { Button, Tooltip, type ButtonProps } from 'antd';
import React, { CSSProperties, ReactNode, SetStateAction } from 'react';

export interface IToggleBtnValue {
  size?: ButtonProps['size'];
  buttonType: ButtonProps['type'];
  buttonStyle?: CSSProperties;
  tooltipStyle?: CSSProperties;
  toggleIconStyle?: CSSProperties;
  label: ReactNode | string;
  tooltip?: ReactNode | string;
  toggleIcon?: ReactNode | string;
  hasTooltip?: boolean;
}

export type IToggleDict = Record<string, IToggleBtnValue>;

export type IToggleButtonProps<T> = {
  status: keyof T;
  setStatus?: React.Dispatch<SetStateAction<keyof T>>;
  dict: IToggleDict;
  cb?: (status: keyof T) => void;
};

export type IDefaultProps = {
  [Key in string as `default${Key & string}`]: any;
};
