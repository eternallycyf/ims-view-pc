import Icon from '@ant-design/icons';
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
