import { TooltipProps } from 'antd';
import { NativeProps, PropagationEvent } from './Expand/utils';

export interface EllipsisProps {
  tooltip?: boolean | TooltipProps;
  length?: number;
  lines?: number;
  fullWidthRecognition?: boolean;
  className?: string;
  width?: number | string;
  style?: React.CSSProperties;
  prefix?: string;
  children: React.ReactNode;
}

export interface EllipsisLineProps
  extends Omit<EllipsisProps, 'length' | 'width' | 'fullWidthRecognition'> {
  tooltipProps?: TooltipProps;
}
export interface EllipsisLineClampProps
  extends Omit<EllipsisProps, 'length' | 'width' | 'fullWidthRecognition'> {
  tooltipProps?: TooltipProps;
}
export interface EllipsisTextProps {
  prefix: string;
  text: React.ReactNode | string;
  length: number;
  tooltip: boolean;
  className: string;
  fullWidthRecognition: boolean;
  tooltipProps?: TooltipProps;
}

export interface EllipsisWidthProps
  extends Omit<EllipsisProps, 'length' | 'lines' | 'fullWidthRecognition'> {
  tooltipProps?: TooltipProps;
}

export type EllipsisExpandProps = {
  content: string;
  direction?: 'start' | 'end' | 'middle';
  rows?: number;
  expandText?: React.ReactNode;
  collapseText?: React.ReactNode;
  stopPropagationForActionButtons?: PropagationEvent[];
  onContentClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  defaultExpanded?: boolean;
  tooltip?: boolean | TooltipProps;
} & NativeProps;
