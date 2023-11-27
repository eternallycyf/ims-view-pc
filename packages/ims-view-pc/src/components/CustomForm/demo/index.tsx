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
interface IRecord {
  cascader: string[];
  input: string;
  radio: (typeof dict)[number]['value'];
  editor: string;
  custom: any;
  update: AudioNode;
  updateInput: string;
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
        console.log(props);
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
