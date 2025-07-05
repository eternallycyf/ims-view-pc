---
title: validate
description: 校验表单的工具方法
toc: content
group:
  title: 表单
order: 25
demo:
  cols: 2
---

```tsx
import React from 'react';
import { Form } from 'antd';
import { CustomForm, FormRules } from 'ims-view-pc';

interface IFormValues {
  name: string;
  name2: string;
  phone: string;
}

const App: React.FC = () => {
  const [form] = Form.useForm<IFormValues>();

  return (
    <>
      <CustomForm<IFormValues, {}, 'normal'>
        modalType="normal"
        initialValues={{ name: 'custom' }}
        form={form}
        formProps={{ form, layout: 'vertical' }}
        onFinish={async (values) => {
          console.log(values);
        }}
        formList={[
          {
            type: 'input',
            label: 'name',
            name: 'name',
            col: 24,
            itemProps: {
              rules: FormRules.withName('name').isRequired().create(),
            },
          },
          {
            type: 'input',
            label: 'name2',
            name: 'name2',
            col: 24,
            itemProps: {
              rules: FormRules.withName('name').isRequired().string(0, 10).create(),
            },
          },
          {
            type: 'input',
            label: 'phone',
            name: 'phone',
            col: 24,
            itemProps: {
              rules: FormRules.withName('phone').isRequired().phone().create(),
            },
          },
        ]}
      />
    </>
  );
};

export default App;
```
