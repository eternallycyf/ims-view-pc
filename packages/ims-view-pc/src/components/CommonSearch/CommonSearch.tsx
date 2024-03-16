import { DownOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Space, type FormInstance } from 'antd';
import { renderFormItem, type ISearchesType } from 'ims-view-pc';
import _ from 'lodash';
import React, { useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { variables } from '../../styles/variables';
import ErrorBoundary from '../ErrorBoundary';
import './index.less';
import type { CommonSearchContext, CommonSearchHandle, CommonSearchProps } from './interface';
import useSize from './useSize';
import { formatByAcpCode } from './utils';

const dateFormat = 'YYYYMMDD';
const monthFormat = 'YYYYMM';
const yearFormat = 'YYYY';
const quarterFormat = 'YYYY-Q';

const CommonSearch: React.ForwardRefRenderFunction<CommonSearchHandle, CommonSearchProps> = (
  props,
  ref,
) => {
  const {
    formList: defaultFormList = [],
    accessCollection = [],
    collapsed: defaultCollapsed = false,
    columnNumber = 4,

    onCollapse,
    onChange,
    onReset,
    onSearch,
    className,
    children,
  } = props;

  const [form] = Form.useForm();
  const wrapperRef = useRef<HTMLDivElement>(null!);

  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [searchParams, setSearchParams] = useState({});
  const { size, span, calcSpan } = useSize({ wrapperRef });

  const formList = formatByAcpCode(defaultFormList, accessCollection);

  const formatValues = (values) => {
    const _formList: ISearchesType = [];
    formList.forEach((item) => {
      _formList.push(item);
      item.children && _formList.push(...item.children);
    });
    const formDict = _.keyBy(_formList, 'name');
    const data: any = {};

    Object.keys(values).forEach((key) => {
      const sourceItem = formDict[key] as any;
      const format = sourceItem?.format;
      const value = values[key];

      if (!value && !_.isBoolean(value) && !_.isNumber(value)) return;
      data[key] = value;

      if (sourceItem.type === 'select' || sourceItem.type === 'treeSelect') {
        if (Array.isArray(value)) {
          data[key] = value.map((item) => item.key || item.value);
        } else {
          data[key] = value.key || value.value;
        }
      }

      if (sourceItem.type === 'date') {
        data[key] = (format && value.format(format)) || value.format(dateFormat);
      }

      if (sourceItem.type === 'year') {
        data[key] = (format && value.format(format)) || value.format(yearFormat);
      }

      if (sourceItem.type === 'quarter') {
        data[key] = (format && value.format(format)) || value.format(quarterFormat);
      }

      if (sourceItem.type === 'dateRange') {
        const [startTime, endTime] = value || [];
        if (!startTime || !endTime) return;

        const [startTimeKey, endTimeKey] = key.split(',');
        data[startTimeKey] = (format && startTime.format(format)) || startTime.format(dateFormat);
        data[endTimeKey] = (format && endTime.format(format)) || endTime.format(dateFormat);

        delete data[key];
      }

      if (sourceItem.type === 'month') {
        data[key] = (format && value.format(format)) || value.format(monthFormat);
      }

      if (sourceItem.type === 'monthRange') {
        const [startTime, endTime] = value || [];
        if (!startTime || !endTime) return;

        const [startTimeKey, endTimeKey] = key.split(',');
        data[startTimeKey] = startTime;
        data[endTimeKey] = endTime;

        delete data[key];
      }

      if (sourceItem.type === 'datetime' || sourceItem.type === 'time') {
        data[key] = value.unix();
      }

      if (sourceItem.transform) {
        data[key] = sourceItem.transform(value);
      }

      if (Array.isArray(sourceItem.fields) && sourceItem.transform) {
        const keyData = sourceItem.transform(value);
        sourceItem.fields.forEach((value: any, index: any, array: any) => {
          data[sourceItem.fields[index]] = keyData[index];
        });
      }
    });

    const result = _.pickBy(data, (item: any) => {
      if (_.isNumber(item) || _.isBoolean(item)) {
        return true;
      }
      return !_.isEmpty(item);
    });

    return {
      ...result,
      refresh_time: new Date().getTime(),
    };
  };

  const getRealValues = () => {
    const values = form.getFieldsValue();
    return [values, formatValues(values)] as const;
  };

  useImperativeHandle(ref, () => ({
    form,
    formatValues,
    getRealValues,
  }));

  const triggerSearch = (params) => {
    setSearchParams((defaultParams) => ({ ...defaultParams, ...params }));
    onSearch && onSearch(params);
  };

  const handleReset = () => {
    form.resetFields();
    const Values = form.getFieldsValue();
    triggerSearch(formatValues(Values));

    onReset && onReset(Values);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      triggerSearch(formatValues(values));
    });
  };

  const toggleForm = () => {
    setCollapsed((state) => !state);
    onCollapse && onCollapse(!collapsed);
    document.dispatchEvent(new Event('toggleForm'));
  };

  return (
    <ErrorBoundary>
      <div
        ref={wrapperRef}
        className={`ims-search-form-wrapper ${className}`}
        style={{
          '--colorPrimary': variables?.colorPrimary,
          '--colorPrimaryHover': variables.colorPrimaryHover,
          '--colorPrimaryActive': variables.colorPrimaryActive,
        }}
      >
        <Form
          size={size}
          layout="horizontal"
          onFieldsChange={onChange}
          form={form}
          onFinish={handleSubmit}
          labelWrap
          className="ims-search-form"
        >
          <Row align="middle" gutter={{ md: 4, lg: 12, xl: 24 }}>
            {formList.map((field, index) => {
              return (
                <Col key={index} span={calcSpan}>
                  {renderFormItem(field, index)}
                </Col>
              );
            })}

            <Col className="ims-search-form-action-wrapper">
              <Form.Item noStyle>
                <Space>
                  <Button
                    size="small"
                    htmlType="button"
                    className="btn-default ims-search-form-action-reset"
                    onClick={handleReset}
                  >
                    重置
                  </Button>
                  <Button
                    className="ims-search-form-action-submit"
                    type="primary"
                    htmlType="submit"
                    size="small"
                  >
                    查询
                  </Button>
                  <a className="ims-search-form-action" onClick={toggleForm}>
                    {collapsed ? '收起' : '展开'}
                    <DownOutlined className={`${collapsed ? 'close' : 'expand'}`} />
                  </a>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          {/* <Form.Item noStyle shouldUpdate={(pre, cru) => true}>
            {(form) => {
              const values = form.getFieldsValue();
              return (
                <div className="ims-search-form-children">
                  {children && children({ form, values })}
                </div>
              );
            }}
          </Form.Item> */}
        </Form>
      </div>
    </ErrorBoundary>
  );
};

export default CommonSearch;
