import type { FormInstance, FormProps, ModalProps } from 'antd';
import { Col, Form, Modal, Row, Spin } from 'antd';
import { AnyObject, Search, renderFormItem } from 'ims-view-pc';
import React, { RefObject, useState } from 'react';

export type ICustomModalFormList<Values = AnyObject, Rest = AnyObject, Extra = unknown> = (Search<
  Values,
  Rest,
  Extra
> & {
  col?: number;
  children?:
    | Search<Values, Rest, Extra>
    | ((
        values: Values,
        form: FormInstance<Values>,
      ) => ICustomModalFormList<Values, Rest, Extra> | false);
})[];

export interface FormModalProps<Values = AnyObject, Rest = AnyObject, Extra = unknown>
  extends Omit<ModalProps, 'onCancel'> {
  form?: FormInstance<Values>;
  formRef?: RefObject<FormInstance<Values>>;
  visible?: boolean;
  loading?: boolean;
  formList?: ICustomModalFormList<Values, Rest, Extra>;
  children?: React.ReactNode;
  initialValues?: Values;
  onFinish?: FormProps<Values>['onFinish'];
  formProps?: Omit<FormProps<Values>, 'initialValues' | 'onFinish'>;
  onCancel?: (values: Values) => any;
  onDestroy?: Function;
}

function FormModal<T = AnyObject, R = AnyObject>(props: FormModalProps<T, R>) {
  const {
    onCancel,
    onDestroy,
    onFinish,
    initialValues,
    formProps = {},
    form: defaultForm,
    formRef,
    formList = [],
    visible,
    loading: globalLoading = false,
    ...rest
  } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const getFormValues = () => {
    const form = defaultForm ? defaultForm : formRef?.current;
    return form.getFieldsValue();
  };

  const handleOnFinish = async (values: T) => {
    if (loading) return;
    setLoading(true);
    try {
      await onFinish?.(values);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const modalRender: ModalProps['modalRender'] = (node) => {
    const formInstanceProps = defaultForm ? { form: defaultForm } : { ref: formRef };
    return (
      <Spin spinning={globalLoading}>
        <Form
          initialValues={initialValues}
          onFinish={handleOnFinish}
          {...formProps}
          {...formInstanceProps}
        >
          {node}
        </Form>
      </Spin>
    );
  };

  return (
    <Modal
      modalRender={modalRender}
      afterClose={() => onDestroy?.()}
      onCancel={() => onCancel?.(getFormValues())}
      cancelButtonProps={{ onClick: () => onCancel?.(getFormValues()) }}
      okButtonProps={{ htmlType: 'submit', loading }}
      forceRender
      open={visible}
      {...rest}
      rootClassName={`plus-modal ${rest?.className}`}
    >
      <Row gutter={16}>
        {(formList || []).map((item, index) => {
          const getContent = (item) => {
            if (!item?.children) {
              return (
                <Form.Item
                  labelAlign="left"
                  label={item?.label}
                  name={item?.name}
                  rules={item?.rules || item?.itemProps?.rules || []}
                  initialValue={item?.initialValue}
                  {...item?.itemProps}
                >
                  {renderFormItem(item)}
                </Form.Item>
              );
            }
            return (
              <Form.Item
                key={index}
                labelAlign="left"
                noStyle
                shouldUpdate={item?.itemProps?.shouldUpdate || (() => true)}
              >
                {(form) => {
                  if (item?.children) {
                    const values = form.getFieldsValue();
                    const _renderChildren = (_children = []) => (
                      <Form.Item
                        label={item?.label}
                        shouldUpdate={item?.itemProps?.shouldUpdate || (() => true)}
                        {...item?.itemProps}
                      >
                        <Row style={{ width: '100%' }}>
                          {_children?.map((ele, ind) => (
                            <Col key={ind} style={ele?.itemProps?.style}>
                              {getContent(ele)}
                            </Col>
                          ))}
                        </Row>
                      </Form.Item>
                    );

                    if (typeof item?.children === 'function') {
                      const nextValues = item?.children(values, form);
                      if (nextValues === false) return null;
                      if (React.isValidElement(nextValues) && !Array.isArray(nextValues)) {
                        return nextValues;
                      }
                      return _renderChildren(nextValues || []);
                    } else {
                      if (item?.children?.length == 0 || !item?.children) return null;
                      return _renderChildren(item.children || []);
                    }
                  } else {
                    return renderFormItem(item);
                  }
                }}
              </Form.Item>
            );
          };
          if (item?.type == 'update') return getContent(item);
          return (
            <Col span={item?.col ?? 0} key={index} className={`ant-form-item-${item?.type ?? ''}`}>
              {getContent(item)}
            </Col>
          );
        })}
      </Row>
    </Modal>
  );
}
export default FormModal;
