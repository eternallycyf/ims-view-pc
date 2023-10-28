import { Button, Form, Switch } from 'antd';
import dayjs from 'dayjs';
import { ISearchesType, renderFormItem } from 'ims-view-pc';

const dict = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
] as const;
interface IRecord {
  input: string;
  radio: (typeof dict)[number]['value'];
  editor: string;
  custom: any;
}

export default () => {
  const [form] = Form.useForm();
  const formList: ISearchesType<IRecord, { customParams?: '2' }> = [
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
  ];

  return (
    <Form style={{ overflow: 'auto' }} form={form} onFinish={(value) => console.log(value)}>
      {formList.map((item) => renderFormItem({ ...item, form }))}
      <div>
        <Button type="primary" htmlType="submit">
          submit
        </Button>
      </div>
    </Form>
  );
};
