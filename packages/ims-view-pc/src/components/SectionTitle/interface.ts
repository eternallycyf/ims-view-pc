import { TooltipProps } from 'antd';

export interface ISectionTitle {
  title?: React.ReactNode;
  extraContent?: React.ReactNode;
  rowStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  tooltip?: React.ReactNode;
  tooltipProps?: TooltipProps;
  children?: React.ReactNode;
}
