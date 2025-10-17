import { DownOutlined, LeftOutlined, UpOutlined } from '@ant-design/icons';
import { useForceUpdate } from '@ims-view/hooks';
import { Typography } from 'antd';
import type { ParagraphProps } from 'antd/es/typography/Paragraph';
import { variables } from 'ims-view-pc';
import { FC, useCallback, useMemo, useState, type CSSProperties } from 'react';
import Empty from './Empty';
import './index.less';
import type { CustomTooltipProps } from './interface';
import { isString as _isString, isEmpty } from './utils';
const { Paragraph } = Typography;

const CustomTooltip: FC<CustomTooltipProps> = (props) => {
  const forceUpdate = useForceUpdate();
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [hasExpend, setHasExpend] = useState<boolean>(false);

  const [overflowStatus, setOverflowStatus] = useState<'hidden' | 'unset'>('hidden');

  const {
    content = '',
    rows = 2,
    expand = false,
    maxHeight = 22,
    direction = 'default',
    type = 'default',
    ellipsisSymbol = true,
    style,
    paragraphStyle,
    buttonStyle,
    className,
    buttonClassName,
    paragraphClassName,
    tooltipClassName,
    expandMoreLength,
    ellipsisProps = {},
  } = props;

  const isString = useMemo(() => {
    return _isString(props?.content);
  }, [props?.content]);

  const contentRef = useCallback((node: HTMLDivElement) => {
    if (node != null) {
      if (props?.expandOnChange) {
        props?.expandOnChange(setHasExpend);
        return;
      }
    }
    return node;
  }, []);

  const getToggleButton = (isExpandStatus: boolean) => {
    return (
      <a
        style={buttonStyle}
        className={[direction === 'right' && 'CustomTooltip-Btn-left', buttonClassName].join(' ')}
        onClick={() => {
          setOverflowStatus(isExpandStatus ? 'unset' : 'hidden');
          setIsExpand(isExpandStatus);
          forceUpdate();
        }}
      >
        {type !== 'simple' ? (
          <>
            {isExpandStatus ? '展开' : '收起'}
            <span className="apply-shake">
              {isExpandStatus ? (
                <UpOutlined className="apply-shake" />
              ) : (
                <DownOutlined className="apply-shake" />
              )}
            </span>
          </>
        ) : (
          <span className="expand-btn">
            {expandMoreLength && isExpandStatus
              ? `更多 ${expandMoreLength} `
              : expandMoreLength && !isExpandStatus
              ? '收起'
              : ''}
            <span className="apply-shake">
              {isExpandStatus ? (
                <UpOutlined className="apply-shake" />
              ) : (
                <DownOutlined className="apply-shake" />
              )}
            </span>
          </span>
        )}
      </a>
    );
  };

  const WrapperProps: CSSProperties =
    expandMoreLength == undefined
      ? ({
          '--max-height': overflowStatus === 'hidden' ? maxHeight : '100%',
          '--overflow': overflowStatus,
          paddingRight: direction === 'right' ? 46 : 0,
          width: `calc(100% - ${direction === 'right' ? 46 : 0}px)`,
        } as any as CSSProperties)
      : ({
          paddingRight: direction === 'right' ? 46 : 0,
          width: `calc(100% - ${direction === 'right' ? 46 : 0}px)`,
        } as any as CSSProperties);

  const ParagraphProps: Partial<ParagraphProps> = isExpand
    ? {
        style: paragraphStyle,
      }
    : {
        style: paragraphStyle,
        ellipsis: {
          rows,
          expandable: hasExpend ? isExpand : false,
          tooltip: content,
          onExpand: () => {
            setIsExpand(true);
            forceUpdate();
          },
          onEllipsis: (isEllipsis: boolean) => {
            expand ? setHasExpend(isEllipsis) : setHasExpend(false);
            forceUpdate();
          },
        },
      };

  if (isEmpty(props?.content)) return <Empty />;

  return (
    <span
      className={['CustomTooltip', ellipsisSymbol === false && 'ellipsis-symbol', className].join(
        ' ',
      )}
      style={{
        '--colorPrimary': variables?.colorPrimary,
        ...WrapperProps,
      }}
    >
      <Paragraph ref={contentRef} {...ParagraphProps}>
        {content ?? '--'}
      </Paragraph>
      {isExpand && getToggleButton(false)}
      {hasExpend ? (isExpand ? null : getToggleButton(true)) : null}
    </span>
  );
};

export default CustomTooltip;
