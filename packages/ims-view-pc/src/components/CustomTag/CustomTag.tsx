import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import CustomTooltip from '../CustomTooltip';
import { getRandomTagColorByText } from './colorUtils';
import type { CustomTagProps } from './interface';

export {
  CUSTOM_TAG_COLOR_PRESETS,
  getRandomTagColorByText,
  getTagColorStyle,
  getTagColorStyleByText,
  type CustomTagColorPreset,
  type CustomTagColorStyle,
} from './colorUtils';

/**
 * 展示统一样式的标签。
 *
 * @param props 标签内容与样式配置
 * @returns 标签节点
 */
const CustomTag: React.FC<CustomTagProps> = (props) => {
  const {
    label,
    labelClassName,
    color: propColor,
    tooltip,
    className,
    children,
    showDot = true,
    dotColor,
    ...restProps
  } = props;

  const color = useMemo(() => {
    if (propColor) {
      return propColor;
    }
    if (label && typeof label === 'string') {
      return getRandomTagColorByText(label);
    }
    return undefined;
  }, [propColor, label]);

  const mergedStyle = useMemo((): React.CSSProperties => {
    return { fontWeight: 'bold', ...restProps.style };
  }, [restProps.style]);

  if (!label && !children) {
    return null;
  }

  const tagContent = (
    <>
      {showDot && (
        <span
          style={{
            marginRight: 7,
            height: 6,
            width: 6,
            borderRadius: '50%',
            backgroundColor: dotColor || 'currentColor',
            display: 'inline-block',
          }}
        />
      )}
      <span
        style={{
          display: 'inline-block',
          maxWidth: '100%',
          overflow: 'hidden',
          verticalAlign: 'middle',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <CustomTooltip.Paragraph
          className={labelClassName}
          content={children || label}
          style={{ color: 'inherit', fontSize: 12 }}
        />
      </span>
      {tooltip && (
        <Tooltip title={tooltip}>
          <QuestionCircleOutlined
            style={{ marginLeft: 4, flexShrink: 0, cursor: 'help', fontSize: 12 }}
          />
        </Tooltip>
      )}
    </>
  );

  return (
    <Tag
      {...restProps}
      bordered={false}
      color={color}
      className={className}
      style={{ ...mergedStyle, display: 'inline-flex', width: 'fit-content', alignItems: 'center' }}
    >
      {tagContent}
    </Tag>
  );
};

export default CustomTag;
