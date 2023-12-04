import { Tag as AntdTag } from 'antd';
import { CustomTheme } from 'ims-view-pc';
import React from 'react';
import { BaseHoverActiveBg } from '../../styles/customTheme';
import './index.less';
import { IThemeTagProps } from './interface';

function Tag<Values = any>(props: IThemeTagProps<Values>): React.ReactElement {
  const { color, style, className, ...restProps } = props;
  const customColor = BaseHoverActiveBg?.[color];
  const defaultColor = BaseHoverActiveBg?.[color] ? CustomTheme[color] : color;

  const defaultStyle = customColor
    ? { background: BaseHoverActiveBg?.[color + '-bg'], ...style }
    : { ...style };

  return (
    <>
      <AntdTag
        bordered={false}
        className={`customTag ${className}`}
        color={defaultColor}
        style={defaultStyle}
        {...restProps}
      />
    </>
  );
}

export default Tag;
