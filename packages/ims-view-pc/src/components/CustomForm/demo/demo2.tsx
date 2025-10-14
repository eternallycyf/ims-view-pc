import { Button, Drawer, Form, message, Modal, Switch } from 'antd';
import { AccessBtn, CustomForm, CustomFormList } from 'ims-view-pc';
import { useState } from 'react';

interface IFormValues {
  name: string;
  updateInput?: string;
  custom?: boolean;
  start?: string;
  end?: string;
}

export const ModalType = [
  { label: 'normal', value: 'normal' },
  { label: 'modal', value: 'modal' },
  { label: 'drawer', value: 'drawer' },
] as const;

const App: React.FC = () => {
  const [form] = Form.useForm<IFormValues>();
  const [open, setOpen] = useState(false);
  const [groupValue, setGroupValue] = useState<(typeof ModalType)[number]['value']>('normal');

  return (
    <>
      <AccessBtn
        btnList={[
          {
            type: 'group',
            itemProps: {
              groupValue,
              handleGroupValueOnChange: (val: any) => {
                setGroupValue(val);
                setOpen(true);
              },
              groupDict: ModalType,
            },
          },
        ]}
      />
      <CustomForm<IFormValues, {}, 'drawer'>
        modalType={groupValue}
        title="新增"
        initialValues={{ name: 'custom' }}
        open={groupValue === 'normal' ? true : open}
        form={form}
        formProps={{ form, layout: 'vertical' }}
        onFinish={async (values) => {
          console.log(values);
          return new Promise((resolve, reject) => {
            if (values.name == 'custom') {
              message.error('自定义的错误');
              const error = 'error';
              // eslint-disable-next-line no-promise-executor-return
              return reject(error);
            }
            form
              .validateFields()
              .then(() => {
                setTimeout(() => {
                  message.success('success');
                  setOpen(false);
                  return resolve();
                }, 1500);
              })
              .catch(() => {
                return reject('');
              });
          });
        }}
        onCancel={() => setOpen(false)}
        formList={[
          {
            type: 'input',
            label: 'name',
            name: 'name',
            col: 24,
            itemProps: {
              rules: [{ required: true, message: '请输入name' }],
            },
          },
          {
            type: 'update',
            col: 24,
            itemProps: {
              noStyle: true,
              shouldUpdate: (pre, cru) => pre?.name != cru?.name,
              next(values, form, index) {
                if (values?.name != 'custom') return false;
                return [
                  {
                    label: 'update',
                    col: 24,
                    name: 'updateInput',
                    type: 'input',
                  },
                ];
              },
            },
          },
          {
            type: 'update',
            col: 12,
            label: '组合',
            itemProps: {
              shouldUpdate: () => true,
              style: { marginBottom: 16, padding: '0 8px', width: '100%' },
            },
            children: (values, form) => {
              if (!values?.name) return false;
              const arr: CustomFormList<IFormValues> = [
                {
                  type: 'input',
                  name: 'start',
                  itemProps: {
                    style: {
                      marginBottom: 0,
                      flex: 1,
                    },
                  },
                },
                {
                  type: 'custom',
                  Component: () => (
                    <span style={{ display: 'flex', justifyContent: 'center' }}>-</span>
                  ),
                  itemProps: {
                    style: {
                      marginBottom: 0,
                      display: 'flex',
                      minWidth: 25,
                      justifyContent: 'center',
                    },
                  },
                },
                {
                  type: 'input',
                  name: 'end',
                  itemProps: {
                    style: {
                      marginBottom: 0,
                      flex: 1,
                    },
                  },
                },
              ];
              return arr;
            },
          },
          {
            name: 'custom',
            label: 'custom',
            type: 'custom',
            initialValue: true,
            col: 24,
            Component: (props) => {
              return (
                <div>
                  <Switch
                    checked={!!props?.value}
                    onChange={(e) => props.onChange(!props?.value)}
                  />
                  <div>{!!props?.value ? 'light' : 'dark'}</div>
                </div>
              );
            },
          },
        ]}
      />
    </>
  );
};

export default App;
