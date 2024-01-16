import { Tooltip } from 'antd';
import * as React from 'react';
import { EllipsisTextProps } from './interface';

export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1;
    }
    return pre + 2;
  }, 0);

export const cutStrByFullLength = (str = '', maxLength: number) => {
  let showLength = 0;
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1;
    } else {
      showLength += 2;
    }
    if (showLength <= maxLength) {
      return pre + cur;
    }
    return pre;
  }, '');
};

const EllipsisText: React.FC<EllipsisTextProps> = (props) => {
  const { prefix, text, length, tooltip, className, fullWidthRecognition, tooltipProps, ...other } =
    props;
  if (typeof text !== 'string') {
    throw new Error('Ellipsis children must be string.');
  }
  const textLength = fullWidthRecognition ? getStrFullLength(text) : text.length;
  if (textLength <= length || length < 0) {
    return (
      <span className={className} {...other}>
        {text}
      </span>
    );
  }
  const tail = '...';
  let displayText;
  if (length - tail.length <= 0) {
    displayText = '';
  } else {
    displayText = fullWidthRecognition ? cutStrByFullLength(text, length) : text.slice(0, length);
  }

  if (tooltip) {
    return (
      <Tooltip
        {...tooltipProps}
        overlayClassName={`${prefix}-tooltip`}
        overlayStyle={{ maxWidth: 700, ...tooltipProps?.overlayStyle }}
        title={text}
      >
        <span className={className}>
          {displayText}
          {tail}
        </span>
      </Tooltip>
    );
  }

  return (
    <span className={className} {...other}>
      {displayText}
      {tail}
    </span>
  );
};

export default EllipsisText;
