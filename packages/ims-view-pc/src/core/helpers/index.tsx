import { Form } from 'antd';
import dayjs from 'dayjs';
import { AddIndexSignature, Search } from 'ims-view-pc';
import _ from 'lodash';
import React from 'react';
import { FieldCompType } from '../../type/form';

const Simple = React.lazy(() => import('../../components/CustomForm/FormItem/simple'));
const Editor = React.lazy(() => import('../../components/CustomForm/FormItem/editor'));

/**
 * 获取控件
 * @param props
 */
export const getFieldComp: FieldCompType = ({
  form,
  name,
  label,
  type,
  initialValue: initValue,
  hidden,

  fetchConfig,
  dict,
  record = {},
  controlProps = {},
  itemProps = {},
  Component,
}) => {
  let formProps: Partial<Search> = {
    name,
    type: type ?? 'input',
    record,
    form,
    fetchConfig,
    dict,
    itemProps,
    controlProps,
    Component,
  };
  if (!fetchConfig) formProps = _.omit(formProps, ['fetchConfig']);

  let FieldComp: React.LazyExoticComponent<React.FC<any>> = null;

  // 特殊处理
  if (initValue) {
    itemProps.initialValue = initValue;
  }
  if (type === 'switch') {
    itemProps.valuePropName = 'checked';
  }
  if (['date', 'year', 'quarter', 'dateRange', 'month', 'time', 'monthRange'].includes(type)) {
    itemProps.initialValue = initValue && dayjs.isDayjs(initValue) ? dayjs(initValue) : undefined;
  }

  switch (type) {
    case 'input':
    case 'password':
    case 'search':
    case 'textarea':
    case 'radio':
    case 'checkbox':
    case 'rate':
    case 'switch':
    case 'slider':
    case 'inputNumber':
    case 'autoComplete':
    case 'date':
    case 'year':
    case 'quarter':
    case 'dateRange':
    case 'month':
    case 'time':
    case 'monthRange':
    case 'custom':
      FieldComp = Simple;
      break;
    // case 'select':
    //   if (dictConfig) formProps.dictConfig = dictConfig;
    //   FieldComp = require(`@/components/CustomForm/FormItem/select`).default;
    //   break;
    case 'editor':
      FieldComp = Editor;
      break;
    default:
      FieldComp = null;
  }

  if (!FieldComp) return null;

  if (form) {
    return (
      <Form.Item name={name} label={label ?? ''} {...formProps?.itemProps}>
        <FieldComp {...formProps} />
      </Form.Item>
    );
  } else {
    return <FieldComp {...formProps} />;
  }
};

export const renderFormItem = (item: any, index?: number) => {
  const { name, type, initialValue, formFieldProps, controlProps, ...otherProps } = item;
  const myControlProps = {
    ...controlProps,
    size: (controlProps && controlProps.size) || 'small',
  };
  const fieldProps = {
    name,
    type,
    initialValue,
    formFieldProps,
    controlProps: myControlProps,
    ...otherProps,
  };
  if (item.children) {
    return item.children.map((child: any, childIndex: number) => renderFormItem(child, childIndex));
  }
  return getFieldComp(fieldProps);
};
