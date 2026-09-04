import type { TagProps } from 'antd';
import type { ReactNode } from 'react';

export interface CustomTagProps extends TagProps {
  /** 标签文本内容 */
  label?: ReactNode;
  /** 悬浮提示信息 */
  tooltip?: string | React.ReactNode;
  /** 文本区域的自定义类名 */
  labelClassName?: string;
  /** 是否显示前置圆点指示器，默认 true */
  showDot?: boolean;
  /** 圆点指示器颜色，不传则使用当前文字色 */
  dotColor?: string;
}
