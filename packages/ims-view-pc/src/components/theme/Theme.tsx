import React, { Fragment, useImperativeHandle } from 'react';
import { ThemeHandle, ThemeProps } from './interface';

const Theme: React.ForwardRefRenderFunction<ThemeHandle, ThemeProps> = (props, ref) => {
  useImperativeHandle(ref, () => ({}));

  return <Fragment></Fragment>;
};

export default Theme;
