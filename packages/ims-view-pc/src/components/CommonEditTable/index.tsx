import { Table as AntdTable } from 'antd';
import React, { FC } from 'react';
import EditTable from './EditTable';
import { ICommonEditTableHandle, ICommonEditTableProps } from './interface';
import Item from './Item';

export const Table: FC<{
  isVirtual: boolean;
  status?: ICommonEditTableProps['status'];
  [props: string]: any;
}> = (props) => {
  const { isVirtual, status, ...restProps } = props;
  // if (isVirtual) {
  //   return <VirtualScrollTable {...restProps} />;
  // }
  if (status === 'edit') {
    return <AntdTable {...restProps} />;
  }
  return <AntdTable {...(restProps as any)} />;
};

const CompoundedCommonEditTable = React.forwardRef<ICommonEditTableHandle, ICommonEditTableProps>(
  EditTable,
) as <
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  FormItemsValues = Record<string, unknown>,
>(
  props: React.PropsWithChildren<ICommonEditTableProps<Values, Rest, FormItemsValues>> & {
    ref?: React.Ref<ICommonEditTableHandle<Values, FormItemsValues>>;
  },
) => React.ReactElement;

type CompoundedComponent = typeof CompoundedCommonEditTable & {
  Item: typeof Item;
};

const CommonEditTable = CompoundedCommonEditTable as CompoundedComponent;

CommonEditTable.Item = Item;

export default CommonEditTable;
