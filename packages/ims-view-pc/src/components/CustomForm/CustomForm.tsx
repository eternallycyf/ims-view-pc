import type { DrawerProps, ModalProps } from 'antd';
import { Button, Col, Drawer, Form, Modal, Row, Space, Spin } from 'antd';
import { renderFormItem } from 'ims-view-pc';
import React, { useImperativeHandle, useMemo, useState } from 'react';
import { ModalTypeEnum } from './';
import './index.less';
import type { CustomFormHandle, CustomFormList, CustomFormProps } from './interface';

export const renderFormList = <Values, Rest, Type>(
  formList: CustomFormList<Values, Rest, Type>,
  hasCol = true,
) => {
  return (
    <>
      {(formList || []).map((item, index) => {
        const getContent = (item: any) => {
          if (!item?.children) {
            return (
              <Form.Item
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
                  const renderChildren = (children = []) => (
                    <Form.Item
                      label={item?.label}
                      shouldUpdate={item?.itemProps?.shouldUpdate || (() => true)}
                      {...item?.itemProps}
                    >
                      <Row style={{ width: '100%' }}>
                        {children?.map((ele: any, ind) => (
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
                    return renderChildren(nextValues || []);
                  } else {
                    if (item?.children?.length === 0 || !item?.children) return null;
                    return renderChildren(item.children || []);
                  }
                } else {
                  return renderFormItem(item);
                }
              }}
            </Form.Item>
          );
        };
        if (item?.type === 'update') return getContent(item);
        if (!hasCol) return getContent(item);
        return (
          <Col span={item?.col ?? 0} key={index} className={`ant-form-item-${item?.type ?? ''}`}>
            {getContent(item)}
          </Col>
        );
      })}
    </>
  );
};

type WrapperPropsType = (ModalProps | DrawerProps) & {
  rootClassName?: string;
};

function CustomForm<
  Values = Record<string, unknown>,
  Rest = Record<string, unknown>,
  Type = ModalTypeEnum.modal,
>(props: CustomFormProps<Values, Rest, Type>, ref: React.Ref<CustomFormHandle<Values>>) {
  const {
    onCancel,
    onDestroy,
    onFinish,
    initialValues,
    formProps = {},
    form,
    open,
    formList = [],
    loading: globalLoading = false,
    modalType = ModalTypeEnum.modal,
    children,
    footer,
    rowProps,
    bodyScrollHeight = 500,
    ...rest
  } = props;
  const [_loading, setLoading] = useState<boolean>(false);
  const isInLine = formProps?.layout === 'inline';
  const loading = _loading || globalLoading;

  const getFormValues = () => {
    return form?.getFieldsValue() || ({} as Values);
  };

  useImperativeHandle(ref, () => ({
    form: form!,
  }));

  const handleOnFinish = async (values: Values) => {
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
    const formInstanceProps = { form };
    return (
      <Form<Values>
        initialValues={initialValues!}
        onFinish={handleOnFinish}
        {...formProps}
        {...formInstanceProps}
        className={`h-full w-full ${formProps?.className}`}
      >
        {node}
      </Form>
    );
  };

  const content = useMemo(() => {
    return (
      <Row gutter={16} {...rowProps}>
        {renderFormList(
          formList.filter((ele) => ele?.visible ?? true),
          !isInLine,
        )}
      </Row>
    );
  }, [formList, isInLine, rowProps]);

  let WrapperProps: WrapperPropsType = {
    modalRender,
    afterClose: () => onDestroy && onDestroy(),
    forceRender: true,
    open: modalType === 'normal' ? open ?? true : open,
    ...rest,
    style: {
      ...rest?.style,
      '--body-scroll-height': bodyScrollHeight,
    },
    okButtonProps: {
      htmlType: 'submit',
      loading,
      ...rest?.okButtonProps,
    },
    cancelButtonProps: {
      ...rest?.cancelButtonProps,
      onClick: rest?.cancelButtonProps?.onClick || (() => onCancel && onCancel(getFormValues())),
    },
    rootClassName: `CustomForm CustomModalDefaultScroll  ${rest?.className}`,
  };

  const renderSummiter = (
    params: Pick<ModalProps, 'footer' | 'cancelButtonProps' | 'okButtonProps'> & {
      cancelText?: React.ReactNode;
      okText?: React.ReactNode;
    },
  ) => {
    if (props?.footer === null) return null;
    return (
      <Space>
        <Button {...params?.cancelButtonProps}>{params?.cancelText || '取消'}</Button>
        <Button type="primary" htmlType="submit" {...params.okButtonProps}>
          {params?.okText || '确定'}
        </Button>
      </Space>
    );
  };

  let Component: any = null;
  switch (modalType) {
    case ModalTypeEnum.drawer:
      Component = Drawer;
      WrapperProps = {
        onClose: () => {
          onCancel && onCancel(getFormValues());
        },
        footer: footer ?? renderSummiter(WrapperProps),
        maskClosable: false,
        centered: true,
        ...WrapperProps,
        drawerRender: modalRender,
      } as DrawerProps;
      break;
    case ModalTypeEnum.modal:
      Component = Modal;
      WrapperProps = {
        onCancel: () => {
          onCancel && onCancel(getFormValues());
        },
        centered: true,
        maskClosable: false,
        ...WrapperProps,
        footer: footer ?? renderSummiter(WrapperProps),
        modalRender,
      } as ModalProps;
      break;
    default:
      Component = null;
  }

  return (
    <>
      {modalType === 'normal' ? (
        <div
          className={['h-full w-full', WrapperProps?.className].join(' ')}
          style={WrapperProps.style}
        >
          {WrapperProps?.open && (
            <Spin className="h-full w-full" spinning={loading}>
              {modalRender(
                <>
                  {content}
                  {renderSummiter(WrapperProps)}
                  {children}
                </>,
              )}
            </Spin>
          )}
        </div>
      ) : (
        <>
          <Component {...WrapperProps}>
            <Spin className="h-full w-full" spinning={loading}>
              {content}
            </Spin>
          </Component>
          {children}
        </>
      )}
    </>
  );
}

export default CustomForm;
