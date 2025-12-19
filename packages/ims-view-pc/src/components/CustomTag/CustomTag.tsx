import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import CustomTooltip from '../CustomTooltip';
import './index.less';
import type { CustomTagProps } from './interface';

const presets = [
  'magenta',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  'red',
];

const getRandomColorByLength = (textLength: number, presets: string[]) => {
  const index = textLength % presets.length;
  return presets[index];
};

const CustomTag: React.FC<CustomTagProps> = (props) => {
  const {
    label,
    labelClassName,
    labelStyle,
    color: propColor,
    tooltip,
    className,
    children,
    ...restProps
  } = props;

  const color = useMemo(() => {
    if (propColor) {
      return propColor;
    }
    if (label && typeof label === 'string') {
      return getRandomColorByLength(label.length, presets);
    }
    return undefined;
  }, [propColor, label]);

  const mergedClassName = useMemo(() => {
    return className ? `custom-tag ${className}` : 'custom-tag';
  }, [className]);

  if (!label && !children) {
    return null;
  }

  const tagContent = (
    <>
      <span className="custom-tag-content">
        <CustomTooltip.Paragraph
          className={labelClassName}
          content={children || label}
          style={{ color: 'inherit', fontSize: '12px', ...labelStyle }}
        />
      </span>
      {tooltip && (
        <Tooltip title={tooltip}>
          <QuestionCircleOutlined className="custom-tag-tooltip-icon" />
        </Tooltip>
      )}
    </>
  );

  return (
    <Tag
      {...restProps}
      bordered={false}
      color={color}
      className={mergedClassName}
      style={restProps.style}
    >
      {tagContent}
    </Tag>
  );
};

export default CustomTag;
