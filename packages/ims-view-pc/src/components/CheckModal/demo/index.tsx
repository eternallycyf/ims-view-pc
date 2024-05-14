import { Button, Form } from 'antd';
import { CheckModal } from 'ims-view-pc';
import React from 'react';

const App: React.FC = () => {
  const [form] = Form.useForm();
  const CheckModalRef = React.useRef<React.ElementRef<typeof CheckModal>>(null!);

  const onFinish = (values: any) => {
    const { modal } = values;

    const newModal = CheckModalRef.current.mapKeysDeep(modal, (value, key) => {
      if (key === '账号') return 'account';
      if (key === '姓名') return 'name';
      if (key === 'label') return 'text';
      if (key === 'value' && typeof value === 'string') return 'key';

      return key;
    });

    const initData = {
      value: {
        account: {
          '0': {
            text: 'x',
            key: 'x',
          },
          '1': {
            text: 'xx',
            key: 'xx',
          },
        },
        name: {
          '0': {
            text: '张三',
            key: '3',
          },
          '1': {
            text: 'xxx',
            key: '8',
          },
        },
      },
      account: {
        '0': {
          text: 'x',
          key: 'x',
        },
        '1': {
          text: 'xx',
          key: 'xx',
        },
      },
      name: {
        '0': {
          text: '张三',
          key: '3',
        },
        '1': {
          text: 'xxx',
          key: '8',
        },
      },
    };

    const initModal = CheckModalRef.current.mapKeysDeep(initData, (value, key) => {
      if (key === 'account') return '账号';
      if (key === 'name') return '姓名';
      if (key === 'text') return 'label';
      if (key === 'key') return 'value';
      return key;
    });

    console.log(newModal, initModal);
  };

  return (
    <div style={{ width: 500 }}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="modal"
          label="账户权限"
          rules={[{ validator: (cruVal: any, allVal: any) => Promise.resolve() }]}
          initialValue={{
            value: {
              账号: [{ label: 'x', value: 'x' }],
              姓名: [{ label: '张三', value: '3' }],
            },
            账号: [{ label: 'x', value: 'x' }],
            姓名: [{ label: '张三', value: '3' }],
          }}
          style={{ marginBottom: 0 }}
        >
          <CheckModal
            CheckModalRef={CheckModalRef}
            form={form}
            name="modal"
            onOk={(val) => console.log(val)}
            option={{
              账号: [
                { label: 'x', value: 'x' },
                { label: 'xx', value: 'xx' },
                { label: 'xxx', value: 'xxx' },
              ],
              姓名: [
                { label: '张三', value: '3' },
                { label: '李四', value: '4' },
                { label: '王五', value: '5' },
                { label: 'x', value: '6' },
                { label: 'xx', value: '7' },
                { label: 'xxx', value: '8' },
                { label: 'xxxx', value: '9' },
                { label: 'xxxxx', value: '10' },
                { label: 'xxxxxx', value: '11' },
                { label: 'xxxxxx', value: '12' },
              ],
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
