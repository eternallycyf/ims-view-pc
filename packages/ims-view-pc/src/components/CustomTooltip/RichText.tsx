import { DownOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { FC, useCallback, useMemo, useState, type CSSProperties } from 'react';
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
  } = props;
  const [expandable, setExpandable] = useState<boolean>(false);
  const [overflow, setOverflow] = useState<CSSProperties['overflow']>('hidden');

  const isHiddenOverflow = overflow === 'hidden';

  const noFlagHtml = useMemo(() => {
    if (typeof html !== 'string') return '';
    return html.replace(matchHtml, '').trim();
  }, [html]);

  const elementRef = useCallback(
    (node: HTMLDivElement) => {
      requestAnimationFrame(() => {
        const height = node?.getBoundingClientRect()?.height || 0;
        console.log(height);
        if (height > maxHeight) {
          setExpandable(true);
        } else {
          setExpandable(false);
        }
      });

      return node;
    },
    [html],
  );

  if (!html) return emptyText;

  return (
    <>
      <div
        className="richText"
        style={
          {
            '--expand-btn-width': expandable ? expandBtnWidth + 'px' : 0,
            '--rich-text-max-height': isHiddenOverflow ? maxHeight + 'px' : 'auto',
            '--right-text-overflow': overflow,
          } as any as CSSProperties
        }
      >
        <Typography.Paragraph
          className="paragraph"
          ellipsis={{
            rows: 2,
            expandable: true,
            onEllipsis: (ellipsis) => setExpandable(ellipsis),
          }}
        >
          {noFlagHtml}
        </Typography.Paragraph>

        <div className="content">
          <div
            ref={elementRef}
            dangerouslySetInnerHTML={{
              __html: html,
            }}
            style={htmlStyle}
            className={[htmlClassName].join(' ')}
          />
        </div>

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
              <DownOutlined style={{}} rotate={isHiddenOverflow ? 0 : 180} />
            </a>
          </div>
        )}
      </div>
    </>
  );
};
export default RichText;
