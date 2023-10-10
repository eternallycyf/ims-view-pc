import { useFetch } from '@ims-view/hooks';
import React, { Fragment, useImperativeHandle } from 'react';
import './index.less';
import { ICommonCardHandle, ICommonCardProps } from './interface';

const CommonCard: React.ForwardRefRenderFunction<ICommonCardHandle, ICommonCardProps> = (
  props,
  ref,
) => {
  const { children, fetchConfig, dataHandler, request } = props;

  const [{ value: data = {}, loading }, fetchData] = useFetch({
    request,
    fetchConfig,
    dataHandler,
  });

  useImperativeHandle(ref, () => ({
    data,
    loading,
    fetchData,
  }));

  return <Fragment>{children}</Fragment>;
};

export default CommonCard;
