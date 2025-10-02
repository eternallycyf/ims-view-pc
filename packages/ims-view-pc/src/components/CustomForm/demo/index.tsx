import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, ColorPicker, Form, Input, Row, Switch } from 'antd';
import dayjs from 'dayjs';
import {
  FormRenderer,
  ISearchesType,
  type FormControlType,
  type FormRendererConfig,
  type FormRendererHooks,
  type PluginFunction,
} from 'ims-view-pc';
import { Fragment } from 'react';

type CustomFormType = FormControlType | 'color';

const colorPickerPlugin: PluginFunction<
  FormRenderer<IRecord, { customParams?: '2' }, CustomFormType>,
  FormRendererConfig<IRecord, { customParams?: '2' }, CustomFormType>,
  FormRendererHooks<IRecord, { customParams?: '2' }, CustomFormType>
> = (host) => {
  host.hooks.renderFormItem.tap('ColorPicker', (item, originalRender) => {
    if (item.type === 'color') {
      return (
        <Form.Item name={item.name} label={item.label}>
          <ColorPicker />
        </Form.Item>
      );
    }
    return originalRender(item);
  });
};

const CustomformRenderer = new FormRenderer<IRecord, { customParams?: '2' }, CustomFormType>();
CustomformRenderer.setup({ plugins: [colorPickerPlugin] });

interface Option {
  value: string;
  label: string;
  children?: Option[];
  disabled?: boolean;
}

const dict = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
] as const;
const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
          {
            value: 'xiasha',
            label: 'Xia Sha',
            disabled: true,
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua men',
          },
        ],
      },
    ],
  },
];
const mentionsOptions = [
  {
    value: 'afc163',
    label: 'afc163',
  },
  {
    value: 'zombieJ',
    label: 'zombieJ',
  },
  {
    value: 'yesmeck',
    label: 'yesmeck',
  },
];
interface IRecord {
  cascader: string[];
  mentions: string;
  input: string;
  radio: (typeof dict)[number]['value'];
  editor: string;
  custom: any;
  update: AudioNode;
  updateInput: string;
  select: (typeof dict)[number]['value'];
  time: dayjs.Dayjs;
  date: dayjs.Dayjs;
  week: dayjs.Dayjs;
  month: dayjs.Dayjs;
  quarter: dayjs.Dayjs;
  year: dayjs.Dayjs;
  timeRange: dayjs.Dayjs[];
  dateRange: dayjs.Dayjs[];
  weekRange: dayjs.Dayjs[];
  monthRange: dayjs.Dayjs[];
  quarterRange: dayjs.Dayjs[];
  yearRange: dayjs.Dayjs[];
  color: any;
}

export default () => {
  const [form] = Form.useForm();
  const formList: ISearchesType<IRecord, { customParams?: '2' }, CustomFormType> = [
    {
      name: 'cascader',
      label: 'cascader',
      type: 'cascader',
      dict: options as any[],
    },
    {
      name: 'mentions',
      label: 'mentions',
      type: 'mentions',
      initialValue: '@afc163',
      controlProps: {},
      fetchConfig: {
        request(params) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(mentionsOptions);
            }, 2000);
          });
        },
      },
    },
    {
      name: 'time',
      label: 'time',
      type: 'time',
    },
    {
      name: 'date',
      label: 'date',
      type: 'date',
    },
    {
      name: 'week',
      label: 'week',
      type: 'week',
    },
    {
      name: 'month',
      label: 'month',
      type: 'month',
    },
    {
      name: 'quarter',
      label: 'quarter',
      type: 'quarter',
    },
    {
      name: 'year',
      label: 'year',
      type: 'year',
    },
    {
      name: 'timeRange',
      label: 'timeRange',
      type: 'timeRange',
    },
    {
      name: 'dateRange',
      label: 'dateRange',
      type: 'dateRange',
      itemProps: {
        rules: [{ required: true }],
      },
    },
    {
      name: 'weekRange',
      label: 'weekRange',
      type: 'weekRange',
    },
    {
      name: 'monthRange',
      label: 'monthRange',
      type: 'monthRange',
    },
    {
      name: 'quarterRange',
      label: 'quarterRange',
      type: 'quarterRange',
    },
    {
      name: 'yearRange',
      label: 'yearRange',
      type: 'yearRange',
    },

    {
      name: 'input',
      label: 'input',
      type: 'input',
      initialValue: 'input',
      customParams: '2',
    },
    {
      name: 'radio',
      label: 'radio',
      type: 'radio',
      dict,
      itemProps: {
        extra: '当值为3时 显示update表单',
      },
      controlProps: {
        buttonStyle: 'solid',
      },
      initialValue: 1,
    },
    {
      name: 'select',
      label: 'select',
      type: 'select',
      dict,
    },
    {
      name: 'updateInput',
      label: 'update',
      type: 'update',
      itemProps: {
        noStyle: true,
        shouldUpdate: (pre, cru) => pre.radio != cru.radio,
        next: (values, form) => {
          if (values?.radio != 3) return false;
          return [
            {
              label: 'update',
              name: 'updateInput',
              type: 'input',
            },
          ];
        },
      },
    },
    {
      name: 'editor',
      label: 'editor',
      type: 'editor',
      initialValue: '<h1>editor</h1>',
    },
    {
      name: 'custom',
      label: 'custom',
      type: 'custom',
      initialValue: true,
      Component: (props) => {
        return (
          <div>
            <Switch checked={!!props?.value} onChange={(e) => props.onChange(!props?.value)} />
            <div>{!!props?.value ? 'light' : 'dark'}</div>
          </div>
        );
      },
    },
    {
      label: 'list',
      type: 'custom',
      itemProps: {},
      Component(props) {
        return (
          <Form.List
            initialValue={[{ name: 1 }]}
            name="names"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(new Error('At least 1 passengers'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item noStyle key={field.key}>
                    <Row gutter={16}>
                      <Col>
                        <Form.Item name={[field.name, 'name']}>
                          <Input placeholder="passenger name" />
                        </Form.Item>
                      </Col>
                      <Col>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Col>
                    </Row>
                  </Form.Item>
                ))}
                <Form.Item noStyle>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add field
                  </Button>

                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        );
      },
    },
    {
      name: 'color',
      label: 'color',
      type: 'color',
    },
  ];

  return (
    <Form
      scrollToFirstError
      labelAlign="right"
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 21 }}
      style={{ overflow: 'auto' }}
      form={form}
      onFinish={(value) => console.log(value)}
    >
      {formList.map((item, index) => {
        return (
          <Fragment key={index}>{CustomformRenderer.renderFormItem({ ...item, form })}</Fragment>
        );
      })}
      <div>
        <Button type="primary" htmlType="submit">
          submit
        </Button>
      </div>
    </Form>
  );
};
