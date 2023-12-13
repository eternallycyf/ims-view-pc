import { Spin, Table, TableProps } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { PaginationProps } from 'antd/lib';
import React, { useImperativeHandle, useState } from 'react';
import { useAsyncFn, useLatest, useMount } from 'react-use';
import { formatColumn } from '../../core/helpers';
import './index.less';
import {
  CommonTableProps,
  CommonTableRef,
  RequestData,
  RequestParams,
  RequestSorter,
} from './interface';

//#region
const getDefaultProps = (
  p: CommonTableProps,
): Partial<CommonTableProps> & {
  pagination: Exclude<CommonTableProps['pagination'], false>;
} => ({
  ...p,
  theme: p.theme || 'light',
  wrapperClassName: `${p?.wrapperClassName} common-table-wrap`,
  className: `${p?.className} common-table-theme-${p.theme} common-table `,
  size: p.size || 'small',
  style: {
    '--alternateColor': '#fafafa',
    ...p.style,
  },
  loading: p.loading || false,
  dataSource: p.dataSource || [],
  initRequest: p.initRequest ?? true,
  columns: p.columns || [],
  showSorterTooltip: p.showSorterTooltip ?? false,
  pagination: {
    hideOnSinglePage: true,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '50'],
    showTotal: (total: number, range: any[]) => {
      return `一共${total}条记录， 当前第${range[0]}条到${range[1]}条`;
    },
    defaultPageSize: 10,
    current: 1,
    pageSize: 10,
    total: 0,
    ...p?.pagination,
  },
  rowKey: 'index',
});
//#endregion

const CommonTable: React.ForwardRefRenderFunction<CommonTableRef, CommonTableProps> = (p, ref) => {
  //#region
  const props = getDefaultProps(p);
  const {
    theme,
    wrapperClassName,
    className,
    size,
    style,
    loading: defaultLoading,
    initRequest,
    dataSource,
    request,
    defaultParams,
    params,
    dataHandler,
    columns: defaultColumns,
    showSorterTooltip,
    pagination: defaultPagination,
    rowKey,
    ...restProps
  } = props;
  const [columns, setColumns] = useState<CommonTableProps['columns']>([]);
  const [searchParams, setSearchParams] = useState<RequestParams>();
  const [sorter, setSorter] = useState<RequestSorter>({
    order: undefined,
    sorter: undefined,
  });
  const [pagination, setPagination] = useState<PaginationProps>(defaultPagination);

  // latest state
  const newSearchParams = useLatest<RequestParams>(searchParams);
  const newSorter = useLatest<RequestSorter>(sorter);
  const newPagination = useLatest<PaginationProps>(pagination);
  //#endregion

  useMount(() => {
    setSearchParams((p) => ({ ...p, ...defaultParams }));
    initRequest && loadData();
  });

  //#region
  const [{ value: data = [], loading }, fetchData] = useAsyncFn<
    (
      searchParams: RequestParams,
      pagination: { current: number; pageSize: number },
      sorter: RequestSorter,
    ) => Promise<any[]>
  >(async (searchParams, pagination, sorter) => {
    try {
      const currentSearchParams: RequestParams = {
        ...searchParams,
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...params,
      };
      const result = await request?.(currentSearchParams, sorter);
      let data: any[] = result?.data || [];
      let mergeData: any[] = [];
      if (dataHandler) {
        mergeData = data.map((item, index) => ({
          ...item,
          index,
          rowKey: item?.[rowKey as 'index'],
        }));
      }
      const resultData = dataHandler ? dataHandler(mergeData, data) || [] : result?.data || [];
      const total = result?.total || data?.length || 0;

      setSearchParams(currentSearchParams);
      setPagination((p) => ({
        ...p,
        total,
      }));

      if (result?.success) {
        return resultData;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);
  //#endregion

  //#region
  const loadData = async () => {
    fetchData(
      newSearchParams.current,
      { current: pagination.current, pageSize: pagination.pageSize },
      newSorter.current,
    );
    handleColumns();
  };

  const handleColumns = () => {
    setColumns(formatColumn(defaultColumns));
  };

  const handleTableOnChange: TableProps<any>['onChange'] = (
    pagination,
    filters,
    sorter: SorterResult<any>,
    extra,
  ) => {
    setPagination(pagination);
    const order = sorter.order;
    const sort =
      sorter?.field && sorter.order
        ? String(sorter?.field).replace(/[A-Z]+/g, (match) => `_${match.toLowerCase()}`)
        : null;

    setSorter({ sorter: sort, order: order });
    fetchData(
      newSearchParams.current,
      { current: pagination.current, pageSize: pagination.pageSize },
      { order, sorter: sort },
    );
  };
  //#endregion

  useImperativeHandle(ref, () => ({
    handleRefreshPage: () =>
      fetchData(
        newSearchParams.current,
        { current: newPagination.current.current, pageSize: newPagination.current.pageSize },
        newSorter.current,
      ),
  }));

  return (
    <div className={wrapperClassName} style={style}>
      <Spin spinning={defaultLoading || loading}>
        <Table
          rowKey={rowKey}
          className={className}
          size={size}
          showSorterTooltip={showSorterTooltip}
          columns={columns}
          dataSource={props?.request ? data : dataSource}
          pagination={p.pagination === false ? false : pagination}
          onChange={handleTableOnChange}
          {...restProps}
        />
      </Spin>
    </div>
  );
};

export default CommonTable;
