import type { EllipsisConfig } from 'antd/es/typography/Base';
import type { CSSProperties, Dispatch, SetStateAction } from 'react';

export interface CustomTooltipProps {
  content?: React.ReactNode;
  rows?: number;
  expand?: boolean;
  maxHeight?: number;
  expandMoreLength?: number;
  expandOnChange?: (setHasExpend: Dispatch<SetStateAction<boolean>>) => any;

  ellipsisSymbol?: boolean;
  buttonStyle?: CSSProperties;
  direction?: 'right' | 'default';
  type?: 'default' | 'simple' | 'custom';

  style?: CSSProperties;
  paragraphStyle?: CSSProperties;
  className?: string;
  buttonClassName?: string;
  paragraphClassName?: string;
  tooltipClassName?: string;

  ellipsisProps?: EllipsisConfig;
}
