import { Empty, Flex, Space, Spin, Table, TableProps } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { PaginationProps } from 'antd/lib';
import { CustomTooltip, type IColumnsType } from 'ims-view-pc';
import _ from 'lodash';
import React, { useImperativeHandle, useMemo, useState } from 'react';
import { useAsyncFn, useLatest, useMount } from 'react-use';
import { formatColumn } from '../../core/helpers';
import AccessBtn from '../AccessBtn';
import './index.less';
import { CommonTableProps, CommonTableRef, RequestParams, RequestSorter } from './interface';

//#region
const getDefaultProps = (
  p: CommonTableProps,
): Partial<CommonTableProps> & {
  pagination: Exclude<CommonTableProps['pagination'], false>;
} => ({
  ...p,
  theme: p.theme || 'light',
  isVirtual: p?.isVirtual ?? false,
  wrapperClassName: [`${p?.wrapperClassName}`, 'common-table-wrap'].join(' '),
  className: [p?.className, `common-table-theme-${p.theme}`, 'common-table'].join(' '),
  size: p.size || 'small',
  style: {
    '--alternateColor': '#fafafa',
    ...p.style,
  },
  loading: p.loading || false,
  dataSource: p.dataSource || [],
  initRequest: p.initRequest ?? false,
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
    pageSize: p?.defaultPageSize ?? 10,
    total: 0,
    ...p?.pagination,
  },
  accessCollection: p?.accessCollection || [],
  itemButtonWidth: p?.itemButtonWidth ?? 100,
  itemButton: p?.itemButton,
  buttonLeft: p?.buttonLeft || [],
  buttonRight: p?.buttonRight || [],
  rowKey: p?.rowKey ?? 'index',
  selectedRowKeys: p?.selectedRowKeys || [],
  selectedRows: p?.selectedRows || [],
  selectType: p?.selectType ?? false,
  isSummary: p?.isSummary ?? false,
  summaryDataSource: p?.summaryDataSource || [],
  summaryPosition: p?.summaryPosition ?? 'top',
  removeSummary: p?.removeSummary ?? [],
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
    summaryDataHandler,
    columns: defaultColumns,
    showSorterTooltip,
    pagination: defaultPagination,
    rowKey,
    isVirtual,
    itemButtonWidth,
    itemButton,
    accessCollection,
    buttonLeft,
    buttonRight,
    children,
    rowSelection,
    selectedRowKeys,
    selectedRows,
    selectType,
    onSelect,
    expandable,
    isSummary,
    summaryDataSource: newSummaryDataSource,
    summaryPosition,
    removeSummary,
    searchParams: defaultSearchParams,
    setSearchParams: defaultSetSearchParams,
    ...restProps
  } = props;
  const [columns, setColumns] = useState<CommonTableProps['columns']>([]);
  const [currentSearchParams, setCurrentSearchParams] = useState<RequestParams>();
  const [sorter, setSorter] = useState<RequestSorter>({
    order: undefined,
    sorter: undefined,
  });
  const [pagination, setPagination] = useState<PaginationProps>(defaultPagination);

  const searchParams = defaultSetSearchParams ? defaultSearchParams : currentSearchParams;
  const setSearchParams = defaultSetSearchParams ? defaultSetSearchParams : setCurrentSearchParams;

  // latest state
  const newSearchParams = useLatest<RequestParams>(searchParams);
  const newSorter = useLatest<RequestSorter>(sorter);
  const newPagination = useLatest<PaginationProps>(pagination);
  const newParams = useLatest<any>(params);
  //#endregion

  useMount(() => {
    setSearchParams((p) => ({ ...p, ...defaultParams, ...newParams.current }));
    if (initRequest) {
      loadData();
    } else {
      handleColumns();
    }
  });

  //#region
  const [{ value: tableResult = [[], []], loading }, fetchData] = useAsyncFn<
    (
      searchParams: RequestParams,
      pagination: { current: number; pageSize: number },
      sorter: RequestSorter,
    ) => Promise<[any[], any[]]>
  >(async (searchParams, pagination, sorter) => {
    try {
      const currentSearchParams: RequestParams = {
        ...searchParams,
        page: pagination.current,
        pageSize: pagination.pageSize,
      };
      const result = await request?.(currentSearchParams, sorter);
      let data: any[] = result?.data || [];
      let mergeData: any[] = [];

      let summaryData: any[] = result?.summaryData || [];
      let summaryMergeData: any[] = [];

      if (dataHandler) {
        mergeData = data.map((item, index) => ({
          ...item,
          index,
          rowKey: item?.[rowKey as 'index'],
        }));
      }
      if (summaryDataHandler) {
        summaryMergeData = summaryData.map((item, index) => ({
          ...item,
          index,
          rowKey: item?.[rowKey as 'index'],
        }));
      }

      const resultData = dataHandler ? dataHandler(mergeData, data) || [] : result?.data || [];
      const total = result?.total || data?.length || 0;

      const summaryResultData = summaryDataHandler
        ? summaryDataHandler(summaryMergeData, summaryData) || []
        : result?.summaryData || [];

      setSearchParams(currentSearchParams);
      setPagination((p) => ({
        ...p,
        total,
      }));

      if (result?.success) {
        return [resultData, summaryResultData];
      } else {
        return [[], []];
      }
    } catch (error) {
      console.error(error);
      return [[], []];
    }
  }, []);

  const data = useMemo(() => {
    return tableResult?.[0] || [];
  }, [tableResult]);

  const summaryDataSource = useMemo(() => {
    return tableResult?.[1] || [];
  }, [tableResult]);
  //#endregion

  //#region
  const loadData = async () => {
    fetchData(
      { ...newSearchParams.current, ...newParams.current },
      { current: pagination.current, pageSize: pagination.pageSize },
      newSorter.current,
    );
    handleColumns();
  };

  const handleColumns = () => {
    const columns: IColumnsType = [
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        fixed: 'right',
        width: itemButtonWidth,
        useSummary: () => <CustomTooltip.Empty />,
        render: (text, record, index) => {
          let itemButtons = Array.isArray(itemButton)
            ? itemButton || []
            : itemButton(text, record, index) || [];

          return (
            <AccessBtn
              emptyText={<CustomTooltip.Empty />}
              btnList={itemButtons}
              accessCollection={accessCollection}
            />
          );
        },
      },
    ];
    setColumns(formatColumn([...defaultColumns, ...(itemButton === null ? [] : columns)]));
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

  const renderSummary = (currentData: any[], columns: any[]) => {
    type IColumnsItemType = IColumnsType extends (infer U)[] ? U : any[];
    let newColumns = formatColumn(_.flattenDeep(columns)) as IColumnsType;
    let defaultIndex = 0;

    if (onSelect) {
      newColumns.unshift({} as any);
      defaultIndex++;
    }

    if (expandable?.onExpand) {
      newColumns.unshift({} as any);
      defaultIndex++;
    }

    const renderCell = (item: IColumnsItemType, index: number, currentItemData: any) => {
      const textAlign = item.align ? item.align : 'center';
      const _renderSummaryCell = (
        index: number,
        content: React.ReactNode,
        align: 'left' | 'right' | 'center' = 'left',
      ) => {
        return (
          <Table.Summary.Cell key={index} index={index}>
            <div style={{ textAlign: align }}>{content}</div>
          </Table.Summary.Cell>
        );
      };
      if (index == defaultIndex) {
        const content = item.useSummary ? item.useSummary('合计', currentItemData) : '合计';
        return _renderSummaryCell(defaultIndex, content, 'center');
      }
      if (
        removeSummary &&
        removeSummary?.length != 0 &&
        removeSummary?.includes(item?.dataIndex as any)
      ) {
        return _renderSummaryCell(index, <CustomTooltip.Empty />, textAlign as any);
      }
      const text = currentItemData?.[item?.dataIndex as any];
      let content =
        text != '合计' ? (item.render ? item?.render(text, currentItemData, index) : text) : '';
      if (item.useSummary) content = item.useSummary(content, currentItemData);

      return _renderSummaryCell(index, content ?? <CustomTooltip.Empty />, textAlign as any);
    };

    return (
      <Table.Summary fixed={summaryPosition}>
        {(currentData || []).map((ele, index) => (
          <Table.Summary.Row key={index}>
            {newColumns.map((item, index) => renderCell(item, index, ele))}
          </Table.Summary.Row>
        ))}
      </Table.Summary>
    );
  };

  const handleOnSelectChange = (selectedRowKeys: any[], selectedRows: any[]) => {
    if (onSelect) {
      onSelect(selectedRowKeys, selectedRows);
    }
  };

  //#endregion

  useImperativeHandle(ref, () => ({
    handleRefreshPage: async (customFn) => {
      const newFn = () => {
        return customFn(
          { ...newSearchParams.current, ...newParams.current },
          { current: newPagination.current.current, pageSize: newPagination.current.pageSize },
          newSorter.current,
        );
      };
      return await fetchData(...newFn());
    },
    getSearchParams: () => newSearchParams.current,
    getPagination: () => newPagination.current || {},
    getSorter: () => (newSorter.current || {}) as RequestSorter,
    getDataSource: () => [data, summaryDataSource],
  }));

  const selectOptions = onSelect
    ? {
        type: selectType === 'radio' ? ('radio' as const) : ('checkbox' as const),
        selectedRowKeys,
        columnWidth: 40,
        onChange: handleOnSelectChange,
        ...rowSelection,
      }
    : null;

  return (
    <div className={wrapperClassName} style={style}>
      <Spin spinning={defaultLoading || loading}>
        <Space size={8} direction="vertical">
          <Flex gap="middle" justify="space-between" wrap align="center">
            <AccessBtn btnList={buttonLeft} accessCollection={accessCollection} />
            <AccessBtn btnList={buttonRight} accessCollection={accessCollection} />
          </Flex>
          <Table
            rowKey={rowKey}
            className={className}
            size={size}
            showSorterTooltip={showSorterTooltip}
            columns={columns}
            dataSource={props?.request ? data : dataSource}
            pagination={p.pagination === false ? false : pagination}
            onChange={handleTableOnChange}
            virtual={isVirtual}
            rowSelection={selectOptions}
            summary={() =>
              isSummary && (newSummaryDataSource || summaryDataSource)
                ? renderSummary(
                    newSummaryDataSource?.length != 0 ? newSummaryDataSource : summaryDataSource,
                    columns,
                  )
                : null
            }
            bordered
            locale={{
              emptyText: (
                <Empty
                  description={'暂无数据'}
                  style={{
                    color: '#b3b8c2',
                    fontSize: 12,
                    height: 500,
                    display: 'grid',
                    placeContent: 'center',
                  }}
                />
              ),
            }}
            expandable={expandable}
            {...restProps}
          />
          {children}
        </Space>
      </Spin>
    </div>
  );
};

export default CommonTable;
