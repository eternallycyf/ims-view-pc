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

export interface RichTextProps {
  html?: string;
  htmlStyle?: CSSProperties;
  htmlClassName?: string;
  /**
   * @description 富文本必须设置 收起时的最高高度
   */
  maxHeight?: number;
  emptyText?: string;
}
