import { TooltipProps } from 'antd';
import * as React from 'react';
import EllipsisLine from './EllipsisLine';
import EllipsisLineClamp from './EllipsisLineClamp';
import EllipsisText from './EllipsisText';
import EllipsisWidth from './EllipsisWidth';
import './index.less';

// @ts-ignore
const isSupportLineClamp = document.body.style.webkitLineClamp !== undefined;

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

const Ellipsis = (props: EllipsisProps) => {
  const {
    children,
    lines,
    length,
    width,
    className,
    tooltip = true,
    style,
    fullWidthRecognition = false,
    prefix = 'plus-ellipsis',
    ...restProps
  } = props;
  const tooltipProps: TooltipProps = typeof tooltip === 'object' ? tooltip : {};

  const cls = `${prefix + '-ellipsis'} ${className}
  ${width ? prefix + '-width-mode' : ''}
  ${lines && !isSupportLineClamp ? prefix + '-line' : ''}
  ${lines && isSupportLineClamp ? prefix + '-lineClamp' : ''}
  `;

  // 一种限制都没有返回原值
  if (!lines && !length && !width) {
    return (
      <span className={cls} {...restProps}>
        {children}
      </span>
    );
  }

  if (width) {
    return (
      <EllipsisWidth
        className={cls}
        prefix={prefix}
        style={style}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        width={width}
        {...restProps}
      >
        {children}
      </EllipsisWidth>
    );
  }

  // 字数限制
  if (length) {
    return (
      <EllipsisText
        className={cls}
        prefix={prefix}
        tooltipProps={tooltipProps}
        length={length}
        text={children || ''}
        tooltip={tooltip as boolean}
        fullWidthRecognition={fullWidthRecognition}
        {...restProps}
      />
    );
  }

  if (isSupportLineClamp) {
    return (
      <EllipsisLineClamp
        className={cls}
        prefix={prefix}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        lines={lines}
        {...restProps}
      >
        {children}
      </EllipsisLineClamp>
    );
  }

  return (
    <EllipsisLine
      className={cls}
      prefix={prefix}
      tooltip={tooltip}
      tooltipProps={tooltipProps}
      lines={lines}
      {...restProps}
    >
      {children}
    </EllipsisLine>
  );
};

export default Ellipsis;
