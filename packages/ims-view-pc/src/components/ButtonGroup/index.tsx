import { Button } from 'antd';
import { variables } from 'ims-view-pc';
import React, { useState, useEffect } from 'react';
import './index.less';

export interface ButtonGroupProps<T = any> {
  value?: T;
  options?: { label: string; value: T }[];
  style?: React.CSSProperties;
  className?: string;
  onChange?: (value: T) => any;
}

const ButtonGroup = <T,>(props: ButtonGroupProps<T>) => {
  const { options, style, className, onChange, value } = props;
  const [type, setType] = useState<T>(value as T);

  useEffect(() => {
    setType(value as T);
  }, [value]);

  const handleOnChange = (value: T) => {
    setType(value);
    if (onChange) onChange(value);
  };

  return (
    <Button.Group
      style={
        {
          '--colorPrimary': '#1677ff',
          '--colorBorder': variables?.colorBorder,
          ...style,
        } as any
      }
      size="small"
      className={`ims-btnGroup ${className}`}
    >
      {(options || [])?.map((item) => (
        <Button
          key={item.value as string}
          type={item.value === type ? 'primary' : 'default'}
          onClick={() => handleOnChange(item?.value)}
        >
          {item?.label ?? '--'}
        </Button>
      ))}
    </Button.Group>
  );
};

export default ButtonGroup;
