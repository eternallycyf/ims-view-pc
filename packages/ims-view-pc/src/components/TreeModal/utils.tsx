import _ from 'lodash';
import './index.less';
import { TreeModalData } from './interface';

/**
 * 数组转树型结构
 * @param data
 * @param pid
 */
export const arrayToTree = (data: TreeModalData[], pid: string | number): TreeModalData[] => {
  const result = [];
  let temp;
  for (const item of data) {
    if (item.pid == pid) {
      const obj = { ...item, key: item.id };
      temp = arrayToTree(data, item.id);
      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }

  return result as TreeModalData[];
};

export function filterTree(
  data: TreeModalData[] = [],
  selectedKeys: string[] = [],
  halfCheckedKeys: any[] = [],
): TreeModalData[] {
  function recursiveFilter(node: TreeModalData): TreeModalData | null {
    if (node.children) {
      const filteredChildren = (node.children || [])
        .map((child) => recursiveFilter(child))
        .filter(Boolean);

      if (filteredChildren.length > 0) {
        if (node.children) {
          node.children = filteredChildren as TreeModalData[];
        }
        //@ts-ignore
        return { ...node, checkable: !halfCheckedKeys.includes(node.id) };
      }
    }

    if (selectedKeys.includes(node.id) && !node.disable) {
      //@ts-ignore
      return { ...node, checkable: !halfCheckedKeys.includes(node.id) };
    }

    return null;
  }

  const filteredData = (data || []).map((item) => recursiveFilter(item)).filter(Boolean);
  return filteredData as TreeModalData[];
}

export const treeToArray = (tree: TreeModalData[]): TreeModalData[] => {
  let stack = tree,
    result = [];
  while (stack.length !== 0) {
    let pop = stack.pop();
    result.push(
      _.omit(
        {
          id: pop!.id,
          name: pop!.name,
          pid: pop!.pid,
          ...pop,
        },
        'children',
      ),
    );
    let children = pop!.children;
    if (children) {
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i]);
      }
    }
  }
  return (result as TreeModalData[]) || [];
};

export const getSearchData = (
  expandList: string[],
  searchValue: string,
  searchData: TreeModalData[],
): any[] => {
  const newData = searchData
    .map((item) => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substring(0, index);
      const afterStr = item.name.slice(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.name}</span>
        );

      if (item.children) {
        const matchingChildren = getSearchData(expandList, searchValue, item.children);

        if (matchingChildren.length > 0 || item.name.includes(searchValue)) {
          expandList.push(item.id);

          const newChildren =
            item.name.includes(searchValue) && matchingChildren.length == 0
              ? (item.children || []).map(
                  (ele) => matchingChildren?.find((e) => e.id == ele.id) || ele,
                )
              : matchingChildren;
          return { ...item, name: title, children: newChildren };
        }
      }
      return item.name.includes(searchValue) ? { ...item, name: title } : null;
    })
    .filter(Boolean);

  return newData;
};
