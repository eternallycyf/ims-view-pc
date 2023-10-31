import {
  PlusCircleOutlined,
  VerticalAlignBottomOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Card, Form } from 'antd';
import dayjs from 'dayjs';
import {
  AccessBtn,
  CommonEditTable,
  ICommonEditTableHandle,
  ICommonEditTableProps,
} from 'ims-view-pc';
import React, { useEffect } from 'react';
import { getColumns } from './config/columns';

export interface IRecord {
  userName: string;
  time?: dayjs.Dayjs;
  ratio?: number;
}

export interface IFormValues {
  EditTable?: IRecord[];
}

export interface IColumnsExtraRecord {}

const Demo = () => {
  const [form] = Form.useForm<IFormValues>();
  const EditTableRef = React.useRef<ICommonEditTableHandle<IRecord, IFormValues>>(null!);
  const [status, setStatus] = React.useState<ICommonEditTableProps['status']>('edit');

  useEffect(() => {}, []);

  const handleOnSubmit = () => {
    const values = EditTableRef.current.form.getFieldsValue();
    console.log(values);
    form.validateFields();
  };

  const handleGetCurrentRatio = () => {};

  const handleCheckIsRatioExceedExcessie = (_: any, val: number) => {
    if (val == null) return Promise.reject('必填项');
    if (val == 0) return Promise.reject('比例不能为0');
    const tableValues = form.getFieldValue('EditTable') || [];
    if (tableValues?.length == 0) return Promise.resolve('');
    return Promise.resolve('');
  };

  const formItemProps = {
    handleGetCurrentRatio,
    handleCheckIsRatioExceedExcessie,
  };

  return (
    <Card>
      <Form form={form}>
        <CommonEditTable<IRecord, IColumnsExtraRecord, IFormValues>
          form={form}
          status={status}
          ref={EditTableRef}
          // tableProps={{
          //   virtual: true,
          //   scroll: { x: 700, y: 1000 },
          // }}
          initialValues={Array.from({ length: 3 }).map((_, index) => ({
            userName:
              '张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三张三',
            key: index,
          }))}
          columns={getColumns(formItemProps)}
          buttonLeft={[]}
          buttonRight={[
            {
              type: 'default',
              element: '添加到头部',
              visible: (renderProps, operation, status) => status == 'edit',
              itemProps: {
                buttonProps: {
                  onClick: (renderProps, operation, status, val) => {
                    operation.add({ userName: '张三' }, 0);
                  },
                },
              },
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
            (values, operation, status) => {
              return {
                type: 'delete',
                buttonType: 'default',
                element: '删除',
                itemProps: {
                  deleteText: '确认删除嘛',
                  handleDeleteConfirm: () => operation.remove(values.index),
                },
              };
            },
            // {
            //   type: 'delete',
            //   buttonType: 'default',
            //   element: '删除',
            //   itemProps: {
            //     deleteText: '确认删除嘛',
            //     handleDeleteConfirm: (renderProps, operation, status, val) => {
            //       operation.remove(renderProps.index);
            //     },
            //   },
            // },
          ]}
          beforeChildren={(values) => {
            return (
              <AccessBtn
                btnList={[
                  {
                    type: 'group',
                    itemProps: {
                      groupValue: status,
                      handleGroupValueOnChange: (value: ICommonEditTableProps['status']) =>
                        setStatus(value),
                      groupDict: [
                        { value: 'edit', label: '编辑视图' },
                        { value: 'view', label: '展示视图' },
                      ],
                    },
                  },
                ]}
              />
            );
          }}
          afterChildren={(values) => {
            if (status == 'view') return null;
            return (
              <div style={{ display: 'grid', placeContent: 'center' }}>
                <Button
                  type="link"
                  icon={<PlusCircleOutlined />}
                  onClick={() => {
                    values.operation.add({ userName: '张三', time: dayjs() });
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

export default React.memo(Demo);
