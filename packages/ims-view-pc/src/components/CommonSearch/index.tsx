import { AnyData } from 'ims-view-pc';
import React from 'react';
import InstanceCommonSearch from './CommonSearch';
import './index.less';
import type { CommonSearchHandle, CommonSearchProps } from './interface';

const CompoundedCommonSearch = React.forwardRef<CommonSearchHandle, CommonSearchProps>(
  InstanceCommonSearch,
) as <Values = AnyData, Params = AnyData, Rest = AnyData>(
  props: CommonSearchProps<Values, Params, Rest> & {
    ref?: React.Ref<CommonSearchHandle<Values, Params, Rest>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCommonSearch & {};

const CommonSearch = CompoundedCommonSearch as CompoundedComponent;

export default CommonSearch;
