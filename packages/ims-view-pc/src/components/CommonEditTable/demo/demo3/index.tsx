import { CloseOutlined, PlusCircleFilled, WarningOutlined } from '@ant-design/icons';
import { random } from '@ims-view/utils';
import { Button, Card, Col, Form, FormListFieldData, Row } from 'antd';
import { FormInstance } from 'antd/lib';
import { LabeledValue } from 'antd/lib/select';
import dayjs from 'dayjs';
import {
  CommonEditTable,
  ICommonEditTableColumnsType,
  ICommonEditTableProps,
  IUpdateSearchesType,
  renderFormItem,
} from 'ims-view-pc';
import _ from 'lodash';
import { useState } from 'react';

//#region
export interface ICustomerListRecord {
  time?: dayjs.Dayjs;
  customerName?: string;
}

export interface IColumnsExtraRecord {}

interface IActivityListBaseRecord {
  custName?: string;
  busiType?: (typeof BUSI_TYPE_DICT)[number]['value'];
  reason?: string;
}

type IActivityListRecord = IActivityListBaseRecord & { customerList?: ICustomerListRecord[] };

interface IFormValues {
  activityList?: IActivityListRecord[];
}

interface IGetColumnsParams {
  field: FormListFieldData;
  [props: string]: any;
}

interface IGetFormListParams {
  form: FormInstance<IFormValues>;
  status: ICommonEditTableProps['status'];
  field: FormListFieldData;
  [props: string]: any;
}
//#endregion

//#region
const BUSI_TYPE_DICT = [
  { label: '申请', value: '1' },
  { label: '退出', value: '2' },
];
const ITEM_PROPS = {
  style: {
    marginBottom: 16,
    width: '100%',
  },
};
//#endregion

//#region
export const getColumns: (
  params: IGetColumnsParams,
) => ICommonEditTableColumnsType<ICustomerListRecord, IColumnsExtraRecord, IFormValues>[] = (
  params,
) => {
  // 第几个活动
  const { field } = params;

  return [
    {
      dataIndex: 'time',
      title: '失效时间',
      hasRequiredMark: true,
      type: 'update',
      align: 'left',
      formItemProps: {
        itemProps: {
          shouldUpdate: () => true,
          next: (values, form, index) => {
            const currentValues = values?.activityList?.[field?.name]?.customerList?.[index];
            console.log(currentValues);
            return [
              {
                name: [index, 'time'],
                type: 'date',
                rules: [],
              },
            ];
          },
        },
      },
    },
    {
      dataIndex: 'customerName',
      title: '公司',
      hasRequiredMark: true,
      type: 'update',
      align: 'left',
      formItemProps: {
        itemProps: {
          shouldUpdate: () => true,
          next(values, form, index) {
            const currentValues = values?.activityList?.[field?.name]?.customerList?.[index];
            return [
              {
                name: [index, 'customerName'],
                title: '公司名称',
                type: 'custom',
                align: 'left',
                ellipsis: true,
                editable: false,
                Component() {
                  return currentValues?.customerName ?? '--';
                },
              },
            ];
          },
        },
      },
    },
  ];
};

export const getFormList = (
  params: IGetFormListParams,
): IUpdateSearchesType<IActivityListBaseRecord, { col?: number }, unknown, IFormValues> => {
  const { status, field } = params;
  const isDetail = status === 'view';
  return [
    {
      type: 'update',
      col: 24,
      itemProps: {
        noStyle: true,
        shouldUpdate: (pre, cru) => {
          return !_.isEqual(pre?.activityList?.[field?.name], cru?.activityList?.[field?.name]);
        },
        next: (values, form, index) => {
          const currentValues = values?.activityList?.[field?.name];
          return [
            {
              name: [field.name, 'busiType'],
              label: '类型',
              type: 'radio',
              rules: [{ required: true }],
              dict: BUSI_TYPE_DICT,
              allowClear: true,
              itemProps: ITEM_PROPS,
            },
          ];
        },
      },
    },
    {
      type: 'update',
      col: 24,
      itemProps: {
        noStyle: true,
        shouldUpdate: (pre, cru) => {
          return !_.isEqual(pre?.activityList?.[field?.name], cru?.activityList?.[field?.name]);
        },
        next: (values: IFormValues, form, index) => {
          const currentValues = values?.activityList?.[field?.name];
          if (currentValues?.busiType == '2') {
            return [
              {
                name: [field.name, 'custName'],
                label: '公司',
                type: 'input',
                col: 12,
                allowClear: true,
                placeholder: '请输入',
                rules: [{ required: true }],
                itemProps: ITEM_PROPS,
              },
            ];
          }
          return false;
        },
      },
    },
    {
      type: 'update',
      col: 24,
      itemProps: {
        noStyle: true,
        shouldUpdate: (pre, cru) => false,
        next: (values: IFormValues, form, index) => {
          return [
            {
              name: [field.name, 'reason'],
              label: '说明',
              type: 'textarea',
              col: 24,
              allowClear: true,
              placeholder: '请输入',
              // rules: [{ required: true }],
              controlProps: {
                maxLength: 1500,
                showCount: true,
                autoSize: {
                  minRows: 3,
                },
              },
            },
          ];
        },
      },
    },
  ];
};
//#endregion

const App: React.FC = () => {
  const [form] = Form.useForm<IFormValues>();
  const [status, setStatus] = useState<ICommonEditTableProps['status']>('edit');

  const handleInitPage = () => {
    form.setFieldsValue({
      activityList: [
        {
          busiType: '2',
          custName: 'a',
          reason: 'ASD',
          customerList: [
            {
              customerName: '添加到尾部',
              time: dayjs(),
            },
          ],
        },
        {
          busiType: '2',
          reason: 'ASD',
        },
      ],
    });
  };

  const formListParams = {
    status,
    form,
  };

  return (
    <div>
      <Button onClick={handleInitPage}>填充表单</Button>
      <Form<IFormValues> form={form} initialValues={{ activityList: [{}] }} layout="vertical">
        <Row gutter={16} style={{ width: '100%' }}>
          <Form.List name="activityList">
            {(activityListFields, { add, remove }, { errors }) => {
              return (
                <div
                  style={{ display: 'flex', rowGap: 16, flexDirection: 'column', width: '100%' }}
                >
                  {activityListFields.map((activityListFields) => (
                    <Card
                      size="small"
                      title={`活动${activityListFields.name + 1}`}
                      key={activityListFields.key}
                      extra={<CloseOutlined onClick={() => remove(activityListFields.name)} />}
                    >
                      {(
                        (status == 'view'
                          ? getFormList({ ...formListParams, field: activityListFields }) || []
                          : getFormList({ ...formListParams, field: activityListFields })) || []
                      ).map((item) => {
                        const Content = (
                          <Form.Item
                            labelAlign="left"
                            label={item.label as string}
                            name={item.name}
                            rules={item?.itemProps?.rules || []}
                            initialValue={item?.initialValue}
                            {...(item.itemProps as any)}
                          >
                            {renderFormItem(item)}
                          </Form.Item>
                        );
                        if (item.type == 'update') return Content;
                        return (
                          <Col
                            span={item?.['col'] ?? 12}
                            key={(item?.name as string) || random.getUUID()}
                          >
                            {Content}
                          </Col>
                        );
                      })}

                      <CommonEditTable<ICustomerListRecord, IColumnsExtraRecord, IFormValues>
                        form={form}
                        isMultiple
                        status={'edit'}
                        columns={getColumns({ field: activityListFields })}
                        buttonLeft={[]}
                        name={[activityListFields.name, 'customerList']}
                        buttonRight={[
                          {
                            type: 'default',
                            element: '添加到头部',
                            visible: (renderProps, operation, status) => status == 'edit',
                            itemProps: {
                              buttonProps: {
                                onClick: (renderProps, operation, status, val) => {
                                  operation.add({ customerName: '公司' }, 0);
                                },
                              },
                            },
                          },
                          {
                            buttonType: 'default',
                            element: '全部删除',
                            itemProps: {
                              buttonProps: {
                                onClick: (renderProps, operation, status, val) => {
                                  form.setFieldValue('activityList', []);
                                },
                                disabled: status == 'view',
                                icon: <WarningOutlined />,
                              },
                            },
                            visible: (renderProps, operation, status) => status == 'edit',
                          },
                        ]}
                        itemButton={[
                          {
                            type: 'delete',
                            buttonType: 'default',
                            element: '删除',
                            itemProps: {
                              deleteText: '确认删除嘛',
                              handleDeleteConfirm: (renderProps, operation, status, val) => {
                                operation.remove(renderProps.index);
                              },
                            },
                          },
                        ]}
                        afterChildren={(values) => {
                          if (status == 'view') return null;
                          return (
                            <div style={{ display: 'grid', placeContent: 'center' }}>
                              <Button
                                type="link"
                                icon={<PlusCircleFilled />}
                                onClick={() => values.operation.add({ customerName: '添加到尾部' })}
                              >
                                添加客户
                              </Button>
                            </div>
                          );
                        }}
                      />
                    </Card>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      添加活动
                    </Button>
                  </Form.Item>
                  <Form.ErrorList errors={errors} />
                </div>
              );
            }}
          </Form.List>
        </Row>
      </Form>

      <Button htmlType="submit" onClick={() => console.log(form.getFieldsValue())}>
        提交
      </Button>
    </div>
  );
};

export default App;
