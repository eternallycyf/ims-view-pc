import { AnyData } from 'ims-view-pc';
import React from 'react';
import FormRules from '../../core/helpers/validate';
import InstanceCommonSearch from './CommonSearch';
import './index.less';
import type { CommonSearchHandle, CommonSearchProps } from './interface';
import { SearchContext } from './SearchContext';

const CompoundedCommonSearch = React.forwardRef<CommonSearchHandle, CommonSearchProps>(
  InstanceCommonSearch,
) as <Values = AnyData, Params = AnyData, Rest = AnyData>(
  props: CommonSearchProps<Values, Params, Rest> & {
    ref?: React.Ref<CommonSearchHandle<Values, Params, Rest>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCommonSearch & {
  FormRules: typeof FormRules;
  Context: typeof SearchContext;
};

const CommonSearch = CompoundedCommonSearch as CompoundedComponent;

CommonSearch.FormRules = FormRules;
CommonSearch.Context = SearchContext;

export default CommonSearch;
