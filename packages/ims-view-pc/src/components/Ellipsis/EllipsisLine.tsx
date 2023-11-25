import { Tooltip } from 'antd';
import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { EllipsisLineProps } from './interface';

const bisection = (
  th: number,
  m: number,
  b: number,
  e: any,
  text: string,
  shadowNode: { innerHTML: string; offsetHeight: any },
): number => {
  const suffix = '...';
  let mid = m;
  let end = e;
  let begin = b;
  shadowNode.innerHTML = text.substring(0, mid) + suffix;
  let sh = shadowNode.offsetHeight;

  if (sh <= th) {
    shadowNode.innerHTML = text.substring(0, mid + 1) + suffix;
    sh = shadowNode.offsetHeight;
    if (sh > th || mid === begin) {
      return mid;
    }
    begin = mid;
    if (end - begin === 1) {
      mid = 1 + begin;
    } else {
      mid = Math.floor((end - begin) / 2) + begin;
    }
    return bisection(th, mid, begin, end, text, shadowNode);
  }
  if (mid - 1 < 0) {
    return mid;
  }
  shadowNode.innerHTML = text.substring(0, mid - 1) + suffix;
  sh = shadowNode.offsetHeight;
  if (sh <= th) {
    return mid - 1;
  }
  end = mid;
  mid = Math.floor((end - begin) / 2) + begin;
  return bisection(th, mid, begin, end, text, shadowNode);
};

const EllipsisLine = (props: EllipsisLineProps) => {
  const { className, prefix, lines = 2, tooltip, tooltipProps, children, ...restProps } = props;

  const [tooltipVisible, setTooltipVisible] = React.useState<boolean>(false);
  const [targetCount, setTargetCount] = React.useState<number>(0);
  const [text, setText] = React.useState<string>('');

  const rootRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const nodeRef = React.useRef<HTMLSpanElement>(null);
  const shadowRef = React.useRef<HTMLDivElement>(null);
  const shadowChildrenRef = React.useRef<HTMLDivElement>(null);

  const handleTooltipVisibleChange = (visible: boolean) => {
    const node = nodeRef.current;
    if (!node) {
      return;
    }

    const shadowChildren = shadowChildrenRef.current;
    const text = (shadowChildren!.innerText || shadowChildren!.textContent || '') as string;
    const nextVisible = visible && targetCount < (text!.length || 0);

    setTooltipVisible(nextVisible);
  };

  const computeLine = () => {
    const root = rootRef.current!;
    const content = contentRef.current!;
    const shadow = shadowRef.current!;
    const shadowChildren = shadowChildrenRef.current!;

    const text = shadowChildren.innerText || shadowChildren.textContent;
    const lineHeight = parseInt(getComputedStyle(root).lineHeight, 10);
    const targetHeight = lines * lineHeight;
    content.style.height = `${targetHeight}px`;
    const totalHeight = shadowChildren.offsetHeight;
    const shadowNode = shadow.firstChild! as HTMLDivElement;

    if (totalHeight <= targetHeight) {
      setText(text!);
      setTargetCount(text!.length);
      return;
    }

    // bisection
    const len = text!.length;
    const mid = Math.ceil(len / 2);

    const count = bisection(targetHeight, mid, 0, len, text!, shadowNode);

    setText(text!);
    setTargetCount(count);
  };

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === contentRef.current) {
          computeLine();
        }
      });
    });
    resizeObserver.observe(contentRef.current!);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  React.useEffect(() => {
    computeLine();
  }, [lines, children]);

  const childNode = (
    <span ref={nodeRef}>
      {targetCount > 0 && text.substring(0, targetCount)}
      {targetCount > 0 && targetCount < text.length && '...'}
    </span>
  );

  return (
    <div {...restProps} ref={rootRef} className={className}>
      <div ref={contentRef}>
        {tooltip ? (
          <Tooltip
            {...tooltipProps}
            overlayClassName={`${prefix}-tooltip`}
            overlayStyle={{ maxWidth: 700, ...tooltipProps?.overlayStyle }}
            title={text}
            open={tooltipVisible}
            onOpenChange={handleTooltipVisibleChange}
          >
            {childNode}
          </Tooltip>
        ) : (
          childNode
        )}
        <div className={`${prefix}-shadow`} ref={shadowChildrenRef}>
          {children}
        </div>
        <div className={`${prefix}-shadow`} ref={shadowRef}>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
};

export default EllipsisLine;
