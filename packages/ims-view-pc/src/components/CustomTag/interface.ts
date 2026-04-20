import type { TagProps } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

export interface CustomTagProps extends TagProps {
  label?: ReactNode
  tooltip?: string | React.ReactNode;
  labelClassName?: string;
  labelStyle?: CSSProperties;
}
