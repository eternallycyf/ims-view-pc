import Icon, { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import { ForwardRefExoticComponent } from 'react';

export const urlPattern =
  /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;

/**
 * 事件绑定
 * @param target
 * @param eventType
 * @param callback
 * @returns {{remove(): void}}
 */
export const addEvent = (target: any, eventType: string, callback: () => void) => {
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, false);
    return {
      remove() {
        target.removeEventListener(eventType, callback, false);
      },
    };
  } else if (target.attachEvent) {
    target.attachEvent('on' + eventType, callback);
    return {
      remove() {
        target.detachEvent('on' + eventType, callback);
      },
    };
  }
};

/**
 * 将数组转变树
 * @param arr
 * @param option
 */
export const convertArrayToTree = (arr: any[], option?: any) => {
  const originArr = arr.map((item) => ({ ...item }));
  const options: any = {
    id: 'id',
    rootId: '0',
    parentId: 'parentId',
    children: 'children',
    ...option,
  };
  const arrayById = _.keyBy(originArr, options.id);

  const groupByParents = originArr.reduce((prev, item) => {
    let parentId = item[options.parentId];
    if (!parentId || !arrayById[parentId]) {
      parentId = options.rootId;
    }

    if (parentId && prev[parentId]) {
      prev[parentId].push(item);
      return prev;
    }
    prev[parentId] = [item];
    return prev;
  }, {});

  const rootNodes = groupByParents[options.rootId];
  const createTree = (nodes: any) => {
    const tree: any = [];
    if (nodes) {
      nodes.forEach((node: any) => {
        const childNode = groupByParents[node[options.id]];
        if (childNode) {
          node[options.children] = createTree(childNode);
        }
        tree.push(node);
      });
    }
    return tree;
  };
  return createTree(rootNodes);
};

export const getIcon = (icon: string, className?: string) => {
  if (typeof icon === 'string' && urlPattern.test(icon)) {
    return <img src={icon} alt="icon" className={className} />;
  }
  if (typeof icon === 'string') {
    return (
      <Icon
        component={icon as unknown as ForwardRefExoticComponent<any>}
        style={{ fontSize: 14, marginRight: 6 }}
        className={className}
      />
    );
  }
  return icon;
};

export const renderTooltip = (
  title: string | Function = '',
  tooltip: React.ReactNode = '',
  extraText: React.ReactNode = '',
) => {
  return (
    <div>
      <span style={{ marginRight: 4 }}>{typeof title === 'function' ? title() : title}</span>
      <Tooltip title={tooltip}>
        <QuestionCircleOutlined
          style={{
            marginLeft: 2,
            fontSize: 12,
            color: 'rgb(153,153,153)',
          }}
        />
      </Tooltip>
      {extraText}
    </div>
  );
};

export const formatNumber = (options: any, value: number) => {
  let fractionDigits = typeof options.formatNumber === 'number' ? options.formatNumber : 2;
  let number = value;
  if (typeof options.formatNumber === 'function') {
    const customOptions = options.formatNumber(Number(value));
    if (Array.isArray(customOptions)) {
      number = customOptions?.[0];
      fractionDigits = customOptions?.[1];
    } else {
      number = customOptions;
    }
  }

  if (_.isNil(value)) return '--';
  if (isNaN(Number(value))) return value;
  return Number(number).toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

export const formatPercent = (value: number) => {
  if (_.isNil(value)) return '--';
  if (isNaN(Number(value))) return value;
  return (value * 100)?.toFixed(2) + '%';
};

export const formatTime = (options: any, text: any) => {
  if (_.isNil(text)) return '--';
  if (typeof options.formatTime === 'object') {
    const { format, type } = options.formatTime;
    return dayjs(text, type).format(format);
  }
  return dayjs(text).format(options.format);
};

export function getDictMap(dict: any) {
  const dictMap: any = {};
  dict.forEach((item: any) => (dictMap[item.value] = item.text));
  return dictMap;
}

export function mergeProps<A, B>(a: A, b: B): B & A;
export function mergeProps<A, B, C>(a: A, b: B, c: C): C & B & A;
export function mergeProps(...items: any[]) {
  function customizer(objValue: any, srcValue: any) {
    return srcValue === undefined ? objValue : srcValue;
  }

  let ret = { ...items[0] };
  for (let i = 1; i < items.length; i++) {
    ret = _.assignWith(ret, items[i], customizer);
  }
  return ret;
}
