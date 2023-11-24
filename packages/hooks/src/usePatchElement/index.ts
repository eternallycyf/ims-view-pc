import * as React from 'react';

/**
 * 自定义 hook 用于动态管理 React 元素列表。
 * @returns {[React.ReactElement[], (element: React.ReactElement) => () => void]} - 一个包含元素列表和操作元素的函数的数组。
 */
export default function usePatchElement(): [
  React.ReactElement[],
  (element: React.ReactElement) => () => void,
] {
  // 使用 useState 创建状态来存储 React 元素列表
  const [elements, setElements] = React.useState<React.ReactElement[]>([]);

  /**
   * 添加或移除元素的函数。
   * @param {React.ReactElement} element - 要添加的 React 元素。
   * @returns {() => void} - 一个函数，调用它将移除之前添加的元素。
   */
  const patchElement = React.useCallback((element: React.ReactElement) => {
    // 在元素列表中添加新元素
    setElements((originElements) => [...originElements, element]);

    // 返回一个函数，该函数将移除之前添加的元素
    // 这类似于 useEffect 的清理函数
    return () => {
      setElements((originElements) => originElements.filter((ele) => ele !== element));
    };
  }, []);

  // 返回包含元素列表和操作元素的函数的数组
  return [elements, patchElement];
}
