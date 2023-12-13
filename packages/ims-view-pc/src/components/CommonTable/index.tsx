import React from 'react';
import Table from './CommonTable';
import { AnyData, CommonTableProps, CommonTableRef } from './interface';

const CompoundedCommonTable = React.forwardRef<CommonTableRef, CommonTableProps>(Table) as <
  DataType = AnyData,
  Params = AnyData,
  Rest = AnyData,
>(
  props: React.PropsWithChildren<CommonTableProps<DataType, Params, Rest>> & {
    ref?: React.Ref<CommonTableRef<DataType, Params, Rest>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCommonTable & {};

const CommonTable = CompoundedCommonTable as CompoundedComponent;

export default CommonTable;
