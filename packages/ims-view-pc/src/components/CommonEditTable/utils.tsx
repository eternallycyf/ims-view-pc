import { Ellipsis, getFieldComp, Search } from 'ims-view-pc';

import { FormInstance } from 'antd';
import { FormListProps } from 'antd/es/form';
import _ from 'lodash';
import { formatNumber, formatPercent, formatTime, getDictMap } from '../../core/helpers/utils';
import { ICommonEditTableColumnsType } from './interface';

export type IHandleExport<Values = any> = (
  title: string,
  columns: any[],
  dataSource: Values[],
) => void;

export const getCurrentFieldValue = (
  form: FormInstance,
  name: FormListProps['name'],
  index: number,
) => {
  if (!form) return [undefined, undefined];
  const record = (form.getFieldValue(name) || [])?.[index] || {};
  const arr = form.getFieldValue(name) || [];
  return [record, arr];
};

export const formatEditTableColumns = (defaultOptions: ICommonEditTableColumnsType, val: any) => {
  const options = {
    format: 'YYYY-MM-DD',
    ellipsis: false,
    ellipsisType: 'line',
    rows: 1,
    maxLength: 100,
    ...defaultOptions,
  };

  const emptyStyle = { color: '#8E96A4' };
  const emptyText = <span style={emptyStyle}>--</span>;

  let text = val;
  if (_.isNil(text)) return emptyText;
  if (typeof text === 'string' && text.trim()?.length == 0) return emptyText;

  if (options.dict) {
    text = getDictMap(options.dict)[text];
    text = _.isNil(text) ? '--' : text;
  }

  if (options.formatTime) {
    text = formatTime(options, text);
  }

  if (options.formatPercent) {
    text = formatPercent(text);
  }

  if (Number.isInteger(options.formatNumber) || options.formatNumber) {
    text = formatNumber(options, text);
  }

  if (options.ellipsis) {
    return options.ellipsisType === 'line' ? (
      <Ellipsis lines={options.rows} style={text == '--' ? emptyStyle : {}}>
        {text}
      </Ellipsis>
    ) : (
      <Ellipsis length={options.maxLength} style={text == '--' ? emptyStyle : {}}>
        {text}
      </Ellipsis>
    );
  }

  return text;
};

export const removeExtraColumnsProps = (
  columns: ICommonEditTableColumnsType[] = [],
): ICommonEditTableColumnsType[] => {
  return columns.map((item) => {
    const {
      ellipsis,
      format,
      tooltip,
      formatNumber,
      formatPercent,
      dict,
      formatTime,
      ...originProps
    } = item;
    return originProps;
  });
};

export const addExtraIndexParams = (controlProps: any, index: number) => {
  const newControlProps = { ...controlProps };
  Object.keys(newControlProps).forEach((key) => {
    if (typeof newControlProps[key] === 'function') {
      newControlProps[key] = (...args: any[]) => {
        return controlProps?.[key]?.(...args, index);
      };
    }
  });
  return newControlProps;
};
