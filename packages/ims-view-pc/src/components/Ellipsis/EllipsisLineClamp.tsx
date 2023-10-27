import { Tooltip, TooltipProps } from 'antd';
import * as React from 'react';
import { EllipsisProps } from './Ellipsis';

interface EllipsisLineClampProps
  extends Omit<EllipsisProps, 'length' | 'width' | 'fullWidthRecognition'> {
  tooltipProps?: TooltipProps;
}

const EllipsisLineClamp = (props: EllipsisLineClampProps) => {
  const { className, prefix, lines, tooltip, tooltipProps, children, ...restProps } = props;

  const [tooltipVisible, setTooltipVisible] = React.useState<boolean>(false);
  const lineClampNodeRef = React.useRef<HTMLDivElement>(null);

  const handleTooltipVisibleChange = (visible: boolean) => {
    const node = lineClampNodeRef.current;
    if (!node) {
      return;
    }

    const nextVisible =
      visible && (node.offsetHeight < node.scrollHeight || node.offsetWidth < node.scrollWidth);

    setTooltipVisible(nextVisible);
  };

  //行数限制

  // support document.body.style.webkitLineClamp
  const id = `plus-ellipsis-${`${new Date().getTime()}${Math.floor(Math.random() * 100)}`}`;
  const style = `#${id}{-webkit-line-clamp:${lines};-webkit-box-orient: vertical;}`;

  const node = (
    <div ref={lineClampNodeRef} id={id} className={className} {...restProps}>
      <style>{style}</style>
      {children}
    </div>
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

export default EllipsisLineClamp;
