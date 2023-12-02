import { Badge as AntdBadge } from 'antd';
import { CustomTheme } from 'ims-view-pc';
import React from 'react';
import { IThemeBadgeProps } from './interface';

function Badge<Values = any>(props: IThemeBadgeProps<Values>): React.ReactElement {
  const { color, text, isTable = false, ...restProps } = props;
  const defualtColor = CustomTheme?.[color] ?? color;
  const badgeColor = isTable ? CustomTheme['status-text'] : defualtColor;
  return (
    <>
      <AntdBadge
        color={defualtColor}
        text={<span style={{ color: badgeColor }}>{text}</span>}
        {...restProps}
      />
    </>
  );
}

export default Badge;
