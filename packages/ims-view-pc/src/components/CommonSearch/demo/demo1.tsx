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
  ['startTime,endTime']: dayjs.Dayjs[];
  ['startDate,endDate']: dayjs.Dayjs[];
  ['startWeek,endWeek']: dayjs.Dayjs[];
  ['startMonth,endMonth']: dayjs.Dayjs[];
  ['startQuerater,endQuerater']: dayjs.Dayjs[];
  ['startYear,endYear']: dayjs.Dayjs[];
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  startWeek: dayjs.Dayjs;
  endWeek: dayjs.Dayjs;
  startMonth: dayjs.Dayjs;
  endMonth: dayjs.Dayjs;
  startQuerater: dayjs.Dayjs;
  endQuerater: dayjs.Dayjs;
  startYear: dayjs.Dayjs;
  endYear: dayjs.Dayjs;
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
      name: 'startTime,endTime',
      label: 'timeRange',
      type: 'timeRange',
    },
    {
      name: 'startDate,endDate',
      label: 'dateRange',
      type: 'dateRange',
      itemProps: {
        rules: FormRules.withName('dateRange').isRequired().create(),
      },
    },
    {
      name: 'startWeek,endWeek',
      label: 'weekRange',
      type: 'weekRange',
    },
    {
      name: 'startMonth,endMonth',
      label: 'monthRange',
      type: 'monthRange',
    },
    {
      name: 'startQuerater,endQuerater',
      label: 'quarterRange',
      type: 'quarterRange',
    },
    {
      name: 'startYear,endYear',
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
