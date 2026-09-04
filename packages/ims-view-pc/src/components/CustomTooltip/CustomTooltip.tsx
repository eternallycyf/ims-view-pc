import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import type { ParagraphProps } from 'antd/es/typography/Paragraph';
import lodash from 'lodash';
import { useCallback, useState, type CSSProperties } from 'react';
import { variables } from 'ims-view-pc';
import Empty from './Empty';
import './index.less';
import type { CustomTooltipProps } from './interface';
import useForceUpdate from './useForceUpdate';
import { isEmpty } from './utils';
const { Paragraph } = Typography;

/**
 * 用于富文本的展开收起
 * @deprecated 钉钉环境异常
 */
const DefaultCustomTooltip = (props: CustomTooltipProps) => {
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
    paragraphStyle,
    buttonStyle,
    className,
    buttonClassName,
    paragraphClassName,
    expandMoreLength,
    ellipsisProps = {},
    onClick,
    expandOnChange,
  } = props;

  const contentRef = useCallback(
    (node: HTMLDivElement) => {
      if (node != null) {
        if (expandOnChange) {
          expandOnChange(setHasExpend);
          return;
        }
      }
      return node;
    },
    [expandOnChange],
  );

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
              {isExpandStatus ? <UpOutlined className="apply-shake" /> : <DownOutlined className="apply-shake" />}
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
              {isExpandStatus ? <UpOutlined className="apply-shake" /> : <DownOutlined className="apply-shake" />}
            </span>
          </span>
        )}
      </a>
    );
  };

  const WrapperProps: CSSProperties = lodash.isNil(expandMoreLength)
    ? ({
        '--max-height': overflowStatus === 'hidden' ? maxHeight : '100%',
        '--overflow': overflowStatus,
        paddingRight: direction === 'right' ? 46 : 0,
        width: '100%',
      } as any as CSSProperties)
    : ({
        paddingRight: direction === 'right' ? 46 : 0,
        width: '100%',
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
          ...ellipsisProps,
        },
      };

  if (isEmpty(props?.content)) return <Empty />;

  return (
    <span
      className={['CustomTooltip', ellipsisSymbol === false && 'ellipsis-symbol', className].join(' ')}
      style={
        {
          '--colorPrimary': variables?.colorLink,
          '--colorPrimary-hover': variables?.colorLinkHover,
          ...WrapperProps,
        } as any
      }
      onClick={(e) => onClick && onClick(e)}
    >
      <Paragraph ref={contentRef} className={paragraphClassName} {...ParagraphProps}>
        {content ?? '--'}
      </Paragraph>
      {isExpand && getToggleButton(false)}
      {hasExpend ? (isExpand ? null : getToggleButton(true)) : null}
    </span>
  );
};

export default DefaultCustomTooltip;
