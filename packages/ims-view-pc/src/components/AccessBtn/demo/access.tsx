import { Form, InputNumber } from 'antd';
import { AccessBtn } from 'ims-view-pc';
import { useState } from 'react';

export const ACTIVE_TYPE = [
  { label: '满折', value: '0' },
  { label: '满减', value: '1' },
  { label: '立减', value: '2' },
] as const;

const Access = () => {
  const [groupValue, getGroupValue] = useState<(typeof ACTIVE_TYPE)[number]['value']>('1');
  return (
    <AccessBtn
      accessCollection={['link', 'delete', 'group']}
      btnList={[
        {
          type: 'default',
          buttonType: 'link',
          element: '链接',
          code: 'link',
          itemProps: {
            buttonProps: {
              onClick: (e) => console.log(e),
            },
          },
        },
        {
          type: 'custom',
          code: 'custom',
          element: (
            <Form.Item label="万" style={{ marginBottom: 0 }}>
              <InputNumber />
            </Form.Item>
          ),
        },
        {
          type: 'delete',
          element: '删除',
          code: 'delete',
          itemProps: {
            deleteText: '确认删除嘛?',
            handleDeleteConfirm: (e) => console.log(e),
          },
        },
        {
          type: 'group',
          code: 'group',
          itemProps: {
            groupValue,
            handleGroupValueOnChange: (val: (typeof ACTIVE_TYPE)[number]['value']) =>
              getGroupValue(val),
            groupDict: ACTIVE_TYPE,
          },
        },
      ]}
    />
  );
};

export default Access;
