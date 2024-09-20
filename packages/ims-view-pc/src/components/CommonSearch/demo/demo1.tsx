import { CommonSearch, FormRules, type ICommonSearchType } from 'ims-view-pc';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Switch } from 'antd';
import dayjs from 'dayjs';

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

const Demo = () => {
  const formList: ICommonSearchType<IRecord, { customParams?: '2' }> = [
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
        rules: FormRules.withName('dateRange').isRequired().create(),
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
      controlProps: {
        buttonStyle: 'solid',
      },
      initialValue: 1,
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
  ];

  return (
    <>
      <CommonSearch<IRecord, { customParams?: '2' }>
        formList={formList}
        onSearch={(values) => console.log(values)}
      >
        <Col span={12}>
          <Form.Item name="aaa" label="aa" rules={FormRules.withName('aa').isRequired().create()}>
            <Input />
          </Form.Item>
        </Col>
      </CommonSearch>
    </>
  );
};

export default Demo;
