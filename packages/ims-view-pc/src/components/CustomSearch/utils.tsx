import { CalendarOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Suspense, type ReactNode } from 'react';
import { type Column, type FormControlType, type Search } from '../../type';
import CustomForm from '../CustomForm';

export interface GetColumnSearchConfig {
  filterIcon: ReactNode | ((filtered: boolean) => ReactNode);
}

export const getColumnsFilterIcon = (type: FormControlType) => {
  const dateTypes = [
    'time',
    'date',
    'week',
    'month',
    'quarter',
    'year',
    'timeRange',
    'dateRange',
    'weekRange',
    'monthRange',
    'quarterRange',
    'yearRange',
  ];
  const searchTypes = ['input', 'input', 'password', 'search', 'textarea', 'inputNumber'];

  if (dateTypes.includes(type)) {
    return <CalendarOutlined style={{ fontSize: 14 }} />;
  }

  if (searchTypes.includes(type)) {
    return <SearchOutlined style={{ fontSize: 14 }} />;
  }

  return <FilterOutlined style={{ fontSize: 14 }} />;
};

export const getColumnSearchItem = <
  Values,
  Rest extends {
    columnSearchType?: FormControlType;
  },
>(
  config: Search<Values, Rest>,
  value?: any,
): Pick<Column, 'filterDropdown' | 'filterIcon' | 'filteredValue'> => {
  const visible = config?.visible ?? true;
  if (!visible) return {};

  return {
    filterDropdown: () => {
      return (
        <>
          <div style={{ padding: 16 }}>
            <Suspense fallback={<Spin size="small" />}>
              {CustomForm.renderFormItem({
                ...config,
                form: true as any,
                itemProps: {
                  ...config?.itemProps,
                  style: {
                    marginBottom: 0,
                    ...config?.itemProps?.style,
                  },
                },
              })}
            </Suspense>
          </div>
        </>
      );
    },
    filteredValue: value,
    filterIcon: () => getColumnsFilterIcon(config?.type ?? config?.columnSearchType ?? 'select'),
  };
};
