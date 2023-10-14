import { Form } from 'antd';
import dayjs from 'dayjs';
import { getFieldComp } from 'ims-view-pc/core/helpers';

const dict = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
] as const;

export default () => {
  const [form] = Form.useForm();
  return (
    <Form form={form}>
      {getFieldComp<{ xx: dayjs.Dayjs; name: (typeof dict)[number]['value'] }>({
        form,
        name: 'xx',
        label: '表单',
        type: 'input',
        controlProps: {},
        itemProps: {
          tooltip: 'xxx',
          required: true,
        },
        // initialValue: dayjs(),
      })}
    </Form>
  );
};
