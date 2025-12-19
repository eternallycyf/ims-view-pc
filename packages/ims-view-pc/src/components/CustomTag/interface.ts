import type { TagProps } from 'antd';
import type { CSSProperties } from 'react';

export interface CustomTagProps extends TagProps {
  label?: string;
  tooltip?: string | React.ReactNode;
  labelClassName?: string;
  labelStyle?: CSSProperties;
}
