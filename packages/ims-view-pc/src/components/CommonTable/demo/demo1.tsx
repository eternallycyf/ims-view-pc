import { Form, InputNumber } from 'antd';
import { CommonSearch, CommonTable, ExportButton, useBaseComponent } from 'ims-view-pc';
import { useState } from 'react';
import { columns } from './config/columns';
import { ACTIVE_TYPE, rowKey } from './config/constant';
import type { ExtraSearchParams, Record, RestParams, SearchesValues } from './config/interface';
import { formList } from './config/search';

const Demo = () => {
  const {
    ActionRef,
    FormRef,
    setLoading,
    loading,
    searchParams,
    setSearchParams,
    handleSearch,
    handleSelect,
    handleClearSelected,
    selectedRows,
    selectedRowKeys,
    expandedRowKeys,
    handleExpand,
    handleRefreshPage,
    handleDynamicParams,
  } = useBaseComponent<Record, ExtraSearchParams, SearchesValues, RestParams>({
    expandKeys: rowKey,
    onSelect(selectRowKeys, selectedRows) {
      console.log(selectRowKeys, selectedRows);
    },
    onExpand(expanded, record) {
      console.log(expanded, record);
    },
  });
  const [groupValue, getGroupValue] = useState<(typeof ACTIVE_TYPE)[number]['value']>('1');

  return (
    <div>
      <CommonSearch<SearchesValues, RestParams>
        formList={formList}
        onSearch={handleSearch}
        loading={loading}
        ref={FormRef}
      />
      <CommonTable<Record, ExtraSearchParams>
        columns={columns}
        loading={loading}
        ref={ActionRef}
        sticky
        params={{ groupValue }}
        style={{}}
        className="commonTable"
        defaultPageSize={10}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        // isVirtual
        // scroll={{x:1000,y:300}}
        // bordered={false}
        selectType="checkbox"
        onSelect={handleSelect}
        pagination={{ defaultPageSize: 30 }}
        onRow={(record, index) => {
          return {
            onClick: () => {
              // console.log(record, index);
            },
          };
        }}
        expandable={{
          expandedRowKeys,
          expandedRowRender: (record, index) => <div>1</div>,
          rowExpandable: (record) => {
            return true;
          },
          onExpand: handleExpand,
        }}
        accessCollection={['link', 'delete', 'group', 'custom']}
        selectedRows={selectedRows}
        selectedRowKeys={selectedRowKeys}
        isSummary
        rowKey={rowKey}
        buttonLeft={[
          {
            type: 'default',
            element: '删除',
            buttonType: 'primary',
            code: 'delete',
            itemProps: {},
          },
          {
            type: 'custom',
            code: 'custom',
            element: (
              <Form.Item label="万" style={{ marginBottom: 0 }}>
                <InputNumber />
              </Form.Item>
            ),
          },
        ]}
        buttonRight={[
          {
            type: 'group',
            code: 'group',
            itemProps: {
              groupValue,
              handleGroupValueOnChange: (val: (typeof ACTIVE_TYPE)[number]['value']) => {
                getGroupValue(val);
                handleDynamicParams({
                  groupValue: val,
                });
              },
              groupDict: ACTIVE_TYPE,
            },
          },
          {
            type: 'default',
            buttonType: 'link',
            element: '链接',
            code: 'link',
            itemProps: {
              buttonProps: {
                onClick: (e) => console.log(e),
              },
            },
          },
          {
            type: 'custom',
            element: (
              <ExportButton<Record, {}>
                columns={columns}
                fileName="文件"
                setSheetStyle={({}) => {
                  return {
                    views: [
                      {
                        state: 'frozen',
                        xSplit: 0,
                        ySplit: 2,
                      },
                    ],
                  };
                }}
                request={() => {
                  return new Promise((resolve) => {
                    const params = new URLSearchParams(
                      Object.entries({
                        ...ActionRef.current.getSearchParams(),
                        results: ActionRef.current.getPagination()?.pageSize,
                      } as any),
                    ).toString();

                    fetch(`https://randomuser.me/api?${params}`)
                      .then((res) => res.json())
                      .then(({ results }) => {
                        console.log(
                          [results?.[0], ...results].map((item, index) => ({
                            ...item,
                            index: index === 0 ? '合计' : index + 1,
                          })),
                        );
                        resolve({
                          data: [results?.[0], ...results].map((item, index) => ({
                            ...item,
                            index: index === 0 ? '合计' : index + 1,
                          })),
                          total: results?.length + 1,
                          success: true,
                        });
                      });
                  });
                }}
              />
            ),
          },
        ]}
        itemButton={(text, record, index) => [
          {
            type: 'default',
            buttonType: 'link',
            element: '链接',
            code: 'link',
            itemProps: {
              buttonProps: {
                onClick: (e) => console.log(e),
              },
            },
          },
          {
            type: 'delete',
            element: '删除',
            code: 'delete',
            itemProps: {
              deleteText: '确认删除嘛?',
              handleDeleteConfirm: (e) => console.log(e),
            },
          },
        ]}
        dataHandler={(data, dataSource) => {
          return data?.map((item, index) => ({
            ...item,
            index: index + 1,
          }));
        }}
        request={(searchParams, sorter) => {
          return new Promise((resolve) => {
            const params = new URLSearchParams(
              Object.entries({ ...sorter, ...searchParams, results: searchParams.pageSize } as any),
            ).toString();
            fetch(`https://randomuser.me/api?${params}`)
              .then((res) => res.json())
              .then(({ results }) => {
                resolve({
                  data: results,
                  summaryData: [results?.[0]],
                  total: 200,
                  success: true,
                });
              });
          });
        }}
      />
    </div>
  );
};

export default Demo;
