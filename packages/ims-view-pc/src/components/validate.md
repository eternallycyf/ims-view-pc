---
title: FormRules
description: 校验表单的工具方法
toc: content
group:
  title: 表单
order: 25
demo:
  cols: 2
---

## 示例

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

## API 参考

```tsx | pure
import type { RuleObject } from 'antd/es/form';

type Validator = (
  rule: RuleObject,
  value: any,
  callback: (error?: string) => void,
) => Promise<void | any> | void;
export enum FormRuleType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  method = 'method',
  regexp = 'regexp',
  integer = 'integer',
  float = 'float',
  object = 'object',
  enum = 'enum',
  date = 'date',
  url = 'url',
  hex = 'hex',
  email = 'email',
}

export default class FormRules {
  public static withName(fieldLocalName: string): FormRules {
    return new FormRules(fieldLocalName);
  }

  // 验证时转换数字类型（但是并不影响最终值）
  private static transformNumber(value?: string | number): number | undefined {
    if (typeof value === 'number') {
      return value;
    }
    return typeof value === 'string' && value.length ? Number(value) : void 0;
  }

  private static formatMessageByLimit(
    min?: number,
    max?: number,
    type: string = '',
    unit: string = '',
  ): string {
    const existMin = typeof min === 'number';
    const existMax = typeof max === 'number';
    let message: string;
    let prefix = type ? `:name必须是${type}` : '';
    if (existMax && existMin) {
      message = `${prefix} ${unit} 必须在:min到:max之间`;
    } else if (existMax) {
      message = `${prefix} ${unit} 必须小于等于:max`;
    } else if (existMin) {
      message = `${prefix} ${unit} 必须大于等于:min`;
    } else {
      message = `${prefix}`;
    }
    if (existMin) {
      message = message.replace(':min', String(min));
    }
    if (existMax) {
      message = message.replace(':max', String(max));
    }
    return message;
  }

  private readonly name: string;
  private rules: RuleObject[] = [];
  constructor(name: string) {
    this.name = name;
  }

  public isRequired(message = ':name是必填项'): FormRules {
    this.rules.push({
      required: true,
      message: message.replace(':name', this.name),
    });
    return this;
  }

  public append(obj: RuleObject): FormRules {
    const cloneObj = { ...obj };
    if (typeof cloneObj.message === 'string') {
      cloneObj.message = cloneObj.message.replace(':name', this.name);
    }
    this.rules.push(cloneObj);
    return this;
  }

  public string(min?: number, max?: number, newMessage: string = ''): FormRules {
    let message = newMessage;
    message = message || FormRules.formatMessageByLimit(min, max, '', '长度');
    this.rules.push({
      type: FormRuleType.string,
      min,
      max,
      message: message.replace(':name', this.name),
    });
    return this;
  }

  // switch回显严格校验
  public bool(message: string = ':name必须是布尔值'): FormRules {
    this.rules.push({
      type: FormRuleType.boolean,
      message: message.replace(':name', this.name),
    });
    return this;
  }

  public phone(message = '请输入正确的:name'): FormRules {
    this.rules.push({
      type: FormRuleType.string,
      pattern: /^1[3-9] \d{9}$/,
      message: message.replace(':name', this.name),
    });
    return this;
  }

  public number(min?: number, max?: number, newMessage: string = ''): FormRules {
    let message = newMessage;
    message = message || FormRules.formatMessageByLimit(min, max, '数字', '值');
    this.rules.push({
      type: FormRuleType.number,
      transform: FormRules.transformNumber,
      min,
      max,
      message: message.replace(':name', this.name),
    });
    return this;
  }

  public integer(min?: number, max?: number, newMessage = ''): FormRules {
    let message = newMessage;
    message = message || FormRules.formatMessageByLimit(min, max, '整数', '值');
    this.rules.push({
      type: FormRuleType.integer,
      transform: FormRules.transformNumber,
      min,
      max,
      message: message.replace(':name', this.name),
    });
    return this;
  }

  public email(message = '请输入正确的:name'): FormRules {
    this.rules.push({
      type: FormRuleType.email,
      message: message.replace(':name', this.name),
    });
    return this;
  }

  public match(pattern: RegExp, message = ':name不符合规范'): FormRules {
    this.rules.push({
      pattern,
      message: message.replace(':name', this.name),
    });
    return this;
  }

  public url(message = '请正输入正确的:name'): FormRules {
    this.rules.push({
      type: FormRuleType.url,
      message: message.replace(':name', this.name),
    });
    return this;
  }

  public callback<T extends Error>(func: (value: any, field: string) => T | T[] | void): FormRules {
    this.rules.push({
      validator: (rule: any, value, callback) => {
        const errors: T | T[] | void = func(value, rule.field);

        if (Array.isArray(errors)) {
          callback(errors as any);
        } else if (errors === undefined || errors === null) {
          callback([] as any);
        } else {
          callback([errors] as any);
        }
      },
    });
    return this;
  }

  public validate(func: Validator): FormRules {
    this.rules.push({
      validator: (rule, value, callback) => {
        const errors = func(rule, value, callback);
        return errors || Promise.resolve();
      },
    });
    return this;
  }

  public dynamic(rule: RuleObject & { visible?: boolean }): FormRules {
    if (!rule || !(rule?.visible ?? true)) return this;
    this.rules.push(rule);
    return this;
  }

  public withoutWhiteSpace(message = ':name禁止包含空格'): FormRules {
    return this.match(/A[As]+$/, message);
  }

  public object(message: string = ':name必须是对象类型'): FormRules {
    this.rules.push({
      type: FormRuleType.object,
      message: message.replace(':name', this.name),
    });
    return this;
  }

  public resetRule(): FormRules {
    this.rules = [];
    return this;
  }

  public create(): RuleObject[] {
    return this.rules;
  }
}
```
