import React from 'react';
import CommonDesc from './Descriptions';
import { IDescriptionsHandle, IDescriptionsProps } from './interface';

const CompoundedCommonDescList = React.forwardRef<IDescriptionsHandle, IDescriptionsProps>(
  CommonDesc,
) as <Values = Record<string, unknown>>(
  props: React.PropsWithChildren<IDescriptionsProps<Values>> & {
    ref?: React.Ref<IDescriptionsHandle<Values>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCommonDescList;

const CommonDescriptions = CompoundedCommonDescList as CompoundedComponent;

export default CommonDescriptions;
