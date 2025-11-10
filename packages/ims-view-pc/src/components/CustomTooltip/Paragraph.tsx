import { Typography } from 'antd';
import type { ParagraphProps as AntParagraphProps } from 'antd/es/typography/Paragraph';
import classNames from 'classnames';
import { variables } from 'ims-view-pc';
import React, { type ReactNode } from 'react';
import Empty from './Empty';
import './indexless';
import { isEmpty } from './utils';

interface ParagraphProps extends Omit<AntParagraphProps, 'ellipsis' | 'children' | 'content'> {
  rows?: number;
  content?: ReactNode;
  isLink?: boolean;
  emptyNode?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

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
      className={classNames('custom-paragraph', className)}
      style={
        isLink
          ? { cursor: 'pointer', color: variables.colorLink, ...customStyle, ...style }
          : { ...customStyle, ...style }
      }
      {...mergedProps}
    >
      {content}
    </Typography.Paragraph>
  );
};

export default Paragraph;
