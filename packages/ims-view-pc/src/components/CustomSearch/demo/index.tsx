import { Divider, Form, InputNumber } from 'antd';
import { CommonTable, CustomForm, ExportButton, type IColumnsType } from 'ims-view-pc';
import type { CustomFormList } from 'ims-view-pc/components/CustomForm/interface';
import type { CommonTableRef } from 'ims-view-pc';
import { useEffect, useRef, useState } from 'react';
import { columns as baseColumns } from '../../CommonTable/demo/config/columns';
import { ACTIVE_TYPE, rowKey } from '../../CommonTable/demo/config/constant';
import type { ExtraSearchParams, Record, RestParams } from '../../CommonTable/demo/config/interface';

type SearchesValues = {
  input: string;
  gender: string;
  groupValue: string;
};

const Demo = () => {
  const {
    CustomSearchParams,
    formValues,
  } = CustomForm.useCustomSearch<SearchesValues>({
    className: 'custom-search-demo',
    initValues: {
      input: '',
      gender: undefined,
      groupValue: '1',
    } as any,
  });

  const ActionRef = useRef<CommonTableRef<Record, ExtraSearchParams>>(null);
  const [loading, setLoading] = useState(false);
  const [groupValue, setGroupValue] = useState<(typeof ACTIVE_TYPE)[number]['value']>('1');

  const [selectedRows, setSelectedRows] = useState<Record[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const handleSelect = (keys: React.Key[], rows: Record[]) => {
    setSelectedRows(rows);
    setSelectedRowKeys(keys);
    console.log(keys, rows);
  };

  const handleExpand = (expanded: boolean, record: Record) => {
    if (!expanded) {
      setExpandedRowKeys([]);
    } else {
      const key = record?.[rowKey as string];
      if (key) setExpandedRowKeys([key]);
    }
    console.log(expanded, record);
  };

  const columns: IColumnsType<Record> = [
    ...baseColumns.slice(0, 2),
    {
      ...baseColumns[2],
      ...CustomForm.Utils.getColumnSearchItem<SearchesValues, {}>(
        {
          type: 'select',
          name: 'gender',
          tagName: 'gender',
          controlProps: {
            placeholder: '筛选性别',
            options: [
              { label: 'male', value: 'male' },
              { label: 'female', value: 'female' },
            ],
            allowClear: true,
          },
        },
        (formValues as any)?.gender,
      ),
    },
    baseColumns[3],
  ];

  const formList: CustomFormList<SearchesValues, RestParams> = [
    {
      name: 'input',
      label: '搜索',
      type: 'input',
      tagName: 'input',
      controlProps: {
        placeholder: '搜索用户名',
      },
    },
    {
      name: 'groupValue',
      label: '活动类型',
      type: 'select',
      tagName: 'groupValue',
      controlProps: {
        options: [...ACTIVE_TYPE],
        allowClear: true,
      },
    },
  ];

  const isFirstRender = useRef(true);
  useEffect(() => {
    const newGroup = (formValues as any)?.groupValue ?? '1';
    if (newGroup !== groupValue) setGroupValue(newGroup);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    ActionRef.current?.handleRefreshPage((searchParams, pagination, sorter) => [
      { ...searchParams, ...formValues, groupValue: newGroup } as any,
      pagination,
      sorter,
    ]);
    setSelectedRows([]);
    setSelectedRowKeys([]);
  }, [formValues]);

  return (
    <div style={{ height: 600, overflow: 'hidden' }}>
      <CustomForm.CustomSearch<SearchesValues, RestParams>
        {...CustomSearchParams}
        formList={formList}
      >
        <Divider style={{ margin: '4px 0' }} />
        <CommonTable<Record, ExtraSearchParams>
          columns={columns}
          loading={loading}
          ref={ActionRef}
          sticky
          params={{ groupValue }}
          style={{}}
          className="commonTable"
          defaultPageSize={10}
          scroll={{ x: 1200, y: 300 }}
          selectType="checkbox"
          onSelect={handleSelect}
          pagination={{ defaultPageSize: 30 }}
          onRow={(record, index) => {
            return {
              onClick: () => {},
            };
          }}
          expandable={{
            expandedRowKeys,
            expandedRowRender: (record, index) => <div>1</div>,
            rowExpandable: (record) => {
              return true;
            },
            onExpand: handleExpand,
            columnWidth: 40,
          }}
          accessCollection={['link', 'delete', 'custom']}
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
          initRequest
          request={(searchParams, sorter) => {
            return new Promise((resolve) => {
              const params = new URLSearchParams(
                Object.entries({
                  ...sorter,
                  ...searchParams,
                  results: searchParams.pageSize,
                } as any),
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
      </CustomForm.CustomSearch>
    </div>
  );
};

export default Demo;
