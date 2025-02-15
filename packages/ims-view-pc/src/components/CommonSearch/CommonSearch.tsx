import { DownOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Space } from 'antd';
import { renderFormItem, type ISearchesType } from 'ims-view-pc';
import _ from 'lodash';
import RcResizeObserver from 'rc-resize-observer';
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { variables } from '../../styles/variables';
import ErrorBoundary from '../ErrorBoundary';
import './index.less';
import type { CommonSearchHandle, CommonSearchProps } from './interface';
import Line from './Line';
import { SearchContext } from './SearchContext';
import { formatByAcpCode, isBrowser } from './utils';

const timeFormat = 'HH:mm:ss';
const dateFormat = 'YYYYMMDD';
const weekFormat = 'YYYYWW';
const monthFormat = 'YYYYMM';
const quarterFormat = 'YYYY-Q';
const yearFormat = 'YYYY';

const BREAKPOINTS = {
  default: [
    [0, 531, 1],
    [531, 701, 2],
    [701, 1062, 3],
    [1062, 1352, 3],
    [1352, Infinity, 4],
  ],
} as const;

const defaultWidth = isBrowser() ? document.body.clientWidth : 1024;

const CommonSearch: React.ForwardRefRenderFunction<CommonSearchHandle, CommonSearchProps> = (
  props,
  ref,
) => {
  const {
    formList: defaultFormList = [],
    accessCollection = [],
    collapsed: defaultCollapsed = false,

    onCollapse,
    onChange,
    onReset,
    onSearch,
    className,
    children,

    loading,
    labelWidth = 80,
    itemBottomHeight = 4,
    hasDivider = true,
  } = props;

  const [form] = Form.useForm();

  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [searchParams, setSearchParams] = useState({});

  const [width, setWidth] = useState<number>(defaultWidth);
  const [spanSize, setSpanSize] = useState<number>(0);
  const [showIndex, setShowIndex] = useState<number>(1);

  const formList = formatByAcpCode(defaultFormList, accessCollection);

  useEffect(() => {
    const { default: defaultBreakPoints } = BREAKPOINTS;
    const filterItem = defaultBreakPoints.filter((item) => {
      return width >= item[0] && width < item[1];
    });
    setSpanSize(24 / filterItem[0][2]);
    setShowIndex(filterItem[0][2]);
  }, [width]);

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

      if (sourceItem?.type === 'select' || sourceItem?.type === 'treeSelect') {
        if (Array.isArray(value)) {
          data[key] = value.map((item) => item.key || item.value);
        } else {
          data[key] = value.key || value.value;
        }
      }

      if (sourceItem?.type === 'datetime' || sourceItem?.type === 'time') {
        data[key] = value.unix();
      }

      if (sourceItem?.type === 'date') {
        data[key] = (format && value.format(format)) || value.format(dateFormat);
      }

      if (sourceItem?.type === 'month') {
        data[key] = (format && value.format(format)) || value.format(monthFormat);
      }

      if (sourceItem?.type === 'quarter') {
        data[key] = (format && value.format(format)) || value.format(quarterFormat);
      }

      if (sourceItem?.type === 'year') {
        data[key] = (format && value.format(format)) || value.format(yearFormat);
      }

      if (sourceItem?.type === 'timeRange') {
        const [startTime, endTime] = value || [];
        if (!startTime || !endTime) return;

        const [startTimeKey, endTimeKey] = key.split(',');
        data[startTimeKey] = (format && startTime.format(format)) || startTime.format(timeFormat);
        data[endTimeKey] = (format && endTime.format(format)) || endTime.format(timeFormat);

        delete data[key];
      }

      if (sourceItem?.type === 'dateRange') {
        const [startTime, endTime] = value || [];
        if (!startTime || !endTime) return;

        const [startTimeKey, endTimeKey] = key.split(',');
        data[startTimeKey] = (format && startTime.format(format)) || startTime.format(dateFormat);
        data[endTimeKey] = (format && endTime.format(format)) || endTime.format(dateFormat);

        delete data[key];
      }

      if (sourceItem?.type === 'weekRange') {
        const [startTime, endTime] = value || [];
        if (!startTime || !endTime) return;

        const [startTimeKey, endTimeKey] = key.split(',');
        data[startTimeKey] = (format && startTime.format(format)) || startTime.format(weekFormat);
        data[endTimeKey] = (format && endTime.format(format)) || endTime.format(weekFormat);

        delete data[key];
      }

      if (sourceItem?.type === 'monthRange') {
        const [startTime, endTime] = value || [];
        if (!startTime || !endTime) return;

        const [startTimeKey, endTimeKey] = key.split(',');
        data[startTimeKey] = (format && startTime.format(format)) || startTime.format(monthFormat);
        data[endTimeKey] = (format && endTime.format(format)) || endTime.format(monthFormat);

        delete data[key];
      }

      if (sourceItem?.type === 'quarterRange') {
        const [startTime, endTime] = value || [];
        if (!startTime || !endTime) return;

        const [startTimeKey, endTimeKey] = key.split(',');
        data[startTimeKey] =
          (format && startTime.format(format)) || startTime.format(quarterFormat);
        data[endTimeKey] = (format && endTime.format(format)) || endTime.format(quarterFormat);

        delete data[key];
      }

      if (sourceItem?.type === 'yearRange') {
        const [startTime, endTime] = value || [];
        if (!startTime || !endTime) return;

        const [startTimeKey, endTimeKey] = key.split(',');
        data[startTimeKey] = (format && startTime.format(format)) || startTime.format(yearFormat);
        data[endTimeKey] = (format && endTime.format(format)) || endTime.format(yearFormat);

        delete data[key];
      }

      if (sourceItem?.transform) {
        data[key] = sourceItem.transform(value);
      }

      if (Array.isArray(sourceItem?.fields) && sourceItem?.transform) {
        const keyData = sourceItem.transform(value);
        sourceItem?.fields.forEach((value: any, index: any, array: any) => {
          data[sourceItem?.fields[index]] = keyData[index];
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

  const getFormItems = useCallback(() => {
    let offset;
    let spanSizeSum = spanSize;
    let collapsedVisible = true;
    const items = formList.map((item, index) => {
      const field = { ...item };

      if (collapsed && index && index > showIndex - 1) {
        field.itemProps = {
          ...field?.itemProps,
          hidden: true,
        };
      } else {
        spanSizeSum += spanSize;
      }

      if (item?.type === 'update') {
        return renderFormItem({ form, ...field }, index);
      }

      return (
        <Col span={!!field?.itemProps?.hidden ? 0 : spanSize} key={index}>
          {renderFormItem({ form, ...field }, index)}
        </Col>
      );
    });

    collapsedVisible = spanSizeSum !== 24 && items?.length !== 0 && items?.length !== 1;
    const spanSizeExtra = spanSizeSum % 24;
    if (spanSizeSum < 24) {
      offset = 0;
      collapsedVisible = false;
    } else if (spanSizeExtra === 0) {
      offset = 0;
    } else if (spanSizeExtra > spanSize && spanSizeExtra % spanSize !== 0) {
      offset = 24 - (24 - spanSizeExtra);
    } else if (spanSizeExtra % spanSize === 0) {
      offset = 24 - spanSizeExtra;
    } else {
      offset = 0;
    }
    return (
      <>
        {items}
        <Col style={{ textAlign: 'right' }} span={spanSize} offset={offset}>
          <Form.Item
            className="ims-search-form-action-wrapper"
            wrapperCol={{
              style: {
                maxWidth: '100%',
              },
            }}
          >
            <Space size={'middle'}>
              <Space>
                <Button
                  size="small"
                  htmlType="reset"
                  className="btn-default ims-search-form-action-reset"
                  onClick={handleReset}
                >
                  重置
                </Button>
                <Button
                  size="small"
                  type="primary"
                  htmlType="submit"
                  className="ims-search-form-action-submit"
                  loading={loading}
                >
                  查询
                </Button>
              </Space>
              {(collapsedVisible || !!collapsed) && (
                <Space>
                  <a className="ims-search-form-action" onClick={toggleForm}>
                    {collapsed ? '展开' : '收起'}
                    <DownOutlined
                      style={{
                        marginLeft: '0.5em',
                        transition: '0.3s all',
                        transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
                      }}
                    />
                  </a>
                </Space>
              )}
            </Space>
          </Form.Item>
        </Col>
      </>
    );
  }, [formList, spanSize, handleReset, loading, collapsed, toggleForm]);

  return (
    <ErrorBoundary>
      <RcResizeObserver onResize={(size) => setWidth(size.width)}>
        <div
          className={`ims-search-form-wrapper ${className}`}
          style={{
            '--colorPrimary': variables?.colorPrimary,
            '--colorPrimaryHover': variables.colorPrimaryHover,
            '--colorPrimaryActive': variables.colorPrimaryActive,
            '--itemBottomHeight': String(itemBottomHeight),
          }}
        >
          <Form
            layout="horizontal"
            onFieldsChange={onChange}
            form={form}
            onFinish={handleSubmit}
            labelWrap
            className="ims-search-form"
            labelCol={{ flex: `0 0 ${labelWidth}px` }}
            wrapperCol={{
              style: {
                maxWidth: `calc(100% - ${labelWidth}px)`,
              },
            }}
          >
            <Row wrap gutter={{ md: 4, lg: 12, xl: 24 }}>
              {getFormItems()}
              {children}
            </Row>
          </Form>
          {hasDivider && <Line />}
        </div>
      </RcResizeObserver>
    </ErrorBoundary>
  );
};

export default CommonSearch;
