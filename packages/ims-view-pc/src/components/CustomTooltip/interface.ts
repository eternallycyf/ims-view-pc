import type { PopoverProps } from 'antd';
import type { EllipsisConfig } from 'antd/es/typography/Base';
import type { CSSProperties, Dispatch, SetStateAction } from 'react';

export { type ParagraphProps } from './Paragraph';

export interface CustomTooltipProps {
  /** 文本内容 */
  content?: React.ReactNode;
  /** 省略行数 */
  rows?: number;
  /** 是否默认展开 */
  expand?: boolean;
  /** 最大高度 */
  maxHeight?: number;
  /** 更多时显示的数量 */
  expandMoreLength?: number;
  /** 展开状态变化回调 */
  expandOnChange?: (setHasExpend: Dispatch<SetStateAction<boolean>>) => any;
  /** 是否显示省略号 */
  ellipsisSymbol?: boolean;
  /** 按钮样式 */
  buttonStyle?: CSSProperties;
  /** 按钮方向 */
  direction?: 'right' | 'default';
  /** 组件类型 */
  type?: 'default' | 'simple' | 'custom';
  /** 段落样式 */
  paragraphStyle?: CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 按钮自定义类名 */
  buttonClassName?: string;
  /** 段落自定义类名 */
  paragraphClassName?: string;
  /** 省略配置 */
  ellipsisProps?: EllipsisConfig;
  /** 点击事件 */
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
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
  expandable?: boolean;
  rows?: number;
  PopoverProps?: PopoverProps;
  dept?: any[];
}
