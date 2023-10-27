import { Tooltip, TooltipProps } from 'antd';
import * as React from 'react';
import { EllipsisProps } from './Ellipsis';

interface EllipsisWidthProps
  extends Omit<EllipsisProps, 'length' | 'lines' | 'fullWidthRecognition'> {
  tooltipProps?: TooltipProps;
}

const EllipsisWidth = (props: EllipsisWidthProps) => {
  const { className, prefix, style, tooltip, tooltipProps, width, children, ...restProps } = props;

  const [tooltipVisible, setTooltipVisible] = React.useState<boolean>(false);
  const widthNodeRef = React.useRef<HTMLDivElement>(null);

  const handleTooltipVisibleChange = (visible: boolean) => {
    const node = widthNodeRef.current;
    if (!node) {
      return;
    }

    const nextVisible =
      visible && (node.offsetHeight < node.scrollHeight || node.offsetWidth < node.scrollWidth);

    setTooltipVisible(nextVisible);
  };

  const node = (
    <span
      ref={widthNodeRef}
      className={className}
      {...restProps}
      style={{ ...style, maxWidth: width }}
    >
      {children}
    </span>
  );
  return tooltip ? (
    <Tooltip
      {...tooltipProps}
      overlayClassName={`${prefix}-tooltip`}
      overlayStyle={{ maxWidth: 700, ...tooltipProps?.overlayStyle }}
      title={children}
      open={tooltipVisible}
      onOpenChange={handleTooltipVisibleChange}
    >
      {node}
    </Tooltip>
  ) : (
    node
  );
};

export default EllipsisWidth;
