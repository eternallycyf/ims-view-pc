import {
  PlusCircleOutlined,
  VerticalAlignBottomOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useForceUpdate } from '@ims-view/hooks';
import { Button, Card, Form, message } from 'antd';
import dayjs from 'dayjs';
import {
  CommonEditTable,
  IBaseEditButtonProps,
  ICommonEditTableColumnsType,
  ICommonEditTableHandle,
  ICommonEditTableProps,
} from 'ims-view-pc';
import React, { useEffect } from 'react';

export interface IRecord {
  userName: string;
  time?: dayjs.Dayjs;
  age?: number;
  key: string;
}

export interface IFormValues {
  EditTable?: IRecord[];
}

export interface IColumnsExtraRecord {}

export const columns: ICommonEditTableColumnsType<IRecord, IColumnsExtraRecord>[] = [
  {
    dataIndex: 'userName',
    title: '姓名',
    type: 'input',
    align: 'center',
    ellipsis: true,
    width: 100,
    tooltip: 'sss',
    editable: true,
    formItemProps: {
      itemProps: {
        rules: [{ required: true, message: '请输入姓名' }],
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

const Demo2 = () => {
  const [form] = Form.useForm<IFormValues>();
  const [editableKeys, setEditableKeys] = React.useState<string[]>([]);
  const [currentEditValue, setCurrentEditValue] = React.useState<any[]>([]);
  const EditTableRef = React.useRef<ICommonEditTableHandle<IRecord, IFormValues>>(null!);

  const handleOnSubmit = async () => {
    const values = form.getFieldsValue();
    if (editableKeys.length > 0) {
      return message.warning('请先保存编辑项');
    }
    await form.validateFields();
    console.log(values, editableKeys);
  };

  return (
    <Card>
      <Form form={form}>
        <CommonEditTable<IRecord, IColumnsExtraRecord, IFormValues>
          form={form}
          ref={EditTableRef}
          isMultiple={false}
          editableKeys={editableKeys}
          // isVirtual
          initialValues={Array.from({ length: 3 }).map((_, index) => ({
            userName:
              '张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三',
            key: String(index),
            age: 21260,
          }))}
          curryParams={{ editableKeys }}
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
                },
                deleteText: '确认删除嘛',
              },
              visible: (renderProps, operation, status) => {
                return !editableKeys.includes(renderProps?.record?.key);
              },
            },
            {
              type: 'default',
              buttonType: 'link',
              element: '编辑',
              itemProps: {
                buttonProps: {
                  onClick: (renderProps) => {
                    if (editableKeys?.length >= 2) {
                      return message.error('最多只能同时编辑两项');
                    }
                    setEditableKeys([...editableKeys, renderProps.record.key]);
                    setCurrentEditValue([...currentEditValue, renderProps.record]);
                  },
                },
              },
              visible: (renderProps) => {
                return !editableKeys.includes(renderProps?.record?.key);
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
                    await form.validateFields();
                    setCurrentEditValue(
                      currentEditValue.filter((item) => item.key !== renderProps.record.key),
                    );
                    setEditableKeys(editableKeys.filter((item) => item !== renderProps.record.key));
                  },
                },
              },
              visible: (renderProps, operation, status) => {
                return editableKeys.includes(renderProps.record.key);
              },
            },
            {
              buttonType: 'link',
              element: '取消',
              itemProps: {
                buttonProps: {
                  onClick: (renderProps, operation, status, val) => {
                    const newValues = renderProps.arr;
                    newValues[renderProps.index] = currentEditValue.find(
                      (item) => item.key === renderProps.record.key,
                    );
                    form.setFieldsValue({ EditTable: newValues });
                    setCurrentEditValue(
                      currentEditValue.filter((item) => item.key !== renderProps.record.key),
                    );
                    setEditableKeys(editableKeys.filter((item) => item !== renderProps.record.key));
                  },
                },
              },
              visible: (renderProps, operation, status) => {
                return editableKeys.includes(renderProps.record.key);
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
          <Button type="primary" onClick={handleOnSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Demo2;
