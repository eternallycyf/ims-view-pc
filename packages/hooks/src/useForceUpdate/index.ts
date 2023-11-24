import * as React from 'react';

/**
 * 自定义 hook 用于强制组件重新渲染。
 * @returns {() => void} - 一个函数，调用它将强制组件重新渲染。
 */
export default function useForceUpdate() {
  // 使用 useReducer 创建一个不依赖于组件状态的更新函数
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  return forceUpdate;
}
