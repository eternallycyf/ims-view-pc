import { Typography } from 'antd';
import type { ParagraphProps as AntParagraphProps } from 'antd/es/typography/Paragraph';
import clsx from 'classnames';
import { variables } from 'ims-view-pc';
import React, { type ReactNode } from 'react';
import Empty from './Empty';
import './index.less';
import { isEmpty } from './utils';

export interface ParagraphProps extends Omit<AntParagraphProps, 'ellipsis' | 'children' | 'content'> {
  /** 省略行数 */
  rows?: number;
  /** 文本内容 */
  content?: ReactNode;
  /** 是否为链接样式 */
  isLink?: boolean;
  /** 空内容时显示的节点 */
  emptyNode?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 省略配置 */
  ellipsis?: AntParagraphProps['ellipsis'];
}

/**
 * 自动省略段落组件
 * @param props 段落配置
 * @returns 段落节点
 */
const Paragraph = (props: ParagraphProps) => {
  const { className, style, rows = 1, content, emptyNode, isLink = false, ...rest } = props;
  const mergedProps: AntParagraphProps = {
    ...rest,
    ellipsis: {
      rows,
      tooltip: content,
      ...(rest as any).ellipsis,
    },
  };
  const customStyle = {
    whiteSpace: rows === 1 ? 'nowrap' : 'break-spaces',
  };

  if (isEmpty(content)) return emptyNode || <Empty />;

  return (
    <Typography.Paragraph
      className={clsx('custom-paragraph', className)}
      style={
        isLink
          ? {
            cursor: 'pointer',
            color: variables?.colorLink,
            ...customStyle,
            ...style,
          }
          : { color: 'inherit', ...customStyle, ...style }
      }
      {...mergedProps}
    >
      {content}
    </Typography.Paragraph>
  );
};

export default Paragraph;
