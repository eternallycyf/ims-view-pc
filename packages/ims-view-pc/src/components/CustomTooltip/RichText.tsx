import { DownOutlined } from '@ant-design/icons';
import { useDebounceEffect, useSize } from 'ahooks';
import { Popover, Typography } from 'antd';
import { FC, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import './index.less';
import type { RichTextProps } from './interface';

const matchHtml = /(<[^>]+>)/g;
const expandBtnWidth = 45;
const collapseMaxHeight = 44;

const RichText: FC<RichTextProps> = (props) => {
  const {
    html = '',
    maxHeight = collapseMaxHeight,
    emptyText = <div>-</div>,
    htmlStyle,
    htmlClassName,
    expandable: defaultExpandable = true,
    rows = 2,
    PopoverProps,
    dept = [],
  } = props;
  const [_expandable, setExpandable] = useState<boolean>(false);
  const [overflow, setOverflow] = useState<CSSProperties['overflow']>('hidden');
  const [expand, setExpand] = useState<boolean>(false);
  const [forceUpdateKey, _setForceUpdateKey] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const bodySize = useSize(document.querySelector('body'));

  const contentProps = useMemo(() => {
    return {
      dangerouslySetInnerHTML: {
        __html: html,
      },
      style: htmlStyle,
      className: [htmlClassName].join(' '),
    };
  }, [html, htmlStyle, htmlClassName]);

  const isHiddenOverflow = overflow === 'hidden';
  const expandable = expand;
  const showPopoverProps = expandable
    ? {}
    : {
        open: false,
      };

  const noFlagHtml = useMemo(() => {
    if (typeof html !== 'string') return '';
    return html.replace(matchHtml, '').trim();
  }, [html]);

  useDebounceEffect(
    () => {
      if (!bodySize?.width) return;
      setExpandable(true);
    },
    [bodySize?.width],
    {
      wait: 200,
    },
  );

  const elementRef = useCallback(
    (node: HTMLDivElement) => {
      requestAnimationFrame(() => {
        const height = node?.getBoundingClientRect()?.height || 0;

        if (~~height > maxHeight) {
          setExpand(true);
        } else {
          setExpand(false);
        }
      });

      return node;
    },
    [maxHeight, dept, bodySize],
  );

  // 监听容器尺寸变化，强制重新渲染以触发 onEllipsis
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // const resizeObserver = new ResizeObserver(() => {
    //   // 强制组件重新渲染，触发 Typography.Paragraph 的 onEllipsis
    //   setExpandable(false)
    //   setForceUpdateKey((prev) => prev + 1)
    // })

    // resizeObserver.observe(container)

    // return () => {
    //   resizeObserver.disconnect()
    // }
  }, [html]);

  if (!html) return emptyText;

  return (
    <>
      <div
        className="richText"
        style={
          {
            '--expand-btn-width': expandable ? expandBtnWidth + 'px' : 0,
            '--rich-text-max-height': isHiddenOverflow && expandable ? maxHeight + 'px' : 'auto',
            '--right-text-overflow': overflow,
          } as any as CSSProperties
        }
      >
        <Typography.Paragraph
          key={forceUpdateKey}
          className="paragraph"
          ellipsis={{
            rows: rows,
            expandable: true,
            onEllipsis: (ellipsis) => {
              setExpandable(ellipsis);
            },
          }}
        >
          {noFlagHtml}
        </Typography.Paragraph>

        <Popover
          {...showPopoverProps}
          overlayStyle={{ maxWidth: 500, wordBreak: 'break-all' }}
          title={expandable ? <div {...contentProps} /> : null}
        >
          <div className="content">
            <div ref={elementRef} {...contentProps} />
          </div>
        </Popover>

        {defaultExpandable ? (
          <>
            {expandable && (
              <div className="btn">
                <a
                  onClick={() =>
                    setOverflow((overflow) => {
                      if (overflow === 'hidden') return 'auto';
                      return 'hidden';
                    })
                  }
                >
                  {isHiddenOverflow ? '展开' : '收起'}
                  <DownOutlined rotate={isHiddenOverflow ? 0 : 180} />
                </a>
                {isHiddenOverflow && '...'}
              </div>
            )}
          </>
        ) : (
          <>
            <>{isHiddenOverflow && '...'}</>
          </>
        )}
      </div>
    </>
  );
};
export default RichText;
