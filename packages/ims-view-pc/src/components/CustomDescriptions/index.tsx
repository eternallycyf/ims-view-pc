import React from 'react';
import type { AnyData } from '../CommonTable/interface';
import CommonDesc from './Descriptions';
import { type CustomDescriptionsProps } from './interface';

const CompoundedCommonDescList = CommonDesc as <Values = AnyData, Params = AnyData>(
  props: React.PropsWithChildren<CustomDescriptionsProps<Values, Params>>,
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCommonDescList;

const CustomDescriptions = CompoundedCommonDescList as CompoundedComponent;

export default CustomDescriptions;
