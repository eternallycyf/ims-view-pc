import { ConfigProvider, Form, InputNumber, Space } from 'antd';
import { AccessBtn } from 'ims-view-pc';
import React, { useState } from 'react';

export const ACTIVE_TYPE = [
  { label: '满折', value: '0' },
  { label: '满减', value: '1' },
  { label: '立减', value: '2' },
] as const;

const App: React.FC = () => {
  const [groupValue, getGroupValue] = useState<(typeof ACTIVE_TYPE)[number]['value']>('1');
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#00b96b',
          borderRadius: 2,

          // 派生变量，影响范围小
          colorBgContainer: '#f6ffed',
        },
      }}
    >
      <AccessBtn
        btnList={[
          {
            type: 'default',
            buttonType: 'link',
            element: '链接',
            itemProps: {
              buttonProps: {
                onClick: (e) => console.log(e),
              },
            },
          },
          {
            type: 'custom',
            element: (
              <Form.Item label="万" style={{ marginBottom: 0 }}>
                <InputNumber />
              </Form.Item>
            ),
          },
          {
            type: 'delete',
            element: '删除',
            itemProps: {
              deleteText: '确认删除嘛?',
              handleDeleteConfirm: (e) => console.log(e),
            },
          },
          {
            type: 'group',
            itemProps: {
              groupValue,
              handleGroupValueOnChange: (val: (typeof ACTIVE_TYPE)[number]['value']) =>
                getGroupValue(val),
              groupDict: ACTIVE_TYPE,
            },
          },
        ]}
      />
    </ConfigProvider>
  );
};

export default App;
