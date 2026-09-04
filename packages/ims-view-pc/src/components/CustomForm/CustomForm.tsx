import { ExclamationCircleFilled } from '@ant-design/icons';
import type { DrawerProps, ModalProps } from 'antd';
import { Alert, Button, Col, Drawer, Form, Modal, Row, Space, Spin } from 'antd';
import classnames from 'classnames';
import { renderFormItem, ScrollHorizontalCard, variables } from 'ims-view-pc';
import React, { Fragment, Suspense, useImperativeHandle, useMemo, useState, type ReactNode } from 'react';
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
        const itemKey = item?.name != null && String(item.name) !== '' ? String(item.name) : `form-item-${index}`;
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
                        {children?.map((ele: any, ind) => {
                          const childKey =
                            ele?.name != null && String(ele.name) !== '' ? String(ele.name) : `form-child-${ind}`;
                          if (!hasCol) {
                            return <Fragment key={childKey}>{getContent(ele)}</Fragment>;
                          }
                          return (
                            <Col key={childKey} style={ele?.itemProps?.style}>
                              {getContent(ele)}
                            </Col>
                          );
                        })}
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
        const content = getContent(item);
        if (item?.type === 'update' || !hasCol) {
          return <Fragment key={itemKey}>{content}</Fragment>;
        }
        return (
          <Col span={item?.col ?? 0} key={itemKey} className={`ant-form-item-${item?.type ?? ''}`}>
            {content}
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
    scrollX = false,
    scrollXMaxWidth = 600,
    tipMessage,
    showTipMessageIcon = true,
    destroyOnClose,
    destroyOnHidden,
    ...rest
  } = props as CustomFormProps<Values, Rest, Type> & {
    destroyOnClose?: boolean;
    destroyOnHidden?: boolean;
  };
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
    const formInstanceProps = { form: form || formProps?.form };
    return (
      <Form<Values>
        initialValues={initialValues!}
        onFinish={handleOnFinish}
        {...formProps}
        {...formInstanceProps}
        className={formProps?.className}
        style={{ height: '100%', width: '100%', ...formProps?.style }}
      >
        <Suspense fallback={<Spin />}>{node}</Suspense>
      </Form>
    );
  };

  const content = useMemo(() => {
    if (isInLine) {
      if (scrollX) {
        return (
          <div className="custom-form-scroll-x-wrapper" style={{ maxWidth: scrollXMaxWidth, overflowX: 'auto' }}>
            <ScrollHorizontalCard<any>
              itemWrapperStyle={{ minWidth: 'auto' }}
              items={formList.map((ele) => ({ ...ele, key: ele?.name }))}
              renderItem={(item) =>
                renderFormList(
                  [item].filter((ele) => ele?.visible ?? true),
                  !isInLine,
                )
              }
            />
          </div>
        );
      }
      return renderFormList(
        formList.filter((ele) => ele?.visible ?? true),
        !isInLine,
      );
    }
    return (
      <Row gutter={16} {...rowProps}>
        {renderFormList(
          formList.filter((ele) => ele?.visible ?? true),
          !isInLine,
        )}
      </Row>
    );
  }, [formList, isInLine, rowProps, scrollX, scrollXMaxWidth]);

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
    rootClassName: classnames('CustomForm', 'CustomModalDefaultScroll', rest?.className),
  };

  const renderSummiter = (
    params: Pick<ModalProps, 'cancelButtonProps' | 'okButtonProps'> & {
      cancelText?: React.ReactNode;
      okText?: React.ReactNode;
      footer?: any;
    },
  ): ReactNode => {
    if (props?.footer === null) return null;
    const cancelBtn = <Button {...params?.cancelButtonProps}>{params?.cancelText || '取消'}</Button>;
    const confirmBtn = (
      <Button
        type="primary"
        htmlType="submit"
        {...params.okButtonProps}
        className={`custom-form-confirm-btn ${params?.okButtonProps?.className}`}
        style={{ borderWidth: 1, ...params?.okButtonProps?.style }}
      >
        {params?.okText || '确定'}
      </Button>
    );

    if (typeof footer === 'function') {
      return <Space>{footer(cancelBtn, confirmBtn)}</Space>;
    }

    return (
      <Space>
        {cancelBtn}
        {confirmBtn}
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
        footer: typeof footer !== 'function' && footer ? footer : renderSummiter(WrapperProps),
        maskClosable: false,
        centered: true,
        ...WrapperProps,
        destroyOnHidden: destroyOnHidden ?? destroyOnClose,
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
        destroyOnHidden: destroyOnHidden ?? destroyOnClose,
        footer: typeof footer !== 'function' && footer ? footer : renderSummiter(WrapperProps),
        modalRender,
      } as ModalProps;
      break;
    default:
      Component = null;
  }

  return (
    <>
      {modalType === 'normal' ? (
        <div className={classnames(WrapperProps?.className, 'CustomModal')} style={{ height: '100%', width: '100%', ...WrapperProps.style }}>
          {WrapperProps?.open && (
            <Spin className="custom-form-normal-spin" spinning={loading} style={{ height: '100%', width: '100%' }}>
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
            <div className="customContainer">
              {tipMessage && (
                <div className="customContainer-tip">
                  <Alert
                    type="warning"
                    message={
                      <div className="customContainer-tip-alert-message">
                        {showTipMessageIcon && (
                          <div className="customContainer-tip-alert-message-icon">
                            <ExclamationCircleFilled style={{ color: variables?.colorWarning }} />
                          </div>
                        )}
                        <div className="customContainer-tip-alert-message-content">{tipMessage}</div>
                      </div>
                    }
                    className="customContainer-tip-alert"
                  />
                </div>
              )}

              <div className="customContainer-main">
                <Spin className="customContainer-main-spin" spinning={loading}>
                  {content}
                </Spin>
              </div>
            </div>
          </Component>
          {children}
        </>
      )}
    </>
  );
}

export default CustomForm;
