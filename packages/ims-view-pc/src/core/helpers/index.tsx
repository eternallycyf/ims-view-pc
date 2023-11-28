import { random } from '@ims-view/utils';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { AddIndexSignature, Ellipsis, Search } from 'ims-view-pc';
import _ from 'lodash';
import React from 'react';
import { FieldCompType } from '../../type/form';
import { formatNumber, formatPercent, formatTime, getDictMap, renderTooltip } from './utils';

const Simple = React.lazy(() => import('../../components/CustomForm/FormItem/simple'));
const Editor = React.lazy(() => import('../../components/CustomForm/FormItem/editor'));
const Update = React.lazy(() => import('../../components/CustomForm/FormItem/update'));
const Cascader = React.lazy(() => import('../../components/CustomForm/FormItem/cascader'));
const Mentions = React.lazy(() => import('../../components/CustomForm/FormItem/mentions'));

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

  fetchConfig,
  dict,
  record = {},
  controlProps = {} as any,
  itemProps = {} as any,
  Component,
}) => {
  let formProps: Partial<Search> = {
    label,
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

    case 'cascader':
      FieldComp = Cascader;
      break;
    case 'mentions':
      FieldComp = Mentions;
      break;
    // case 'select':
    //   if (dictConfig) formProps.dictConfig = dictConfig;
    //   FieldComp = require(`@/components/CustomForm/FormItem/select`).default;
    //   break;

    case 'update':
      FieldComp = Update;
      break;
    case 'editor':
      FieldComp = Editor;
      break;
    default:
      FieldComp = null;
  }

  if (!FieldComp) return null;

  if (form) {
    return (
      <Form.Item
        key={name || random.getUUID()}
        name={name}
        label={label ?? ''}
        {...(formProps?.itemProps as any)}
      >
        <FieldComp {...formProps} />
      </Form.Item>
    );
  } else {
    return <FieldComp key={name || random.getUUID()} {...formProps} />;
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

/**
 * 格式化表格 columns
 * @param data
 */
export function formatColumn(columns: any[]) {
  const defaultOptions = {
    format: 'YYYY-MM-DD',
    ellipsis: false,
    ellipsisType: 'line',
    rows: 1,
    maxLength: 100,
  };

  const deepData = _.cloneDeep(columns);
  const accessCollection = JSON.parse(sessionStorage.getItem('accessCollection') || '[]');

  return deepData
    .filter(({ acpCode }) => (acpCode ? accessCollection.includes(acpCode) : true))
    .map((item, index, arr) => {
      const options = {
        ...defaultOptions,
        ...item,
      };

      if (!item.render) {
        item.render = (newText: any) => {
          let text = newText;
          return _.isNil(text) ? '--' : text;
        };

        if (item.dict) {
          item.render = (newText: any) => {
            let text = newText;
            text = getDictMap(item.dict)[text];
            return _.isNil(text) ? '--' : text;
          };
        }

        if (item.formatTime) {
          item.render = (text: any) => formatTime(options, text);
        }

        if (item.formatPercent) {
          item.render = formatPercent;
        }

        if (Number.isInteger(item.formatNumber) || item.formatNumber) {
          item.render = (text: number) => formatNumber(item, text);
        }

        if (item.ellipsis) {
          item.ellipsis = {
            ellipsis: options?.ellipsis,
            isShowTitle: false,
          };
          item.render = (text: any) => {
            if (_.isNil(text)) return '--';
            let newText = text;
            if (item.dict) {
              const dictText = getDictMap(item.dict)[text];
              newText = _.isNil(dictText) ? '--' : dictText;
            }
            if (item.formatTime) newText = formatTime(options, text);
            if (item.formatPercent) newText = formatPercent(text);
            if (item.formatNumber) newText = formatNumber(item, text);

            return options.ellipsisType === 'line' ? (
              <Ellipsis lines={options.rows}>{newText}</Ellipsis>
            ) : (
              <Ellipsis length={options.maxLength}>{newText}</Ellipsis>
            );
          };
        }
      }

      if (item.tooltip) {
        const { title } = item;
        if (typeof item.tooltip === 'string') {
          item.title = () => renderTooltip(title, item.tooltip);
        } else if (typeof item.tooltip === 'function') {
          item.title = () => renderTooltip(title, item.tooltip());
        } else {
          const text =
            typeof item.tooltip.text === 'function'
              ? item.tooltip.text() || ''
              : item.tooltip.text || '';
          const extraText =
            item.tooltip.extraText === 'function'
              ? item.tooltip.extraText() || ''
              : item.tooltip.extraText || '';
          item.title = () => renderTooltip(title, text, extraText);
        }
      }
      item.className = `
      ${item.className ?? ''}
      ${(item.children && index !== arr?.length - 1) || arr[index + 1]?.children ? 'tableLine' : ''}
      ${item.align || 'left'}
      `;
      item.width += 20;

      if (item.children) {
        item.children = formatColumn(item.children || []);
      }
      return item;
    });
}
