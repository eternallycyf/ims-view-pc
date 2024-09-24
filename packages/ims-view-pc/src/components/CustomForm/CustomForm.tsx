import { Button, Col, Drawer, Form, Modal, Row, Space, Spin, type ModalProps } from 'antd';
import { renderFormItem } from 'ims-view-pc';
import React, {
  useImperativeHandle,
  useMemo,
  useState,
  type ForwardRefRenderFunction,
} from 'react';
import { ModalTypeEnum, type CustomFormHandle, type CustomFormProps } from '.';
import './index.less';
const CustomForm: ForwardRefRenderFunction<CustomFormHandle, CustomFormProps> = (props, ref) => {
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
    modalType = 'normal',
    children,
    ...rest
  } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const form = useMemo(() => {
    return defaultForm ? defaultForm : formRef?.current;
  }, []);

  useImperativeHandle(ref, () => ({
    form,
  }));
  const getFormValues = () => form.getFieldsValue();

  const handleOnFinish = async (values) => {
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
        <Form<any>
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

  const content = useMemo(() => {
    return (
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
    );
  }, [formList, form]);

  let WrapperProps: any = {
    modalRender,
    afterClose: () => onDestroy && onDestroy(),
    destroyOnClose: true,
    forceRender: true,
    getContainer: false,
    open: visible,
    cancelButtonProps: { onClick: () => onCancel && onCancel(getFormValues()) },
    okButtonProps: {
      htmlType: 'submit',
      loading,
    },
    ...rest,
    className: `plus-modal ${rest?.className}`,
  };

  const renderSummiter = (WrapperProps) => {
    if (WrapperProps?.footer === null) return null;
    return (
      <Space>
        <Button {...WrapperProps?.cancelButtonProps}>{WrapperProps?.cancelText || '取消'}</Button>
        <Button type="primary" {...WrapperProps.okButtonProps}>
          {WrapperProps?.okText || '确定'}
        </Button>
      </Space>
    );
  };

  let Component = null;
  switch (modalType) {
    case ModalTypeEnum.drawer:
      Component = Drawer;
      WrapperProps = {
        onClose: () => {
          onCancel && onCancel(getFormValues());
        },
        footer: renderSummiter(WrapperProps),
        drawerRender: modalRender,
        ...WrapperProps,
      };
      break;
    case ModalTypeEnum.modal:
      Component = Modal;
      WrapperProps = {
        onCancel: () => {
          onCancel && onCancel(getFormValues());
        },
        ...WrapperProps,
        modalRender,
      };
      break;
    default:
      Component = null;
  }

  return (
    <div className="CustomForm">
      {modalType === 'normal' ? (
        <>
          {modalRender(
            <>
              {content}
              {renderSummiter(WrapperProps)}
              {children}
            </>,
          )}
        </>
      ) : (
        <Component {...WrapperProps}>
          {content}
          {children}
        </Component>
      )}
    </div>
  );
};

export default CustomForm;
