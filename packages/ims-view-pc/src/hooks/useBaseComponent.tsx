import { useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { useMount } from 'react-use';
import type { CommonSearchHandle } from '../components/CommonSearch/interface';
import type { CommonTableRef, RequestParams } from '../components/CommonTable/interface';

type UseBaseComponent<Record, Params, Values, Rest> = (params?: {
  defaultSearchParams?: RequestParams<Params>;
  defaultLoading?: boolean;
  defaultSelectedRows?: Record[];
  defaultSelectedRowKeys?: React.Key[];
  defaultExpandedRowKeys?: React.Key[];
  initRequest?: boolean;
  onSelect?: (selectRowKeys: React.Key[], selectedRows: Record[]) => any;
  onExpand?: (expanded: boolean, record: Record) => any;
  expandKeys?: keyof Record;
}) => {
  ActionRef: React.MutableRefObject<CommonTableRef<Record, Params>>;
  FormRef: React.MutableRefObject<CommonSearchHandle<Values, Rest>>;

  searchParams: RequestParams<Params>;
  setSearchParams: Dispatch<SetStateAction<RequestParams<Params>>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;

  handleRefreshPage: Function;
  handleDynamicParams: (newParams: any) => any;
  getSearchParams: CommonTableRef<Record, Params>['getSearchParams'];
  getPagination: CommonTableRef<Record, Params>['getPagination'];
  getSorter: CommonTableRef<Record, Params>['getSorter'];
  getDataSource: CommonTableRef<Record, Params>['getDataSource'];
  handleSearch: (values: Values) => any;

  handleSelect: (selectedRowKeys: React.Key[], selectedRows: Record[]) => any;
  handleClearSelected: () => any;
  handleExpand: (expanded: boolean, record: Record) => any;
  handleClearExpanded: () => any;

  selectedRows: Record[];
  setSelectedRows: Dispatch<SetStateAction<Record[]>>;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<React.Key[]>>;
  expandedRowKeys: React.Key[];
  setExpandedRowKeys: Dispatch<SetStateAction<React.Key[]>>;
};

const useBaseComponent = <Record, Params, Values, Rest>(
  props: Parameters<UseBaseComponent<Record, Params, Values, Rest>>[0],
): ReturnType<UseBaseComponent<Record, Params, Values, Rest>> => {
  const {
    defaultSearchParams = {} as RequestParams<Params>,
    defaultLoading = false,
    defaultSelectedRows = [],
    defaultSelectedRowKeys = [],
    defaultExpandedRowKeys = [],

    initRequest = true,
    onSelect,
    expandKeys = 'index',
    onExpand,
  } = props || {};

  const ActionRef = useRef<CommonTableRef<Record, Params>>(null!);
  const FormRef = useRef<CommonSearchHandle<Values, Rest>>(null!);

  const [searchParams, setSearchParams] = useState<RequestParams<Params>>(defaultSearchParams);
  const [loading, setLoading] = useState<boolean>(defaultLoading);
  const [selectedRows, setSelectedRows] = useState<Record[]>(defaultSelectedRows);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(defaultSelectedRowKeys);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>(defaultExpandedRowKeys);

  useMount(() => {
    if (initRequest) {
      handleDynamicParams({});
    }
  });

  const handleRefreshPage = () => {
    ActionRef.current?.handleRefreshPage((searchParams, pagination, sorter) => [
      searchParams,
      pagination,
      sorter,
    ]);
    handleClearSelected();
  };

  const handleSearch = async (values) => {
    ActionRef.current?.handleRefreshPage((searchParams, pagination, sorter) => [
      values,
      pagination,
      sorter,
    ]);
    handleClearSelected();
    handleSelect([], []);
  };

  const handleDynamicParams = (newParams: any) => {
    const [_, values] = FormRef.current?.getRealValues();
    handleSearch({
      ...values,
      ...(newParams || {}),
    });
  };

  const handleSelect = (selectedRowKeys: React.Key[], selectedRows: Record[]) => {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
    if (onSelect) {
      onSelect(selectedRowKeys, selectedRows);
    }
  };

  const handleExpand = (expanded: boolean, record: Record) => {
    if (!expanded) {
      setExpandedRowKeys([]);
      if (onExpand) {
        onExpand(expanded, record);
      }
      return;
    }
    const _expandedRowKeys = record?.[expandKeys as string];
    if (_expandedRowKeys) {
      setExpandedRowKeys([_expandedRowKeys]);
      if (onExpand) {
        onExpand(expanded, record);
      }
    }
  };

  const handleClearSelected = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
    if (onSelect) onSelect([], []);
  };

  const handleClearExpanded = () => {
    setExpandedRowKeys([]);
  };

  const getSearchParams = () => {
    const { getSearchParams: _getSearchParams } = ActionRef.current || {};
    return _getSearchParams?.();
  };

  const getPagination = () => {
    const { getPagination: _getPagination } = ActionRef.current || {};
    return _getPagination?.() || {};
  };

  const getSorter = () => {
    const { getSorter: _getSorter } = ActionRef.current || {};
    return _getSorter?.();
  };

  const getDataSource = () => {
    const { getDataSource: _getDataSource } = ActionRef.current || {};
    return _getDataSource?.();
  };

  return {
    ActionRef,
    FormRef,

    searchParams,
    setSearchParams,
    loading,
    setLoading,

    handleRefreshPage,
    handleDynamicParams,
    getSearchParams,
    getPagination,
    getSorter,
    getDataSource,
    handleSearch,

    handleSelect,
    handleClearSelected,
    handleExpand,
    handleClearExpanded,

    selectedRows,
    setSelectedRows,
    selectedRowKeys,
    setSelectedRowKeys,
    expandedRowKeys,
    setExpandedRowKeys,
  };
};

export default useBaseComponent;
