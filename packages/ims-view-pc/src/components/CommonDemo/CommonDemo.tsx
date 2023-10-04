import { useFetch } from '@ims-view/hooks';
import React, { Fragment, useImperativeHandle } from 'react';
import { ICommonDemoHandle, ICommonDemoProps } from './interface';

const CommonDemo: React.ForwardRefRenderFunction<ICommonDemoHandle, ICommonDemoProps> = (
  props,
  ref,
) => {
  const { fetchConfig, dataHandler, request, children } = props;
  const [{ value: data = {}, loading }, fetchData] = useFetch({
    fetchConfig,
    dataHandler,
    request,
  });

  useImperativeHandle(ref, () => ({
    data,
    loading,
    fetchData,
  }));

  return <Fragment>{children}</Fragment>;
};

export default CommonDemo;
