import { Button, Form, Switch } from 'antd';
import dayjs from 'dayjs';
import { ISearchesType, renderFormItem } from 'ims-view-pc';
import React, { Fragment } from 'react';

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
}

export default () => {
  const [form] = Form.useForm();
  const formList: ISearchesType<IRecord, { customParams?: '2' }> = [
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
      Component: React.forwardRef((props, ref) => {
        return (
          <div>
            <Switch checked={!!props?.value} onChange={(e) => props.onChange(!props?.value)} />
            <div>{!!props?.value ? 'light' : 'dark'}</div>
          </div>
        );
      }),
    },
  ];

  return (
    <Form style={{ overflow: 'auto' }} form={form} onFinish={(value) => console.log(value)}>
      {formList.map((item, index) => (
        <Fragment key={index}>{renderFormItem({ ...item, form })}</Fragment>
      ))}
      <div>
        <Button type="primary" htmlType="submit">
          submit
        </Button>
      </div>
    </Form>
  );
};
