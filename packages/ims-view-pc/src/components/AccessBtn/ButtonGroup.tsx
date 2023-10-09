import { Button } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { themeConfig } from '../../styles/variables';
import './index.less';
import { IButtonGroupDefaultProps, IButtonGroupHandle } from './interface';

const ButtonGroup: React.ForwardRefRenderFunction<IButtonGroupHandle, IButtonGroupDefaultProps> = (
  props,
  ref,
) => {
  const { dict, style, className, getCurrentValue, value } = props;
  const [type, setType] = useState<IButtonGroupDefaultProps['value']>(value);

  useImperativeHandle(ref, () => ({ type }));

  const handleOnChange = (value: Parameters<IButtonGroupDefaultProps['getCurrentValue']>[0]) => {
    setType(value);
    if (getCurrentValue) getCurrentValue(value);
  };

  return (
    <Button.Group
      style={{
        '--colorPrimary': themeConfig?.variables?.colorPrimary,
        '--colorBorder': themeConfig?.variables?.colorBorder,
        ...style,
      }}
      size="small"
      className={`btnGroup ${className}`}
    >
      {(dict || [])?.map((item) => (
        <Button
          key={item.value as string}
          type={item.value === type ? 'primary' : 'default'}
          onClick={() => handleOnChange(item.value)}
        >
          {item?.label ?? '--'}
        </Button>
      ))}
    </Button.Group>
  );
};

export default React.forwardRef(ButtonGroup);
