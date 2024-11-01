import { PlusCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Card, Form, message } from 'antd';
import dayjs from 'dayjs';
import { CommonEditTable, ICommonEditTableColumnsType, ICommonEditTableHandle } from 'ims-view-pc';
import _ from 'lodash';
import React from 'react';

export interface IRecord {
  userName?: string;
  time?: dayjs.Dayjs;
  age?: number;
  key?: string;
}

export interface IFormValues {
  EditTable?: IRecord[];
}

export interface IColumnsExtraRecord {}

const Demo2 = () => {
  const [form] = Form.useForm<IFormValues>();
  const currentEditValueRef = React.useRef<any[]>([]);
  const editableKeysRef = React.useRef<string[]>([]);

  const EditTableRef = React.useRef<ICommonEditTableHandle<IRecord, IFormValues>>(null!);

  const handleOnSubmit = async () => {
    if (editableKeysRef.current.length > 0) {
      return message.warning('请先保存编辑项');
    }

    form
      .validateFields()
      .then(() => message.success('校验成功'))
      .catch((error) => {
        console.log(error);
        message.error(
          `检验失败 ${error?.errorFields[0]?.errors[0]}
          (请检查: 第${error?.errorFields[0]?.name?.[1] + 1}行)
          `,
        );
      });
  };

  const columns: ICommonEditTableColumnsType<IRecord, IColumnsExtraRecord, IFormValues>[] = [
    {
      dataIndex: 'userName',
      title: '姓名',
      type: 'update',
      align: 'center',
      ellipsis: true,
      width: 100,
      tooltip: 'sss',
      editable: true,
      formItemProps: {
        itemProps: {
          noStyle: true,
          shouldUpdate: (pre, cru, index) => {
            return !_.isEqual(pre?.EditTable?.[index]?.['age'], cru?.EditTable?.[index]?.['age']);
          },
          next: (values, form, index) => {
            console.log(values, index, 'lo');
            const record = values?.EditTable?.[index];
            if (record?.age === 10) return '---';
            return [
              {
                name: [index, 'userName'],
                type: 'input',
                rules: [{ required: true, message: '请输入姓名' }],
              },
            ];
          },
        },
      },
    },
    {
      dataIndex: 'time',
      title: '时间',
      type: 'date',
      align: 'center',
      formatTime: true,
      width: 100,
      formItemProps: {
        itemProps: {
          rules: [{ required: true }],
        },
      },
      editable: true,
    },
    {
      dataIndex: 'age',
      title: '数额',
      type: 'inputNumber',
      align: 'center',
      formatNumber: true,
      width: 100,
      formItemProps: {
        itemProps: {
          rules: [{ required: true }],
        },
      },
      editable: true,
    },
  ];

  return (
    <Card>
      <Form form={form}>
        <CommonEditTable<IRecord, IColumnsExtraRecord, IFormValues>
          form={form}
          ref={EditTableRef}
          isMultiple={false}
          editableKeys={editableKeysRef}
          // isVirtual
          initialValues={Array.from({ length: 3 }).map((_, index) => ({
            userName:
              '张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三',
            key: String(index),
            age: 21260,
          }))}
          curryParams={{ editableKeysRef }}
          columns={columns}
          buttonLeft={[]}
          buttonRight={[
            {
              type: 'default',
              element: '添加到头部',
              itemProps: {
                buttonProps: {
                  onClick: (renderProps, operation, status, val) => {
                    operation.add({ userName: '张三', key: String(Math.random()) }, 0);
                  },
                },
              },
              visible: (renderProps, operation, status) => status == 'edit',
            },
            (renderProps, operation, status) => ({
              type: 'default',
              element: '全部删除',
              visible: status == 'edit',
              itemProps: {
                buttonProps: {
                  danger: true,
                  disabled: status == 'view',
                  onClick: () => form.setFieldsValue({ EditTable: [] }),
                  icon: <WarningOutlined />,
                },
              },
            }),
          ]}
          itemButton={[
            {
              type: 'delete',
              element: '删除',
              itemProps: {
                handleDeleteConfirm: (renderProps, operation, status, val) => {
                  operation.remove(renderProps.index);
                  operation.add({ key: 'TIMEOUT' }, 0);
                  operation.remove(0);
                },
                deleteText: '确认删除嘛',
              },
              visible: (renderProps, operation, status) => {
                return !editableKeysRef.current.includes(renderProps?.record?.key);
              },
            },
            {
              type: 'default',
              buttonType: 'link',
              element: '编辑',
              itemProps: {
                buttonProps: {
                  onClick: (renderProps, operation) => {
                    if (editableKeysRef.current?.length >= 2) {
                      return message.error('最多只能同时编辑两项');
                    }
                    editableKeysRef.current = [...editableKeysRef.current, renderProps.record.key];
                    currentEditValueRef.current = [
                      ...currentEditValueRef.current,
                      renderProps.record,
                    ];
                    operation.add({ key: 'TIMEOUT' }, 0);
                    operation.remove(0);
                  },
                },
              },
              visible: (renderProps) => {
                return !editableKeysRef.current.includes(renderProps?.record?.key);
              },

              // (renderProps, operation, status) => {
              //   return {
              //     type: 'default',
              //     buttonType: 'link',
              //     element: '编辑',
              //     itemProps: {
              //       buttonProps: {
              //         onClick: () => {
              //           if (editableKeys?.length >= 2) {
              //             return message.error('最多只能同时编辑两项');
              //           }
              //           setEditableKeys([...editableKeys, renderProps.record.key]);
              //           setCurrentEditValue([...currentEditValue, renderProps.record]);
              //         },
              //       },
              //     },
              //     visible: () => {
              //       return !editableKeys.includes(renderProps?.record?.key);
              //     },
              //   };
              // return (curryParams) => {
              //   const btnProps: IBaseEditButtonProps<IRecord, true> = {
              //     type: 'default',
              //     buttonType: 'link',
              //     element: '编辑',
              //     itemProps: {
              //       buttonProps: {
              //         onClick: () => {
              //           console.log(curryParams.editableKeys, editableKeys);
              //           if (curryParams.editableKeys?.length >= 2) {
              //             return message.error('最多只能同时编辑两项');
              //           }
              //           setEditableKeys([...editableKeys, renderProps.record.key]);
              //           setCurrentEditValue([...currentEditValue, renderProps.record]);
              //         },
              //       },
              //     },
              //     visible: () => {
              //       return !editableKeys.includes(renderProps?.record?.key);
              //     },
              //   };
              //   return btnProps;
              // };
            },
            {
              buttonType: 'link',
              element: '保存',
              itemProps: {
                buttonProps: {
                  onClick: async (renderProps, operation, status, val) => {
                    await form.validateFields([
                      ['EditTable', renderProps.index, 'userName'],
                      ['EditTable', renderProps.index, 'time'],
                      ['EditTable', renderProps.index, 'age'],
                    ]);

                    currentEditValueRef.current = currentEditValueRef.current.filter(
                      (item) => item.key !== renderProps.record.key,
                    );
                    editableKeysRef.current = editableKeysRef.current.filter(
                      (item) => item !== renderProps.record.key,
                    );
                    operation.add({ key: 'TIMEOUT' }, 0);
                    operation.remove(0);
                  },
                },
              },
              visible: (renderProps, operation, status) => {
                return editableKeysRef.current.includes(renderProps.record.key);
              },
            },
            {
              buttonType: 'link',
              element: '取消',
              itemProps: {
                buttonProps: {
                  onClick: (renderProps, operation, status, val) => {
                    const newValues = renderProps.arr;
                    newValues[renderProps.index] = currentEditValueRef.current.find(
                      (item) => item.key === renderProps.record.key,
                    );
                    form.setFieldsValue({ EditTable: newValues });
                    currentEditValueRef.current = currentEditValueRef.current.filter(
                      (item) => item.key !== renderProps.record.key,
                    );

                    editableKeysRef.current = editableKeysRef.current.filter(
                      (item) => item !== renderProps.record.key,
                    );
                    operation.add({ key: 'TIMEOUT' }, 0);
                    operation.remove(0);
                  },
                },
              },
              visible: (renderProps, operation, status) => {
                return editableKeysRef.current.includes(renderProps.record.key);
              },
            },
          ]}
          afterChildren={(values) => {
            return (
              <div style={{ display: 'grid', placeContent: 'center' }}>
                <Button
                  type="link"
                  icon={<PlusCircleOutlined />}
                  onClick={() => {
                    const key = String(Math.random());
                    values.operation.add({ userName: '张三', time: dayjs(), key });
                  }}
                >
                  添加
                </Button>
              </div>
            );
          }}
        />
        <Form.Item>
          <Button htmlType="submit" type="primary" onClick={handleOnSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Demo2;
